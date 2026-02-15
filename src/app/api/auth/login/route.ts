import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/db';

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const user = await userService.login(body);
    
    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    );
  }
}
