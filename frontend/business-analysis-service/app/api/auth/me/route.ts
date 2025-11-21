import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Токен авторизации не предоставлен'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    
    const response = await fetch(`${backendUrl}/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({
        success: false,
        message: errorData.detail || 'Ошибка получения информации о пользователе'
      }, { status: response.status });
    }

    const userData = await response.json();
    
    return NextResponse.json({
      success: true,
      user: userData,
      message: 'Информация о пользователе получена успешно'
    });
    
  } catch (error) {
    console.error('Me API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    }, { status: 500 });
  }
}


