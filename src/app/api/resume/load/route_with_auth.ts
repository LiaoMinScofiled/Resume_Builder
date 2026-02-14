import { NextRequest, NextResponse } from 'next/server';
import { resumeService } from '@/lib/db';

// 应用层权限控制示例
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // 应用层权限检查：验证用户身份
    // 在实际应用中，这里应该：
    // 1. 从请求中获取当前登录用户的ID（从cookie、JWT等）
    // 2. 比较请求的userId与当前用户ID
    // 3. 如果不匹配，返回403错误

    // 示例：从cookie获取当前用户
    const cookieUser = request.cookies.get('user');
    if (!cookieUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const currentUser = JSON.parse(cookieUser.value);
    
    // 权限检查：只能访问自己的简历
    if (currentUser.id !== userId) {
      console.warn(`Unauthorized access attempt: user ${currentUser.id} trying to access user ${userId}`);
      return NextResponse.json(
        { error: 'Forbidden: You can only access your own resume' },
        { status: 403 }
      );
    }

    const resume = await resumeService.getResumeByUserId(userId);
    
    return NextResponse.json(resume, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to load resume' },
      { status: 500 }
    );
  }
}
