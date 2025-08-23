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
      .select('id, current_credits, total_earned_credits')
      .eq('id', userId)
      .single();

    let userRecord = existingUser;

    // 如果用户不存在，返回错误让前端处理
    if (selectError && selectError.code === 'PGRST116') {
      console.log('用户不存在，需要先创建用户记录');
      return NextResponse.json(
        { 
          error: '用户不存在',
          message: '需要先创建用户记录',
          code: 'USER_NOT_EXISTS'
        },
        { status: 404 }
      );
    } else if (selectError) {
      // 其他查询错误
      console.error('查询用户记录失败:', selectError);
      return NextResponse.json(
        { error: '查询用户记录失败' },
        { status: 500 }
      );
    }

    // 如果用户已有积分，检查是否需要更新
    if (userRecord && userRecord.current_credits > 0) {
      console.log('用户已有积分，无需更新:', userRecord);
      return NextResponse.json({
        success: true,
        message: '用户积分已存在',
        balance: {
          current_credits: userRecord.current_credits,
          total_earned_credits: userRecord.total_earned_credits
        },
        isNew: false
      });
    }

    // 为新用户添加50积分（如果之前没有积分）
    if (userRecord && userRecord.current_credits === 0) {
      console.log('为用户添加50积分...');
      
      const { data, error } = await supabase
        .from('genie_users')
        .update({
          current_credits: 50,
          total_earned_credits: 50,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('id, current_credits, total_earned_credits, updated_at')
        .single();

      if (error) {
        console.error('更新用户积分失败:', error);
        return NextResponse.json(
          { error: '更新用户积分失败' },
          { status: 500 }
        );
      }
      
      console.log(`为用户 ${userId} 添加50积分成功:`, data);
      
      return NextResponse.json({
        success: true,
        message: '用户获得50积分！',
        balance: {
          current_credits: data.current_credits,
          total_earned_credits: data.total_earned_credits
        },
        isNew: true
      });
    }

    // 如果用户是新创建的，直接返回
    if (userRecord) {
      return NextResponse.json({
        success: true,
        message: '新用户创建成功并获得50积分！',
        balance: {
          current_credits: userRecord.current_credits,
          total_earned_credits: userRecord.total_earned_credits
        },
        isNew: true
      });
    }

    // 如果所有逻辑都失败，返回错误
    return NextResponse.json(
      { error: '无法处理用户积分' },
      { status: 500 }
    );

  } catch (error) {
    console.error('添加积分失败:', error);
    return NextResponse.json(
      { error: '添加积分失败' },
      { status: 500 }
    );
  }
}
