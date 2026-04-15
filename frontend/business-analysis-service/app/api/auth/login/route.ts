import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email и пароль обязательны'
      }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        remember_me: rememberMe,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({
        success: false,
        message: errorData.detail || 'Неверный email или пароль'
      }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      token: data.access_token,
      user: data.user,
      message: 'Вход выполнен успешно'
    });
    
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    }, { status: 500 });
  }
}
