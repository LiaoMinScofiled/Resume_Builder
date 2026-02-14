import { NextRequest, NextResponse } from 'next/server';
import { resumeService } from '@/lib/db';

interface SaveResumeRequest {
  userId: string;
  resumeData: any;
  style: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SaveResumeRequest = await request.json();
    
    console.log('Save request received:', { 
      hasResumeData: !!body.resumeData, 
      style: body.style,
      hasPersonalInfo: !!body.resumeData?.personalInfo,
      hasEducation: body.resumeData?.education?.length || 0,
      hasExperience: body.resumeData?.experience?.length || 0,
      hasSkills: body.resumeData?.skills?.length || 0
    });
    
    const result = await resumeService.saveResume(body.userId, body.resumeData, body.style);
    
    console.log('Save successful:', { 
      style: result.style 
    });
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Save error:', error.message);
    
    return NextResponse.json(
      { error: error.message || 'Failed to save resume' },
      { status: 500 }
    );
  }
}