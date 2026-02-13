import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/db';

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    const user = await userService.createUser(body);
    
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    let errorMessage = error.message || 'Registration failed';
    if (errorMessage === 'Email already exists') {
      errorMessage = '该邮箱已被注册';
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
