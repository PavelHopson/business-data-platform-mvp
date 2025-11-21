import { useState, useEffect } from "react";

interface CompanyData {
  id: number;
  inn: string;
  ogrn: string;
  name: string;
  shortName: string;
  status: string;
  address: string;
  registration_date: string;
  staff: number;
  riskIndex: number;
  director?: string;
  director_role?: string;
  capital?: number;
  founders: Array<{ name: string; share: number }>;
  financials: Array<{ year: number; revenue: number; profit: number; assets: number }>;
  court_cases: Array<{ case_number: string; date: string; status: string; type: string; subject?: string }>;
  contracts: Array<{ customer: string; amount: number; date: string; contract_id?: string }>;
  okved?: Array<{ code: string; name: string; is_main: boolean }>;
}

interface UseCompanyDataReturn {
  company: CompanyData | null;
  loading: boolean;
  error: string | null;
}

export function useCompanyData(inn?: string): UseCompanyDataReturn {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const useLocal = process.env.NEXT_PUBLIC_USE_LOCAL_DATA === "true" || 
                   process.env.NODE_ENV === "development";

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        if (useLocal) {
          const mockCompany: CompanyData = {
            id: 1,
            inn: '7707083893',
            ogrn: '1027700140237',
            name: 'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ИНФОРМАЦИОННЫЕ ТЕХНОЛОГИИ"',
            shortName: 'ООО "ИНФОТЕХ"',
            status: 'Действующая',
            address: '127051, г. Москва, ул. Петровка, д. 2, стр. 1',
            registration_date: '10 марта 1993 г.',
            staff: 45,
            riskIndex: 85,
            director: 'Петров Иван Сергеевич',
            director_role: 'Генеральный директор',
            capital: 10000000,
            founders: [
              { name: 'Иванов И. И.', share: 0.5 },
              { name: 'Петров А. А.', share: 0.5 },
            ],
            financials: [
              { year: 2023, revenue: 1200000000, profit: 150000000, assets: 350000000 },
              { year: 2022, revenue: 950000000, profit: 110000000, assets: 280000000 },
              { year: 2021, revenue: 700000000, profit: 80000000, assets: 210000000 },
            ],
            court_cases: [
              { case_number: 'А40-1234/2024', date: '20.01.2024', status: 'В процессе', type: 'Арбитраж', subject: 'Взыскание задолженности по договору поставки' },
              { case_number: 'ГР-567/2023', date: '15.05.2023', status: 'Завершено', type: 'Гражданское', subject: 'Защита деловой репутации' },
            ],
            contracts: [
              { customer: 'Министерство Цифры', amount: 55000000, date: '12.12.2023', contract_id: 'ГК-2023-001' },
              { customer: 'ПАО "Ростелеком"', amount: 32000000, date: '01.07.2023', contract_id: 'ГК-2023-002' },
            ],
            okved: [
              { code: '62.01', name: 'Разработка компьютерного программного обеспечения', is_main: true },
              { code: '62.02', name: 'Консультирование в области информационных технологий', is_main: false },
              { code: '63.11.1', name: 'Обработка данных, предоставление услуг по размещению информации', is_main: false },
            ],
          };
          
          setCompany(mockCompany);
        } else {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const response = await fetch(`/api/company/${inn}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("Компания не найдена по ИНН");
            }
            throw new Error(`Ошибка API: ${response.status}`);
          }
          
          const data = await response.json();
          setCompany(data.company);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка загрузки данных";
        setError(errorMessage);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    }
    
    if (inn) {
      fetchData();
    } else {
      setLoading(false);
      setCompany(null);
    }
  }, [inn, useLocal]);

  return { company, loading, error };
}