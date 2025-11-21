import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const start = Date.now();
  const requestId = crypto.randomUUID();
  
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('x-request-id', requestId);

  if (typeof window === 'undefined') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: 'HTTP Request Started',
      service: 'business-analysis-ui',
      method: request.method,
      url: request.url,
      path: request.nextUrl.pathname,
      request_id: requestId,
      user_agent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      event_type: 'http_request_start',
    };
    console.log(JSON.stringify(logEntry));
  }

  if (typeof window === 'undefined') {
    setTimeout(() => {
      const duration = Date.now() - start;
      const completionLogEntry = {
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: 'HTTP Request Completed',
        service: 'business-analysis-ui',
        method: request.method,
        url: request.url,
        path: request.nextUrl.pathname,
        request_id: requestId,
        duration,
        user_agent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        event_type: 'http_request_complete',
      };
      console.log(JSON.stringify(completionLogEntry));
    }, 0);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

