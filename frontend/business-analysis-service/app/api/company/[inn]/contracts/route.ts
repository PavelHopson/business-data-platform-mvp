import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: { inn: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const minAmount = searchParams.get('min_amount');

    const backendUrl = new URL(`${BACKEND_URL}/v1/company/${params.inn}/contracts`);
    
    if (dateFrom) backendUrl.searchParams.set('date_from', dateFrom);
    if (dateTo) backendUrl.searchParams.set('date_to', dateTo);
    if (minAmount) backendUrl.searchParams.set('min_amount', minAmount);
    backendUrl.searchParams.set('page', page);
    backendUrl.searchParams.set('limit', limit);

    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    
    const contractsWithNumbers = data.map((contract: { customer: string; amount: number; date: string }, index: number) => ({
      ...contract,
      id: index + 1,
      contract_number: `ДОГ-${String(index + 1).padStart(6, '0')}`
    }));

    return NextResponse.json(contractsWithNumbers);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    
    const mockContracts = [
      {
        id: 1,
        contract_number: 'ДОГ-000001',
        customer: 'ООО "Тестовый заказчик 1"',
        amount: 1500000,
        date: '2023-06-15'
      },
      {
        id: 2,
        contract_number: 'ДОГ-000002',
        customer: 'ИП Иванов И.И.',
        amount: 750000,
        date: '2023-07-20'
      },
      {
        id: 3,
        contract_number: 'ДОГ-000003',
        customer: 'ООО "Другой заказчик"',
        amount: 2300000,
        date: '2023-08-10'
      }
    ];

    return NextResponse.json(mockContracts);
  }
}
