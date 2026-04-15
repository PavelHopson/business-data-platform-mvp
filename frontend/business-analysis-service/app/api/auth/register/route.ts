import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { name, email, inn, password } = await request.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Имя, email и пароль обязательны'
      }, { status: 400 });
    }
    
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        inn: inn || null,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({
        success: false,
        message: errorData.detail || 'Ошибка регистрации'
      }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Регистрация прошла успешно',
      user: data
    });
    
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    }, { status: 500 });
  }
}
