import { appConfig } from '@/config/app';

export interface ScraperCompanyData {
  inn: string;
  ogrn: string;
  company_name: string;
  general_director: string;
  founders: string[];
  revenue: {
    [year: string]: number;
  };
  profit: {
    [year: string]: number;
  };
  employees_count: number;
  activity: {
    code: string;
    desc: string;
  };
  contacts: {
    phone: string | null;
    email: string | null;
    website: string | null;
  };
  court_cases: unknown | null;
  // Дополнительные поля для реквизитов
  registration_date?: string;
  legal_address?: string;
  kpp?: string;
  company_form?: string;
  authorized_capital?: number;
  tax_authority?: string;
  tax_authority_address?: string;
  // Данные ПФР
  pfr_registration_number?: string;
  pfr_registration_date?: string;
  pfr_territorial_authority?: string;
  // Данные ФСС
  fss_registration_number?: string;
  fss_registration_date?: string;
  fss_territorial_authority?: string;
}

export interface ScraperResponse {
  success: boolean;
  data: ScraperCompanyData;
  message: string;
}

export async function scrapeCompanyData(inn: string): Promise<ScraperResponse> {
  try {
    const response = await fetch(`${appConfig.apiUrl}/v1/company/${inn}/scrape`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error scraping company data:', error);
    throw new Error('Не удалось получить данные компании');
  }
}
