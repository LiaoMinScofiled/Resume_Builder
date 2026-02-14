import { NextRequest, NextResponse } from 'next/server';
import { resumeService } from '@/lib/db';

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

    const resume = await resumeService.getResumeByUserId(userId);
    
    return NextResponse.json(resume, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to load resume' },
      { status: 500 }
    );
  }
}