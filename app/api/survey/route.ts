import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 强制动态渲染，避免静态生成问题
export const dynamic = 'force-dynamic';

// 创建Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    console.log('=== Survey API called ===');
    console.log('Environment check:', {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'
    });
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    // 验证必填字段
    if (!body.role || !body.usecases || body.usecases.length === 0 || !body.freq || !body.fallback) {
      console.log('❌ Validation failed: missing required fields');
      console.log('Validation details:', {
        role: !!body.role,
        usecases: body.usecases?.length || 0,
        freq: !!body.freq,
        fallback: !!body.fallback
      });
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 验证联系方式同意
    if ((body.email || body.wechat || body.telegram) && !body.consent) {
      console.log('❌ Validation failed: contact consent required');
      return NextResponse.json(
        { error: '若填写联系方式，请勾选同意条款' },
        { status: 400 }
      );
    }

    // 准备插入数据
    const surveyData = {
      role: body.role,
      usecases: body.usecases,
      experience: body.experience || '',
      interest: body.interest || 0,
      selling: body.selling || [],
      concerns: body.concerns || [],
      freq: body.freq,
      price: body.price || '',
      fallback: body.fallback,
      integration: body.integration || [],
      env: body.env || [],
      latency: body.latency || '',
      magic: body.magic || '',
      beta: body.beta || [],
      email: body.email || '',
      wechat: body.wechat || '',
      telegram: body.telegram || '',
      consent: body.consent || false,
      region: body.region || '',
      lang: body.lang || '',
      created_at: new Date().toISOString(),
      ip_address: request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown'
    };

    // 插入到数据库
    console.log('📝 Inserting survey data:', JSON.stringify(surveyData, null, 2));
    console.log('🔗 Attempting database connection...');
    
    try {
      const { data, error } = await supabase
        .from('surveys')
        .insert([surveyData])
        .select();

      if (error) {
        console.error('❌ Database error:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return NextResponse.json(
          { error: `数据库存储失败: ${error.message}` },
          { status: 500 }
        );
      }

      console.log('✅ Database insert successful');
      console.log('🎉 Survey submitted successfully:', data);
      console.log('=== Survey API completed ===');
      return NextResponse.json({
        success: true,
        message: '调查表单提交成功',
        data: data
      });
      
    } catch (dbError) {
      console.error('❌ Database operation failed:', dbError);
      return NextResponse.json(
        { error: `数据库操作异常: ${dbError instanceof Error ? dbError.message : '未知错误'}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 可选：添加GET方法来获取调查统计
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: '获取数据失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
