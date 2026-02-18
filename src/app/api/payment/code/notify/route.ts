import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// 码支付API配置
const CODEPAY_USER_ID = process.env.CODEPAY_USER_ID;
const CODEPAY_API_KEY = process.env.CODEPAY_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // 检查环境变量
    if (!CODEPAY_USER_ID || !CODEPAY_API_KEY) {
      return NextResponse.json(
        { error: '码支付配置未完成，请在.env文件中设置CODEPAY_USER_ID和CODEPAY_API_KEY' },
        { status: 500 }
      );
    }

    // 解析请求体
    const body = await request.json();
    const { id, trade_no, out_trade_no, type, money, param, sign } = body;

    // 验证请求参数
    if (!id || !trade_no || !out_trade_no || !type || !money || !param || !sign) {
      return NextResponse.json(
        { error: '缺少必要的请求参数' },
        { status: 400 }
      );
    }

    // 验证签名
    const verifyData = {
      id,
      trade_no,
      out_trade_no,
      type,
      money,
      param,
    };

    const verifySign = generateSign(verifyData, CODEPAY_API_KEY);
    if (verifySign !== sign) {
      return NextResponse.json(
        { error: '签名验证失败' },
        { status: 400 }
      );
    }

    // 处理支付成功逻辑
    // 这里可以更新订单状态、发送通知等
    console.log('支付成功:', {
      order_id: out_trade_no,
      trade_no,
      amount: money,
      payment_type: type,
      custom_param: param,
    });

    // 返回成功响应
    return NextResponse.json({
      status: 'success',
      msg: '支付成功',
    });
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
