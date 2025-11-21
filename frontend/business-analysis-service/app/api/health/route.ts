import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const backendUrl = 'http://backend:8000';
    console.log('Health check: Testing backend connection');
    
    const response = await fetch(`${backendUrl}/docs`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
      },
    });

    if (response.ok) {
      return NextResponse.json({
        status: 'healthy',
        backend: 'connected',
        message: 'Backend is running'
      });
    } else {
      return NextResponse.json({
        status: 'unhealthy',
        backend: 'error',
        message: `Backend responded with status: ${response.status}`
      }, { status: 503 });
    }
    
  } catch (error) {
    console.error('Health check error:', error);
    
    let errorMessage = 'Backend connection failed';
    if (error instanceof Error) {
      if (error.message.includes('fetch failed')) {
        errorMessage = 'Cannot connect to backend server';
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = 'Backend hostname not found';
      } else {
        errorMessage = `Connection error: ${error.message}`;
      }
    }
    
    return NextResponse.json({
      status: 'unhealthy',
      backend: 'disconnected',
      message: errorMessage
    }, { status: 503 });
  }
}
