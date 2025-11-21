'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface SearchState {
  query: string
  results: any[]
  isLoading: boolean
  error: string | null
}

export const useSearchQuery = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: [],
    isLoading: false,
    error: null
  })

  // Получение текущего запроса из URL
  const currentQuery = searchParams.get('q') || ''

  // Обновление состояния при изменении URL
  useEffect(() => {
    if (currentQuery !== searchState.query) {
      setSearchState(prev => ({ ...prev, query: currentQuery }))
    }
  }, [currentQuery, searchState.query])

  // Функция поиска
  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchState(prev => ({ ...prev, query: '', results: [], error: null }))
      return
    }

    setSearchState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Здесь будет реальный API вызов
      // Пока используем моковые данные
      const mockResults = await new Promise<any[]>((resolve) => {
        setTimeout(() => {
          const mockData = [
            { id: '1', name: 'Сбербанк', inn: '7707083893', type: 'bank' },
            { id: '2', name: 'Газпром', inn: '7736050003', type: 'oil' },
            { id: '3', name: 'Лукойл', inn: '7708004767', type: 'oil' }
          ]
          resolve(mockData.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.inn.includes(query)
          ))
        }, 500)
      })

      setSearchState(prev => ({
        ...prev,
        query,
        results: mockResults,
        isLoading: false,
        error: null
      }))

      // Обновление URL с новым запросом
      const params = new URLSearchParams(searchParams.toString())
      if (query.trim()) {
        params.set('q', query)
      } else {
        params.delete('q')
      }
      
      const newUrl = params.toString() ? `?${params.toString()}` : ''
      router.push(newUrl, { scroll: false })

    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Ошибка при выполнении поиска'
      }))
    }
  }, [router, searchParams])

  // Очистка поиска
  const clearSearch = useCallback(() => {
    setSearchState(prev => ({ ...prev, query: '', results: [], error: null }))
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.push(newUrl, { scroll: false })
  }, [router, searchParams])

  return {
    ...searchState,
    search,
    clearSearch
  }
}
