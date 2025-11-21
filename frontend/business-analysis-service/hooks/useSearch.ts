import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { searchAPI, SearchParams, SearchResult, SearchFilters, ApiResponse, SearchResponse } from '@/lib/api/search';
import { scrapeCompanyData, ScraperResponse } from '@/lib/api/scraper';

export interface UseSearchOptions {
  debounceMs?: number;
  autoSearch?: boolean;
  initialFilters?: SearchFilters;
  cacheResults?: boolean;
  maxCacheSize?: number;
}

export interface UseSearchReturn {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasSearched: boolean;
  scraperData: ScraperResponse | null;
  isScraperLoading: boolean;
  scraperError: string | null;

  search: (query: string, options?: Partial<SearchParams>) => Promise<void>;
  clearResults: () => void;
  loadMore: () => Promise<void>;
  setFilters: (filters: SearchFilters) => void;
  retry: () => Promise<void>;
  scrapeCompany: (inn: string) => Promise<void>;
  isINN: (query: string) => boolean;

  hasMore: boolean;
  isEmpty: boolean;
  isError: boolean;
  isSuccess: boolean;
}

interface SearchCache {
  [key: string]: {
    data: SearchResult[];
    totalCount: number;
    totalPages: number;
    timestamp: number;
  };
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    debounceMs = 150, // Уменьшили с 300 до 150мс
    autoSearch = true,
    initialFilters = {},
    cacheResults = true,
    maxCacheSize = 100, // Увеличили кэш
  } = options;

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFiltersState] = useState<SearchFilters>(initialFilters);
  const [scraperData, setScraperData] = useState<ScraperResponse | null>(null);
  const [isScraperLoading, setIsScraperLoading] = useState(false);
  const [scraperError, setScraperError] = useState<string | null>(null);

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<SearchCache>({});
  const lastSearchParamsRef = useRef<SearchParams | null>(null);

  // Функция для проверки, является ли строка ИНН
  const isINN = useCallback((query: string): boolean => {
    const cleanQuery = query.replace(/\s/g, '');
    return /^\d{10}$|^\d{12}$/.test(cleanQuery);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const generateCacheKey = useCallback((params: SearchParams): string => {
    return JSON.stringify({
      query: params.query.toLowerCase().trim(),
      type: params.type,
      filters: params.filters,
    });
  }, []);

  const isCacheValid = useCallback((timestamp: number): boolean => {
    return Date.now() - timestamp < 5 * 60 * 1000;
  }, []);

  const cleanCache = useCallback(() => {
    const cache = cacheRef.current;
    
    Object.keys(cache).forEach(key => {
      if (!isCacheValid(cache[key].timestamp)) {
        delete cache[key];
      }
    });

    const cacheKeys = Object.keys(cache);
    if (cacheKeys.length > maxCacheSize) {
      const sortedKeys = cacheKeys.sort((a, b) => 
        cache[a].timestamp - cache[b].timestamp
      );
      
      const keysToDelete = sortedKeys.slice(0, cacheKeys.length - maxCacheSize);
      keysToDelete.forEach(key => delete cache[key]);
    }
  }, [isCacheValid, maxCacheSize]);

  const performSearch = useCallback(async (params: SearchParams): Promise<void> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      if (cacheResults) {
        const cacheKey = generateCacheKey(params);
        const cachedData = cacheRef.current[cacheKey];
        
        if (cachedData && isCacheValid(cachedData.timestamp)) {
          setResults(cachedData.data);
          setTotalCount(cachedData.totalCount);
          setTotalPages(cachedData.totalPages);
          setCurrentPage(params.page || 1);
          setHasSearched(true);
          setLoading(false);
          return;
        }
      }

      const response: ApiResponse<SearchResponse> = await searchAPI.search(params);

      if (response.success && response.data) {
        const { results: newResults, totalCount: newTotalCount, totalPages: newTotalPages } = response.data;
        
        if (params.page && params.page > 1) {
          setResults(prev => [...prev, ...newResults]);
        } else {
          setResults(newResults);
        }
        
        setTotalCount(newTotalCount);
        setTotalPages(newTotalPages);
        setCurrentPage(params.page || 1);
        setHasSearched(true);

        if (cacheResults && (!params.page || params.page === 1)) {
          const cacheKey = generateCacheKey(params);
          cacheRef.current[cacheKey] = {
            data: newResults,
            totalCount: newTotalCount,
            totalPages: newTotalPages,
            timestamp: Date.now(),
          };
          cleanCache();
        }

      } else {
        setError(response.error?.message || 'Произошла ошибка при поиске');
      }

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  }, [cacheResults, generateCacheKey, isCacheValid, cleanCache]);

  const scrapeCompany = useCallback(async (inn: string) => {
    setIsScraperLoading(true);
    setScraperError(null);
    setScraperData(null);

    try {
      const data = await scrapeCompanyData(inn);
      setScraperData(data);
    } catch (err) {
      setScraperError(err instanceof Error ? err.message : 'Не удалось получить данные компании');
    } finally {
      setIsScraperLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback((query: string, options: Partial<SearchParams> = {}) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      const trimmedQuery = query.trim();
      
      if (trimmedQuery.length >= 2) {
        // Если запрос является ИНН, запускаем только парсер
        if (isINN(trimmedQuery)) {
          await scrapeCompany(trimmedQuery);
        } else {
          // Для обычных запросов выполняем поиск
          const searchParams: SearchParams = {
            query: trimmedQuery,
            type: options.type || 'all',
            filters: { ...filters, ...options.filters },
            page: 1,
            limit: options.limit || 20,
          };
          
          lastSearchParamsRef.current = searchParams;
          performSearch(searchParams);
        }
      }
    }, debounceMs);
  }, [debounceMs, filters, performSearch, isINN, scrapeCompany]);

  const search = useCallback(async (query: string, options: Partial<SearchParams> = {}) => {
    const trimmedQuery = query.trim();
    
    if (autoSearch) {
      debouncedSearch(query, options);
    } else {
      const searchParams: SearchParams = {
        query: trimmedQuery,
        type: options.type || 'all',
        filters: { ...filters, ...options.filters },
        page: 1,
        limit: options.limit || 20,
      };
      
      lastSearchParamsRef.current = searchParams;
      await performSearch(searchParams);
    }
  }, [autoSearch, debouncedSearch, filters, performSearch]);

  const clearResults = useCallback(() => {
    setResults([]);
    setTotalCount(0);
    setCurrentPage(1);
    setTotalPages(0);
    setHasSearched(false);
    setError(null);
    setScraperData(null);
    setScraperError(null);
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  const hasMore = useMemo(() => {
    return currentPage < totalPages && !loading;
  }, [currentPage, totalPages, loading]);

  const loadMore = useCallback(async () => {
    if (lastSearchParamsRef.current && hasMore && !loading) {
      const nextPage = currentPage + 1;
      const searchParams: SearchParams = {
        ...lastSearchParamsRef.current,
        page: nextPage,
      };
      
      await performSearch(searchParams);
    }
  }, [currentPage, hasMore, loading, performSearch]);

  const setFilters = useCallback((newFilters: SearchFilters) => {
    setFiltersState(newFilters);
    
    if (lastSearchParamsRef.current) {
      const searchParams: SearchParams = {
        ...lastSearchParamsRef.current,
        filters: { ...filters, ...newFilters },
        page: 1,
      };
      
      lastSearchParamsRef.current = searchParams;
      performSearch(searchParams);
    }
  }, [filters, performSearch]);

  const retry = useCallback(async () => {
    if (lastSearchParamsRef.current) {
      await performSearch(lastSearchParamsRef.current);
    }
  }, [performSearch]);

  const isEmpty = useMemo(() => {
    return hasSearched && results.length === 0 && !loading;
  }, [hasSearched, results.length, loading]);

  const isError = useMemo(() => {
    return !!error;
  }, [error]);

  const isSuccess = useMemo(() => {
    return hasSearched && !loading && !error && results.length > 0;
  }, [hasSearched, loading, error, results.length]);

  return {
    results,
    loading,
    error,
    totalCount,
    currentPage,
    totalPages,
    hasSearched,
    scraperData,
    isScraperLoading,
    scraperError,

    search,
    clearResults,
    loadMore,
    setFilters,
    retry,
    scrapeCompany,
    isINN,

    hasMore,
    isEmpty,
    isError,
    isSuccess,
  };
}
