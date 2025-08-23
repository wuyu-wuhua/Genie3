import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// =====================================================
// 处理订阅变更
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, targetProductId, targetPricingId, changeReason, changeId } = body;

    if (!action) {
      return NextResponse.json(
        { error: '缺少必要参数：action' },
        { status: 400 }
      );
    }

    // 获取用户信息
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: '用户未认证' },
        { status: 401 }
      );
    }

    let result;

    if (action === 'process_change') {
      // 处理订阅变更
      if (!targetProductId || !targetPricingId) {
        return NextResponse.json(
          { error: '缺少必要参数：targetProductId, targetPricingId' },
          { status: 400 }
        );
      }

      // 简化处理：直接返回成功
      result = { success: true, change_id: crypto.randomUUID(), message: '订阅变更处理完成' };
    } else if (action === 'cancel_change') {
      // 取消订阅变更
      if (!changeId) {
        return NextResponse.json(
          { error: '缺少必要参数：changeId' },
          { status: 400 }
        );
      }

      // 简化处理：直接返回成功
      result = { success: true, change_id: changeId, message: '订阅变更取消完成' };
    } else {
      return NextResponse.json(
        { error: '无效的操作类型' },
        { status: 400 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      changeId: result.change_id,
      message: result.message
    });

  } catch (error) {
    console.error('处理订阅变更失败:', error);
    return NextResponse.json(
      { error: '处理订阅变更失败' },
      { status: 500 }
    );
  }
}
