import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  
  try {
    const { query } = await request.json();
    
    logger.info('Search request received', { 
      request_id: requestId,
      query,
      component: 'search-api'
    });
    
    if (!query) {
      logger.warn('Empty search query', { request_id: requestId });
      return NextResponse.json({
        success: false,
        message: 'Поисковый запрос не может быть пустым'
      }, { status: 400 });
    }
    
    const backendUrl = 'http://backend:8000';
    
    const response = await fetch(`${backendUrl}/v1/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-request-id': requestId,
      },
      body: JSON.stringify({
        query: query.trim(),
        region: null,
        status: null
      }),
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('Backend search failed', new Error(errorText), { 
        request_id: requestId,
        backend_status: response.status,
        duration,
        query
      });
      
      return NextResponse.json({
        success: false,
        message: `Ошибка поиска на сервере: ${response.status}`
      }, { status: response.status });
    }

    const data = await response.json();
    
    if (data.success && data.data && data.data.results && data.data.results.length > 0) {
      const company = data.data.results[0];
      
      logger.logSearch(query, company.inn, data.data.results.length, {
        request_id: requestId,
        duration,
        found: true
      });
      
      return NextResponse.json({
        success: true,
        company: {
          id: company.id,
          name: company.name,
          inn: company.inn,
          ogrn: company.ogrn
        }
      });
    } else {
      logger.logSearch(query, undefined, 0, {
        request_id: requestId,
        duration,
        found: false
      });
      
      return NextResponse.json({
        success: false,
        message: 'Компания с указанными данными не найдена'
      });
    }
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    let errorMessage = 'Внутренняя ошибка сервера';
    if (error instanceof Error) {
      if (error.message.includes('fetch failed')) {
        errorMessage = 'Не удается подключиться к серверу поиска. Проверьте, что backend запущен.';
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = 'Сервер поиска недоступен. Проверьте сетевое соединение.';
      } else {
        errorMessage = `Ошибка: ${error.message}`;
      }
    }
    
    logger.error('Search API error', error, {
      request_id: requestId,
      duration,
      component: 'search-api'
    });
    
    return NextResponse.json({
      success: false,
      message: errorMessage
    }, { status: 500 });
  }
}
