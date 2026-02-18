import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 码支付API配置
const MAZFU_API_KEY = process.env.MAZFU_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // 检查环境变量
    if (!MAZFU_API_KEY) {
      return NextResponse.json(
        { error: '码支付配置未完成，请在.env文件中设置MAZFU_API_KEY' },
        { status: 500 }
      );
    }

    // 解析请求体
    const paymentNotify = await request.json();
    console.log('收到支付通知:', paymentNotify);

    // 验证签名
    const sign = paymentNotify.sign;
    const notifyData = { ...paymentNotify };
    delete notifyData.sign;
    
    const verifySign = generateSign(notifyData, MAZFU_API_KEY);
    
    if (sign !== verifySign) {
      return NextResponse.json(
        { error: '签名验证失败' },
        { status: 400 }
      );
    }

    // 处理支付结果
    if (paymentNotify.status === 'success') {
      // 支付成功，更新订单状态
      console.log('支付成功，订单号:', paymentNotify.order_id);
      // 这里可以添加更新数据库中订单状态的逻辑
    } else {
      // 支付失败
      console.log('支付失败，订单号:', paymentNotify.order_id);
    }

    // 返回成功响应给码支付
    return NextResponse.json({ code: 0, msg: 'success' });
  } catch (error) {
    console.error('支付通知处理错误:', error);
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
