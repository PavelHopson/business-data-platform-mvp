'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Contract {
  id?: number;
  customer: string;
  amount: number;
  date: string;
  contract_number?: string;
}

interface ProcurementTableProps {
  inn: string;
}

interface Filters {
  dateFrom: string;
  dateTo: string;
  minAmount: string;
}

export default function ProcurementTable({ inn }: ProcurementTableProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    dateFrom: '',
    dateTo: '',
    minAmount: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 10;

  const loadContracts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      });

      if (filters.dateFrom) params.append('date_from', filters.dateFrom);
      if (filters.dateTo) params.append('date_to', filters.dateTo);
      if (filters.minAmount) params.append('min_amount', filters.minAmount);

      const response = await fetch(`/api/company/${inn}/contracts?${params}`);
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки контрактов');
      }
      
      const data = await response.json();
      
      if (currentPage === 1) {
        setContracts(data);
      } else {
        setContracts(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === itemsPerPage);
      setTotalCount(data.length);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setError(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  }, [inn, currentPage, filters.dateFrom, filters.dateTo, filters.minAmount]);

  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
    setContracts([]);
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      minAmount: ''
    });
    setCurrentPage(1);
    setContracts([]);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ru-RU');
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading && contracts.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Загрузка контрактов...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Ошибка загрузки</div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={loadContracts}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Фильтры</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата от
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата до
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Сумма от (₽)
            </label>
            <input
              type="number"
              placeholder="0"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Закупки ({totalCount} записей)
          </h3>
        </div>
        
        {contracts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg">Нет контрактов</div>
            <p className="text-gray-400 mt-2">По выбранным фильтрам контракты не найдены</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      №
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Номер
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Заказчик
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Сумма
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contracts.map((contract, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.contract_number || `ДОГ-${contract.id || index + 1}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(contract.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatAmount(contract.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hasMore && (
              <div className="px-6 py-4 border-t border-gray-200">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Загрузка...' : 'Загрузить ещё'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
