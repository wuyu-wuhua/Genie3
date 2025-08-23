import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userEmail, userName } = body;

    if (!userId) {
      return NextResponse.json(
        { error: '缺少用户ID' },
        { status: 400 }
      );
    }

    // 在服务端安全地使用环境变量
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('环境变量未设置:', { 
        supabaseUrl: !!supabaseUrl, 
        supabaseServiceKey: !!supabaseServiceKey 
      });
      return NextResponse.json(
        { error: '服务器配置错误' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 检查用户是否已存在
    const { data: existingUser, error: selectError } = await supabase
      .from('genie_users')
      .select('id, current_credits, total_earned_credits, email, name')
      .eq('id', userId)
      .single();

    // 如果用户已存在，检查是否需要更新信息
    if (existingUser) {
      console.log('用户已存在:', existingUser);
      
      // 检查是否需要更新用户信息（比如邮箱或用户名）
      let needsUpdate = false;
      let updateData: any = {};
      
      if (userEmail && userEmail !== existingUser.email) {
        updateData.email = userEmail;
        needsUpdate = true;
      }
      
      // 如果用户名为默认值，尝试更新为更好的用户名
      if (userName && userName !== '新用户' && userName !== '用户') {
        updateData.name = userName;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        console.log('更新用户信息:', updateData);
        const { data: updatedUser, error: updateError } = await supabase
          .from('genie_users')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select('id, current_credits, total_earned_credits, email, name')
          .single();
          
        if (updateError) {
          console.error('更新用户信息失败:', updateError);
        } else {
          console.log('用户信息更新成功:', updatedUser);
          return NextResponse.json({
            success: true,
            message: '用户信息已更新',
            user: updatedUser,
            isNew: false
          });
        }
      }
      
      return NextResponse.json({
        success: true,
        message: '用户已存在',
        user: existingUser,
        isNew: false
      });
    }

    // 如果是查询错误而不是用户不存在
    if (selectError && selectError.code !== 'PGRST116') {
      console.error('查询用户失败:', selectError);
      return NextResponse.json(
        { error: '查询用户失败' },
        { status: 500 }
      );
    }
    
    // 检查用户是否已有积分记录（可能通过其他方式创建）
    const { data: existingCredits } = await supabase
      .from('genie_credit_balances')
      .select('current_credits, total_earned_credits')
      .eq('user_id', userId)
      .single();
    
    // 如果用户已有积分记录，不要覆盖
    if (existingCredits && existingCredits.current_credits > 0) {
      console.log('用户已有积分记录，跳过创建:', existingCredits);
      return NextResponse.json({
        success: true,
        message: '用户已有积分记录',
        user: { id: userId, current_credits: existingCredits.current_credits },
        isNew: false
      });
    }

    // 创建新用户记录
    console.log('创建新用户记录...');
    console.log('接收到的用户信息:', { userId, userEmail, userName });
    
    // 改进用户名逻辑
    let displayName = userName;
    if (!displayName || displayName === '新用户' || displayName === '用户') {
      if (userEmail && userEmail !== `${userId}@temp.com`) {
        // 从邮箱提取用户名
        displayName = userEmail.split('@')[0];
      } else {
        displayName = '用户';
      }
    }
    
    console.log('最终使用的用户名:', displayName);
    
    const { data: newUser, error: insertError } = await supabase
      .from('genie_users')
      .insert({
        id: userId,
        email: userEmail || `${userId}@temp.com`,
        name: displayName,
        current_credits: 50,
        total_earned_credits: 50,
        current_plan: 'free',
        plan_status: 'inactive',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, current_credits, total_earned_credits, email, name')
      .single();

    if (insertError) {
      console.error('创建用户记录失败:', insertError);
      console.error('错误详情:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
      
      // 特殊处理：如果是因为 genie_credit_transactions 表不存在的错误
      if (insertError.message && insertError.message.includes('genie_credit_transactions')) {
        console.log('检测到触发器问题，尝试手动处理...');
        
        // 这里我们需要告诉用户问题的原因和解决方案
        return NextResponse.json(
          { 
            error: '数据库触发器错误',
            details: '数据库中存在引用已删除表的触发器，需要管理员清理',
            code: 'TRIGGER_ERROR',
            solution: '请联系管理员删除 award_new_user_bonus_trigger 触发器'
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { 
          error: '创建用户记录失败',
          details: insertError.message,
          code: insertError.code
        },
        { status: 500 }
      );
    }

    console.log('新用户记录创建成功:', newUser);
    
    return NextResponse.json({
      success: true,
      message: '新用户创建成功并获得50积分！',
      user: newUser,
      isNew: true
    });

  } catch (error) {
    console.error('创建用户失败:', error);
    return NextResponse.json(
      { error: '创建用户失败' },
      { status: 500 }
    );
  }
}
