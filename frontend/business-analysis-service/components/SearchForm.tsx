'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SearchFilters } from '@/lib/api/search';

export interface SearchFormProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
  initialValue?: string;
  showFilters?: boolean;
  filters?: SearchFilters;
  onFiltersChange?: (filters: SearchFilters) => void;
  className?: string;
  autoFocus?: boolean;
}

interface FilterState {
  region: string;
  inn: string;
  ogrn: string;
  status: 'active' | 'inactive' | 'all';
}

export default function SearchForm({
  onSearch,
  loading = false,
  placeholder = 'Введите название компании, ИНН или ОГРН...',
  initialValue = '',
  showFilters = true,
  filters = {},
  onFiltersChange,
  className = '',
  autoFocus = false,
}: SearchFormProps) {
  const [query, setQuery] = useState(initialValue);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
    region: filters.region || '',
    inn: filters.inn || '',
    ogrn: filters.ogrn || '',
    status: filters.status || 'all',
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const validateINN = useCallback((inn: string): boolean => {
    if (!inn) return true;
    const innRegex = /^\d{10}$|^\d{12}$/;
    return innRegex.test(inn);
  }, []);

  const validateOGRN = useCallback((ogrn: string): boolean => {
    if (!ogrn) return true;
    const ogrnRegex = /^\d{13}$|^\d{15}$/;
    return ogrnRegex.test(ogrn);
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors: string[] = [];

    if (query.trim().length < 2) {
      errors.push('Поисковый запрос должен содержать минимум 2 символа');
    }

    if (filterState.inn && !validateINN(filterState.inn)) {
      errors.push('Неверный формат ИНН (должно быть 10 или 12 цифр)');
    }

    if (filterState.ogrn && !validateOGRN(filterState.ogrn)) {
      errors.push('Неверный формат ОГРН (должно быть 13 или 15 цифр)');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }, [query, filterState, validateINN, validateOGRN]);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [validationErrors.length]);

  const handleFilterChange = useCallback((field: keyof FilterState, value: string) => {
    setFilterState(prev => ({
      ...prev,
      [field]: value,
    }));

    if (onFiltersChange) {
      const newFilters: SearchFilters = {
        ...filterState,
        [field]: value || undefined,
      };
      onFiltersChange(newFilters);
    }
  }, [filterState, onFiltersChange]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSearch(query.trim());
    }
  }, [query, validateForm, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    setFilterState({
      region: '',
      inn: '',
      ogrn: '',
      status: 'all',
    });
    setValidationErrors([]);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowAdvancedFilters(false);
      inputRef.current?.blur();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowAdvancedFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`search-form ${className}`}
      role="search"
      aria-label="Поиск контрагентов"
    >
      <div className="relative">
        <div className="flex items-center bg-white rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200" style={{ width: '612px', height: '38px' }}>
          <div className="pl-4 pr-2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={loading}
            className="flex-1 py-2 px-2 text-gray-900 placeholder-gray-500 bg-transparent border-0 focus:outline-none focus:ring-0 disabled:opacity-50 text-sm"
            aria-label="Поисковый запрос"
            aria-describedby={validationErrors.length > 0 ? 'validation-errors' : undefined}
            autoComplete="off"
            spellCheck="false"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Очистить поиск"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {showFilters && (
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-2 mr-2 transition-colors ${
                showAdvancedFilters
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="Расширенные фильтры"
              aria-expanded={showAdvancedFilters}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
            </button>
          )}

          <button
            type="submit"
            disabled={loading || query.trim().length < 2}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Выполнить поиск"
            style={{ height: '38px' }}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Поиск...
              </div>
            ) : (
              'Найти'
            )}
          </button>
        </div>

        {validationErrors.length > 0 && (
          <div id="validation-errors" className="mt-2 text-sm text-red-600" role="alert">
            <ul className="list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showFilters && showAdvancedFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Расширенные фильтры</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="region-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Регион
              </label>
              <input
                id="region-filter"
                type="text"
                value={filterState.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                placeholder="Например: Москва"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="inn-filter" className="block text-sm font-medium text-gray-700 mb-1">
                ИНН
              </label>
              <input
                id="inn-filter"
                type="text"
                value={filterState.inn}
                onChange={(e) => handleFilterChange('inn', e.target.value)}
                placeholder="10 или 12 цифр"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={12}
              />
            </div>

            <div>
              <label htmlFor="ogrn-filter" className="block text-sm font-medium text-gray-700 mb-1">
                ОГРН
              </label>
              <input
                id="ogrn-filter"
                type="text"
                value={filterState.ogrn}
                onChange={(e) => handleFilterChange('ogrn', e.target.value)}
                placeholder="13 или 15 цифр"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={15}
              />
            </div>

            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Статус
              </label>
              <select
                id="status-filter"
                value={filterState.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Все</option>
                <option value="active">Активные</option>
                <option value="inactive">Неактивные</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setFilterState({
                region: '',
                inn: '',
                ogrn: '',
                status: 'all',
              })}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Сбросить фильтры
            </button>
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(false)}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
