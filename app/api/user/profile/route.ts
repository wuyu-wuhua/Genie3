import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

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
    
    // 从genie_users表获取用户信息
    const { data: userData, error: userError } = await supabase
      .from('genie_users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      if (userError.code === 'PGRST116') {
        // 用户不存在，返回null
        return NextResponse.json(null);
      }
      console.error('获取用户档案失败:', userError);
      return NextResponse.json(
        { error: '获取用户档案失败' },
        { status: 500 }
      );
    }

    return NextResponse.json(userData);

  } catch (error) {
    console.error('获取用户档案异常:', error);
    return NextResponse.json(
      { error: '获取用户档案异常' },
      { status: 500 }
    );
  }
}
