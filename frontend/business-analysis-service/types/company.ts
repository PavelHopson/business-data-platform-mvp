export interface CompanyData {
  id: number;
  inn: string;
  ogrn: string;
  name: string;
  status: string;
  address: string;
  registration_date: string;
  founders: FounderData[];
  financials: FinancialData[];
  court_cases: CourtCaseData[];
  contracts: ContractData[];
}

export interface FounderData {
  name: string;
  share: number;
}

export interface FinancialData {
  year: number;
  revenue: number;
  profit: number;
  assets: number;
}

export interface CourtCaseData {
  case_number: string;
  date: string;
  status: string;
  type: string;
}

export interface ContractData {
  customer: string;
  amount: number;
  date: string;
}

export interface SearchResponse {
  success: boolean;
  company?: {
    id: number;
    name: string;
    inn: string;
    ogrn: string;
  };
  message?: string;
}

export interface CompanyApiResponse {
  success: boolean;
  company?: CompanyData;
  message?: string;
}
