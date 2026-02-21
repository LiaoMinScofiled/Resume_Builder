import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const { amount, description, orderId } = await request.json();

    // 验证请求参数
    if (!amount || !description || !orderId) {
      return NextResponse.json(
        { error: '缺少必要的请求参数' },
        { status: 400 }
      );
    }

    // 使用固定的支付链接格式
    const paymentUrl = `https://api.kpt5.com/xpay/epay/?amount=${amount}`;

    // 生成二维码链接（使用第三方二维码生成服务）
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentUrl)}`;

    // 直接返回支付链接
    return NextResponse.json({
      success: true,
      data: {
        payment_url: paymentUrl,
        order_id: orderId,
        qr_code: qrCodeUrl,
      },
    });
  } catch (error) {
    console.error('支付创建错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
