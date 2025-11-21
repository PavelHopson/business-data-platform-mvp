import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { inn: string } }
) {
  const startTime = Date.now();
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  
  try {
    const { inn } = params;
    
    logger.info('Company data request', { 
      request_id: requestId,
      inn,
      component: 'company-api'
    });
    
    if (!inn) {
      logger.warn('Missing INN parameter', { request_id: requestId });
      return NextResponse.json({
        success: false,
        message: 'ИНН не указан'
      }, { status: 400 });
    }

    if (!/^\d{10}$|^\d{12}$/.test(inn)) {
      return NextResponse.json({
        success: false,
        message: 'Неверный формат ИНН'
      }, { status: 400 });
    }

    const backendUrl = 'http://backend:8000';
    const response = await fetch(`${backendUrl}/v1/company/${inn}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-request-id': requestId,
      },
    });

    const duration = Date.now() - startTime;

      if (!response.ok) {
        if (response.status === 404) {
          logger.warn('Company not found', { 
            request_id: requestId,
            inn,
            duration
          });
          
          return NextResponse.json({
            success: false,
            message: 'Компания не найдена'
          }, { status: 404 });
        }
        
        const errorData = await response.json();
        logger.error('Backend company fetch failed', new Error(`Status ${response.status}`), { 
          request_id: requestId,
          inn,
          backend_status: response.status,
          duration
        });
        
        return NextResponse.json({
          success: false,
          message: errorData.detail || 'Ошибка получения данных компании'
        }, { status: response.status });
      }

    const data = await response.json();
    
    logger.info('Company data retrieved successfully', {
      request_id: requestId,
      inn,
      duration,
      event_type: 'company_view'
    });
    
    return NextResponse.json({
      success: true,
      company: data.company || data,
      message: 'Данные компании получены'
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error('Company API error', error, {
      request_id: requestId,
      inn: params.inn,
      duration,
      component: 'company-api'
    });
    
    return NextResponse.json({
      success: false,
      message: 'Внутренняя ошибка сервера'
    }, { status: 500 });
  }
}