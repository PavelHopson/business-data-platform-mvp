'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useSearch } from '@/hooks/useSearch'
import { SearchResult } from '@/lib/api/search'
import { ScraperResponse } from '@/lib/api/scraper'

interface CompanySearchAutocompleteProps {
  onCompanySelect?: (company: SearchResult | ScraperResponse) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export const CompanySearchAutocomplete: React.FC<CompanySearchAutocompleteProps> = ({
  onCompanySelect,
  placeholder = 'Название, адрес, ФИО, учредителям, ОГРН и ИНН',
  className = '',
  autoFocus = false
}) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const {
    results,
    loading,
    error,
    scraperData,
    isScraperLoading,
    scraperError,
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


  // Обработка изменений в поле ввода
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)
    
    if (value.length >= 2) {
      setIsOpen(true)
      // Если введен ИНН, запускаем парсер
      if (isINN(value)) {
        scrapeCompany(value)
      } else {
        search(value)
      }
    } else {
      setIsOpen(false)
      clearResults()
    }
  }, [search, clearResults, isINN, scrapeCompany])

  // Обработка фокуса
  const handleFocus = useCallback(() => {
    if (query.length >= 2 && (results.length > 0 || scraperData)) {
      setIsOpen(true)
    }
  }, [query, results, scraperData])

  // Обработка потери фокуса
  const handleBlur = useCallback(() => {
    // Задержка для обработки клика по элементу
    setTimeout(() => {
      setIsOpen(false)
      setSelectedIndex(-1)
    }, 200)
  }, [])


  // Выбор результата поиска
  const handleResultSelect = useCallback((result: SearchResult) => {
    setQuery(result.name)
    setIsOpen(false)
    setSelectedIndex(-1)
    onCompanySelect?.(result)
  }, [onCompanySelect])

  // Выбор данных парсера
  const handleScraperSelect = useCallback(() => {
    if (scraperData) {
      setQuery(scraperData.data.company_name)
      setIsOpen(false)
      setSelectedIndex(-1)
      onCompanySelect?.(scraperData)
    }
  }, [scraperData, onCompanySelect])

  // Обработка клавиатуры
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return

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
            handleResultSelect(results[resultIndex])
          }
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }, [isOpen, selectedIndex, results, scraperData, handleResultSelect, handleScraperSelect])

  // Обработка отправки формы
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Если запрос является ИНН, запускаем парсер
      if (isINN(query.trim())) {
        scrapeCompany(query.trim())
      } else {
        search(query.trim())
      }
    }
  }, [query, search, isINN, scrapeCompany])

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Автофокус
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div className={`relative ${className}`} style={{ zIndex: 99999, position: 'relative', pointerEvents: 'auto' }}>
      <form onSubmit={handleSubmit} className="search-form-new" style={{ 
        width: '100%',
        maxWidth: '612px',
        height: '38px',
        marginBottom: '48px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 100000,
        pointerEvents: 'auto'
      }}>
        <Image 
          alt="Search icon" 
          width={16} 
          height={16} 
          src="/images/Union.svg" 
          style={{ 
            width: '16px',
            height: '16px',
            margin: '0 12px',
            color: 'transparent'
          }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-input"
          style={{ 
            flex: 1,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            padding: '0 8px',
            color: '#374151',
            pointerEvents: 'auto'
          }}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="autocomplete-listbox"
          aria-activedescendant={selectedIndex >= 0 ? `option-${selectedIndex}` : undefined}
          aria-autocomplete="list"
        />
        <button 
          type="submit" 
          disabled={!query.trim() || loading}
          className="btn btn-primary"
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '6px 16px',
            fontSize: '14px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            opacity: (!query.trim() || loading) ? 0.5 : 1,
            pointerEvents: (!query.trim() || loading) ? 'none' : 'auto'
          }}
        >
          Проверить контрагента
        </button>
      </form>

      {isOpen && (
        <div 
          ref={dropdownRef}
          id="autocomplete-listbox"
          className="autocomplete-dropdown"
          style={{ 
            position: 'absolute',
            top: '100%',
            marginTop: '4px',
            left: 0,
            width: '100%',
            backgroundColor: '#1a1a1a',
            border: '1px solid #333333',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 100001
          }}
          role="listbox"
        >
          {scraperData && scraperData.success && (
            <div
              id="option-0"
              style={{
                padding: '12px 16px',
                color: '#e5e5e5',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                borderBottom: '1px solid #2a2a2a',
                backgroundColor: selectedIndex === 0 ? '#3b82f6' : 'transparent'
              }}
              onClick={handleScraperSelect}
              onMouseEnter={() => setSelectedIndex(0)}
              role="option"
              aria-selected={selectedIndex === 0}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', fontSize: '16px' }}>
                    {scraperData.data.company_name}
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>
                    ИНН: {scraperData.data.inn} • ОГРН: {scraperData.data.ogrn}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isScraperLoading && (
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #2a2a2a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid #93c5fd', 
                  borderTop: '2px solid #2563eb', 
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span style={{ fontSize: '14px', color: '#d1d5db' }}>Получение данных компании...</span>
              </div>
            </div>
          )}

          {scraperError && (
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #2a2a2a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
                <span style={{ fontSize: '14px', color: '#f87171' }}>{scraperError}</span>
              </div>
            </div>
          )}

          {results.map((result, index) => {
            const adjustedIndex = scraperData ? index + 1 : index
            return (
              <div
                key={result.id}
                id={`option-${adjustedIndex}`}
                style={{
                  padding: '12px 16px',
                  color: '#e5e5e5',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  borderBottom: '1px solid #2a2a2a',
                  backgroundColor: selectedIndex === adjustedIndex ? '#3b82f6' : 'transparent'
                }}
                onClick={() => handleResultSelect(result)}
                onMouseEnter={() => setSelectedIndex(adjustedIndex)}
                role="option"
                aria-selected={selectedIndex === adjustedIndex}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', fontSize: '16px' }}>
                      {result.name}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>
                      ИНН: {result.inn} • ОГРН: {result.ogrn}
                    </div>
                    {result.address && (
                      <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>
                        {result.address}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {loading && results.length === 0 && !scraperData && (
            <div style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid #93c5fd', 
                  borderTop: '2px solid #2563eb', 
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span style={{ fontSize: '14px', color: '#d1d5db' }}>Поиск компаний...</span>
              </div>
            </div>
          )}

          {!loading && results.length === 0 && !scraperData && query.length >= 2 && (
            <div style={{ padding: '20px 16px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
              Ничего не найдено
            </div>
          )}

          {error && (
            <div style={{ padding: '12px 16px', textAlign: 'center', color: '#f87171', fontSize: '14px' }}>
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
