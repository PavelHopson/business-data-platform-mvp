'use client';

import React, { useEffect, useCallback, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import { SearchFilters, SearchResult } from '@/lib/api/search';
import { ScraperResponse } from '@/lib/api/scraper';
import { SearchResults } from '@/components/SearchResults';
import { CompanySearchAutocomplete } from '@/components/CompanySearchAutocomplete';
import ErrorBoundary from '@/components/ErrorBoundary';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [initialized, setInitialized] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    region: '',
    inn: '',
    ogrn: '',
    status: 'all',
  });
  const {
    results,
    loading,
    error,
    search,
    isEmpty,
    scraperData,
    isScraperLoading,
    scraperError,
  } = useSearch({
    debounceMs: 300,
    autoSearch: true,
    cacheResults: true,
    maxCacheSize: 50,
  });

  useEffect(() => {
    if (!initialized) {
      const query = searchParams.get('q') || '';
      const type = searchParams.get('type') as 'company' | 'individual' | 'all' || 'all';
      const region = searchParams.get('region') || '';
      const inn = searchParams.get('inn') || '';
      const ogrn = searchParams.get('ogrn') || '';
      const status = searchParams.get('status') as 'active' | 'inactive' | 'all' || 'all';

      setCurrentQuery(query);
      setCurrentFilters({
        region,
        inn,
        ogrn,
        status,
      });

      if (query.trim().length >= 2) {
        search(query, {
          type,
          filters: {
            region,
            inn,
            ogrn,
            status,
          },
        });
      }

      setInitialized(true);
    }
  }, [searchParams, initialized, search]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateURL = useCallback((query: string, filters: SearchFilters, page: number = 1) => {
    const params = new URLSearchParams();
    
    if (query.trim()) {
      params.set('q', query.trim());
    }
    
    if (filters.region) {
      params.set('region', filters.region);
    }
    
    if (filters.inn) {
      params.set('inn', filters.inn);
    }
    
    if (filters.ogrn) {
      params.set('ogrn', filters.ogrn);
    }
    
    if (filters.status && filters.status !== 'all') {
      params.set('status', filters.status);
    }
    
    if (page > 1) {
      params.set('page', page.toString());
    }

    const newURL = params.toString() ? `/search?${params.toString()}` : '/search';
    router.replace(newURL, { scroll: false });
  }, [router]);


  const handleContractorClick = useCallback((contractor: SearchResult) => {
    // Google Analytics отключен для избежания ошибок
    // if (typeof window !== 'undefined' && 'gtag' in window) {
    //   const gtag = (window as { gtag: (...args: unknown[]) => void }).gtag;
    //   gtag('event', 'contractor_click', {
    //     contractor_id: contractor.id,
    //     contractor_name: contractor.name,
    //     contractor_inn: contractor.inn,
    //     search_query: currentQuery,
    //   });
    // }

    router.push(`/contractor/${contractor.id}`);
  }, [router]);

  const handleCompanySelect = useCallback((company: SearchResult | ScraperResponse) => {
    if ('inn' in company) {
      // Обычный результат поиска
      router.push(`/company-details?inn=${company.inn}`);
    } else if (company.data && company.data.inn) {
      // Данные парсера
      router.push(`/company-details?inn=${company.data.inn}`);
    }
  }, [router]);


  // Google Analytics отключен для избежания ошибок
  // useEffect(() => {
  //   if (hasSearched && typeof window !== 'undefined' && 'gtag' in window) {
  //     const gtag = (window as { gtag: (...args: unknown[]) => void }).gtag;
  //     gtag('event', 'search', {
  //       search_term: currentQuery,
  //       results_count: totalCount,
  //       page: currentPage,
  //     });
  //   }
  // }, [hasSearched, currentQuery, totalCount, currentPage]);
  const breadcrumbs = [
    { name: 'Главная', href: '/' },
    { name: 'Поиск контрагентов', href: '/search' },
  ];

  if (currentQuery) {
    breadcrumbs.push({ name: `Результаты поиска: "${currentQuery}"`, href: '#' });
  }

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Search page error:', error, errorInfo);
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 py-3">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {crumb.href === '#' ? (
                    <span className="text-sm text-gray-500 truncate">{crumb.name}</span>
                  ) : (
                    <a
                      href={crumb.href}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {crumb.name}
                    </a>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Поиск контрагентов
            </h1>
            <p className="text-lg text-gray-600">
              Найдите информацию о компаниях и индивидуальных предпринимателях
            </p>
          </div>

          <div className="mb-8">
            <CompanySearchAutocomplete
              onCompanySelect={handleCompanySelect}
              placeholder="Название, адрес, ФИО, учредителям, ОГРН и ИНН"
              autoFocus={true}
            />
          </div>

          <div className="space-y-6">
            <SearchResults
              results={results}
              isLoading={loading}
              error={error}
              onResultClick={handleContractorClick}
              scraperData={scraperData}
              isScraperLoading={isScraperLoading}
              scraperError={scraperError}
            />
          </div>

          {isEmpty && currentQuery && (
            <div className="mt-12 bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Не нашли то, что искали?
              </h2>
              <div className="prose prose-sm text-gray-600">
                <p>
                  Попробуйте изменить поисковый запрос или используйте расширенные фильтры. 
                  Вы можете искать по названию компании, ИНН, ОГРН или другим параметрам.
                </p>
                <ul className="mt-4 space-y-2">
                  <li>• Используйте точное название компании</li>
                  <li>• Введите ИНН (10 или 12 цифр) для точного поиска</li>
                  <li>• Попробуйте сокращенное или полное название</li>
                  <li>• Проверьте правильность написания</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
