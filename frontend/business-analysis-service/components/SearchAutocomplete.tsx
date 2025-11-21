'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSearch } from '@/hooks/useSearch'
import { SearchResult } from '@/lib/api/search'

interface SearchAutocompleteProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  onSearch,
  placeholder = "Название, адрес, ФИО, учредителям, ОГРН и ИНН",
  className = ""
}) => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const {
    results,
    loading,
    error,
    scraperData,
    search,
    clearResults,
    scrapeCompany,
    isINN
  } = useSearch({
    debounceMs: 300,
    autoSearch: true,
    cacheResults: true,
    maxCacheSize: 50,
  })

  // Обработка изменения ввода
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)
    
    if (value.length >= 2) {
      setShowSuggestions(true)
      // Если введен ИНН, запускаем парсер
      if (isINN(value)) {
        scrapeCompany(value)
      } else {
        search(value)
      }
    } else {
      setShowSuggestions(false)
      clearResults()
    }
  }, [search, clearResults, isINN, scrapeCompany])

  // Обработка выбора предложения
  const handleSuggestionClick = useCallback((company: SearchResult) => {
    setQuery(company.name)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    
    // Переход на страницу карточки компании
    router.push(`/company-details?inn=${company.inn}`)
    onSearch?.(company.name)
  }, [router, onSearch])

  // Обработка выбора данных парсера
  const handleScraperSelect = useCallback(() => {
    if (scraperData) {
      setQuery(scraperData.data.company_name)
      setShowSuggestions(false)
      setSelectedIndex(-1)
      
      // Переход на страницу карточки компании
      router.push(`/company-details?inn=${scraperData.data.inn}`)
      onSearch?.(scraperData.data.company_name)
    }
  }, [scraperData, router, onSearch])

  // Обработка поиска
  const handleSearch = useCallback(() => {
    if (query.trim()) {
      // Если запрос является ИНН, запускаем парсер
      if (isINN(query.trim())) {
        scrapeCompany(query.trim())
      } else {
        search(query.trim())
      }
      
      // Если есть результаты поиска или данные парсера, переходим на страницу компании
      if (results.length > 0) {
        // Берем первый результат поиска
        const firstResult = results[0]
        router.push(`/company-details?inn=${firstResult.inn}`)
        onSearch?.(firstResult.name)
      } else if (scraperData && scraperData.success) {
        // Если есть данные парсера, используем их
        router.push(`/company-details?inn=${scraperData.data.inn}`)
        onSearch?.(scraperData.data.company_name)
      } else {
        // Если нет результатов, просто выполняем поиск
        onSearch?.(query)
      }
    }
    setShowSuggestions(false)
  }, [query, search, isINN, scrapeCompany, onSearch, results, scraperData, router])

  // Обработка нажатий клавиш
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return

    const totalItems = results.length + (scraperData ? 1 : 0)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < totalItems - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : totalItems - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          if (selectedIndex === 0 && scraperData) {
            handleScraperSelect()
          } else {
            const resultIndex = scraperData ? selectedIndex - 1 : selectedIndex
            handleSuggestionClick(results[resultIndex])
          }
        } else {
          handleSearch()
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }, [showSuggestions, selectedIndex, results, scraperData, handleSuggestionClick, handleScraperSelect, handleSearch])

  // Закрытие предложений при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div style={{ 
        display: 'flex',
        width: '1440px', 
        paddingLeft: 20,
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'white', 
        borderRadius: 5, 
        outline: '1px #2563EB solid', 
        outlineOffset: '-1px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z" fill="#64748B"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: '#64748B',
              fontSize: 14,
              fontFamily: 'Manrope',
              fontWeight: '500',
              lineHeight: '17.50px',
              padding: '10px 0',
              width: '900px',
              flexShrink: 0
            }}
          />
        </div>
        <button 
          onClick={handleSearch}
          style={{ 
            width: '203px',
            height: '38px',
            background: '#2563EB', 
            borderRadius: 5, 
            border: 'none',
            cursor: 'pointer',
            color: 'white', 
            fontSize: 14, 
            fontFamily: 'Manrope', 
            fontWeight: '500', 
            lineHeight: '17.50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Проверить контрагента
        </button>
      </div>

      {showSuggestions && (results.length > 0 || scraperData) && (
        <div
          ref={suggestionsRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #E2E8F0',
            borderRadius: '5px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {scraperData && scraperData.success && (
            <div
              onClick={handleScraperSelect}
              style={{
                padding: '12px 20px',
                cursor: 'pointer',
                backgroundColor: selectedIndex === 0 ? '#F1F5F9' : 'transparent',
                borderBottom: '1px solid #E2E8F0',
                fontSize: '14px',
                fontFamily: 'Manrope',
                color: '#1E293B'
              }}
              onMouseEnter={() => setSelectedIndex(0)}
            >
              <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                {scraperData.data.company_name}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                ИНН: {scraperData.data.inn} • ОГРН: {scraperData.data.ogrn}
              </div>
            </div>
          )}

          {results.map((company, index) => {
            const adjustedIndex = scraperData ? index + 1 : index
            return (
              <div
                key={company.id}
                onClick={() => handleSuggestionClick(company)}
                style={{
                  padding: '12px 20px',
                  cursor: 'pointer',
                  backgroundColor: adjustedIndex === selectedIndex ? '#F1F5F9' : 'transparent',
                  borderBottom: index < results.length - 1 ? '1px solid #E2E8F0' : 'none',
                  fontSize: '14px',
                  fontFamily: 'Manrope',
                  color: '#1E293B'
                }}
                onMouseEnter={() => setSelectedIndex(adjustedIndex)}
              >
                <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                  {company.name}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  ИНН: {company.inn} • ОГРН: {company.ogrn}
                </div>
                {company.address && (
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                    {company.address}
                  </div>
                )}
              </div>
            )
          })}

          {loading && results.length === 0 && !scraperData && (
            <div style={{ padding: '12px 20px', textAlign: 'center', color: '#64748B' }}>
              Поиск компаний...
            </div>
          )}

          {!loading && results.length === 0 && !scraperData && query.length >= 2 && (
            <div style={{ padding: '12px 20px', textAlign: 'center', color: '#9CA3AF' }}>
              Ничего не найдено
            </div>
          )}

          {error && (
            <div style={{ padding: '12px 20px', textAlign: 'center', color: '#EF4444' }}>
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
