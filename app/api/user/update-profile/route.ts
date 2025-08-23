import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { userId, updates } = await request.json();
    
    if (!userId || !updates) {
      return NextResponse.json(
        { error: '缺少必要参数：userId 或 updates' },
        { status: 400 }
      );
    }

    // 更新用户档案
    const { data, error } = await supabase
      .from('genie_users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('更新用户档案失败:', error);
      return NextResponse.json(
        { error: '更新用户档案失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '用户档案更新成功',
      data
    });
  } catch (error) {
    console.error('更新用户档案失败:', error);
    return NextResponse.json(
      { error: '更新用户档案失败' },
      { status: 500 }
    );
  }
}
