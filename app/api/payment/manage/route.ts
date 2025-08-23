import { NextRequest, NextResponse } from 'next/server';
import { getUserPaymentRecords, getUserCreditBalance } from '@/lib/payment-service';

// =====================================================
// GET - 获取用户支付信息
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');

    if (!userId) {
      return NextResponse.json(
        { error: '缺少用户ID' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'history':
        // 获取支付记录
        const records = await getUserPaymentRecords(userId, 100, 0);
        return NextResponse.json({ 
          success: true, 
          records 
        });

      case 'balance':
        // 获取积分余额
        const balance = await getUserCreditBalance(userId);
        return NextResponse.json({ 
          success: true, 
          balance 
        });

      case 'all':
        // 获取所有信息
        const [recordsData, balanceData] = await Promise.all([
          getUserPaymentRecords(userId, 100, 0),
          getUserCreditBalance(userId)
        ]);
        
        return NextResponse.json({ 
          success: true, 
          records: recordsData,
          balance: balanceData
        });

      default:
        return NextResponse.json(
          { error: '无效的操作类型' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('获取支付信息失败:', error);
    return NextResponse.json(
      { error: '获取支付信息失败' },
      { status: 500 }
    );
  }
}

// =====================================================
// POST - 更新支付状态（用于测试或手动操作）
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, transactionId, status, metadata } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'update_status':
        if (!transactionId || !status) {
          return NextResponse.json(
            { error: '缺少交易ID或状态' },
            { status: 400 }
          );
        }
        
        // 这里可以添加更新支付状态的逻辑
        // 暂时返回成功
        return NextResponse.json({ 
          success: true, 
          message: '状态更新成功' 
        });

      default:
        return NextResponse.json(
          { error: '无效的操作类型' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('更新支付信息失败:', error);
    return NextResponse.json(
      { error: '更新支付信息失败' },
      { status: 500 }
    );
  }
}
