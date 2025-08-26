import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 强制动态渲染，避免静态生成问题
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('=== Testing Supabase Connection ===');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Missing environment variables');
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: {
          NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
          SUPABASE_SERVICE_ROLE_KEY: !!supabaseKey
        }
      }, { status: 500 });
    }
    
    console.log('✅ Environment variables found');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('🔗 Supabase client created');
    
    // 测试连接 - 尝试查询 surveys 表
    console.log('🧪 Testing database connection...');
    const { data, error } = await supabase
      .from('surveys')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error);
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: error
      }, { status: 500 });
    }
    
    console.log('✅ Database connection successful');
    console.log('📊 Table accessible, data:', data);
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      data: {
        tableAccessible: true,
        recordCount: data?.length || 0
      }
    });
    
  } catch (error) {
    console.error('❌ Test connection failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Test connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
