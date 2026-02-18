import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 码支付API配置
const MAZFU_USER_ID = process.env.MAZFU_USER_ID;
const MAZFU_API_KEY = process.env.MAZFU_API_KEY;
const MAZFU_API_URL = 'https://api.mzfpay.com/v3/cashier/create';

export async function POST(request: NextRequest) {
  try {
    // 检查环境变量
    if (!MAZFU_USER_ID || !MAZFU_API_KEY) {
      return NextResponse.json(
        { error: '码支付配置未完成，请在.env文件中设置MAZFU_USER_ID和MAZFU_API_KEY' },
        { status: 500 }
      );
    }

    // 解析请求体
    const { amount, description, orderId } = await request.json();

    // 验证请求参数
    if (!amount || !description || !orderId) {
      return NextResponse.json(
        { error: '缺少必要的请求参数' },
        { status: 400 }
      );
    }

    // 构建支付请求参数
    const paymentData = {
      user_id: MAZFU_USER_ID,
      amount: amount,
      description: description,
      order_id: orderId,
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment/notify`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`,
      pay_type: 'wechat', // 微信支付
      sign: '',
    };

    // 生成签名
    paymentData.sign = generateSign(paymentData, MAZFU_API_KEY);

    // 发送请求到码支付API
    const response = await fetch(MAZFU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    // 处理响应
    const result = await response.json();

    if (result.code === 0) {
      // 支付创建成功
      return NextResponse.json({
        success: true,
        data: {
          payment_url: result.data.pay_url,
          order_id: result.data.order_id,
          qr_code: result.data.qr_code,
        },
      });
    } else {
      // 支付创建失败
      return NextResponse.json(
        { error: result.msg || '支付创建失败' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('支付创建错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 生成签名函数
function generateSign(params: object, apiKey: string): string {
  // 按照码支付的签名规则生成签名
  // 1. 移除sign参数
  const sortedParams = { ...params as Record<string, string | number> };
  delete sortedParams.sign;
  
  // 2. 按参数名排序
  const sortedKeys = Object.keys(sortedParams).sort();
  
  // 3. 拼接参数字符串
  let signStr = '';
  for (const key of sortedKeys) {
    signStr += `${key}=${sortedParams[key]}&`;
  }
  
  // 4. 添加API密钥
  signStr += `key=${apiKey}`;
  
  // 5. MD5加密
  return crypto.createHash('md5').update(signStr).digest('hex');
}
