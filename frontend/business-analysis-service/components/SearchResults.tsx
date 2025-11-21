'use client'

import React from 'react'
import Link from 'next/link'

import { SearchResult } from '@/lib/api/search'
import { ScraperResponse } from '@/lib/api/scraper'

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
  error: string | null
  onResultClick?: (result: SearchResult) => void
  scraperData?: ScraperResponse | null
  isScraperLoading?: boolean
  scraperError?: string | null
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  error,
  onResultClick,
  scraperData,
  isScraperLoading,
  scraperError
}) => {
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        background: 'white',
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#64748B',
          fontSize: '16px',
          fontFamily: 'Manrope'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #E2E8F0',
            borderTop: '2px solid #2563EB',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Поиск компаний...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        padding: '40px',
        background: 'white',
        borderRadius: '5px',
        marginTop: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          color: '#EF4444',
          fontSize: '16px',
          fontFamily: 'Manrope',
          marginBottom: '10px'
        }}>
          Ошибка поиска
        </div>
        <div style={{
          color: '#64748B',
          fontSize: '14px',
          fontFamily: 'Manrope'
        }}>
          {error}
        </div>
      </div>
    )
  }

  // Отображение данных парсера
  const renderScraperData = () => {
    if (isScraperLoading) {
      return (
        <div style={{
          padding: '20px',
          background: 'white',
          borderRadius: '5px',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            color: '#64748B',
            fontSize: '16px',
            fontFamily: 'Manrope'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #E2E8F0',
              borderTop: '2px solid #2563EB',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            Получение данных компании...
          </div>
        </div>
      )
    }

    if (scraperError) {
      return (
        <div style={{
          padding: '20px',
          background: 'white',
          borderRadius: '5px',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            color: '#EF4444',
            fontSize: '16px',
            fontFamily: 'Manrope',
            marginBottom: '10px'
          }}>
            Ошибка получения данных
          </div>
          <div style={{
            color: '#64748B',
            fontSize: '14px',
            fontFamily: 'Manrope'
          }}>
            {scraperError}
          </div>
        </div>
      )
    }

    if (scraperData && scraperData.success) {
      const { data } = scraperData
      return (
        <div style={{
          padding: '20px',
          background: 'white',
          borderRadius: '5px',
          marginTop: '20px'
        }}>
          <div style={{
            color: '#2563EB',
            fontSize: '18px',
            fontFamily: 'Manrope',
            fontWeight: '600',
            marginBottom: '15px'
          }}>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{
                color: '#64748B',
                fontSize: '14px',
                fontFamily: 'Manrope',
                marginBottom: '5px'
              }}>
                Название компании
              </div>
              <div style={{
                color: '#141414',
                fontSize: '16px',
                fontFamily: 'Manrope',
                fontWeight: '500'
              }}>
                {data.company_name}
              </div>
            </div>
            
            <div>
              <div style={{
                color: '#64748B',
                fontSize: '14px',
                fontFamily: 'Manrope',
                marginBottom: '5px'
              }}>
                ИНН
              </div>
              <div style={{
                color: '#141414',
                fontSize: '16px',
                fontFamily: 'Manrope',
                fontWeight: '500'
              }}>
                {data.inn}
              </div>
            </div>
            
            <div>
              <div style={{
                color: '#64748B',
                fontSize: '14px',
                fontFamily: 'Manrope',
                marginBottom: '5px'
              }}>
                ОГРН
              </div>
              <div style={{
                color: '#141414',
                fontSize: '16px',
                fontFamily: 'Manrope',
                fontWeight: '500'
              }}>
                {data.ogrn}
              </div>
            </div>
            
            <div>
              <div style={{
                color: '#64748B',
                fontSize: '14px',
                fontFamily: 'Manrope',
                marginBottom: '5px'
              }}>
                Руководитель
              </div>
              <div style={{
                color: '#141414',
                fontSize: '16px',
                fontFamily: 'Manrope',
                fontWeight: '500'
              }}>
                {data.general_director}
              </div>
            </div>
            
            <div>
              <div style={{
                color: '#64748B',
                fontSize: '14px',
                fontFamily: 'Manrope',
                marginBottom: '5px'
              }}>
                Количество сотрудников
              </div>
              <div style={{
                color: '#141414',
                fontSize: '16px',
                fontFamily: 'Manrope',
                fontWeight: '500'
              }}>
                {data.employees_count}
              </div>
            </div>
            
            <div>
              <div style={{
                color: '#64748B',
                fontSize: '14px',
                fontFamily: 'Manrope',
                marginBottom: '5px'
              }}>
                Вид деятельности
              </div>
              <div style={{
                color: '#141414',
                fontSize: '16px',
                fontFamily: 'Manrope',
                fontWeight: '500'
              }}>
                {data.activity.desc}
              </div>
            </div>
          </div>
          
          {data.contacts.phone && (
            <div style={{
              marginBottom: '10px'
            }}>
              <div style={{
                color: '#64748B',
                fontSize: '14px',
                fontFamily: 'Manrope',
                marginBottom: '5px'
              }}>
                Телефон
              </div>
              <div style={{
                color: '#141414',
                fontSize: '16px',
                fontFamily: 'Manrope',
                fontWeight: '500'
              }}>
                {data.contacts.phone}
              </div>
            </div>
          )}
          
          {data.founders && data.founders.length > 0 && (
            <div style={{
              marginBottom: '10px'
            }}>
              <div style={{
                color: '#64748B',
                fontSize: '14px',
                fontFamily: 'Manrope',
                marginBottom: '5px'
              }}>
                Учредители
              </div>
              <div style={{
                color: '#141414',
                fontSize: '16px',
                fontFamily: 'Manrope',
                fontWeight: '500'
              }}>
                {data.founders.join(', ')}
              </div>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  if (results.length === 0) {
    return (
      <div style={{
        padding: '40px',
        background: 'white',
        borderRadius: '5px',
        marginTop: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          color: '#64748B',
          fontSize: '16px',
          fontFamily: 'Manrope'
        }}>
          Компании не найдены
        </div>
        <div style={{
          color: '#94A3B8',
          fontSize: '14px',
          fontFamily: 'Manrope',
          marginTop: '5px'
        }}>
          Попробуйте изменить запрос или проверить правильность написания
        </div>
      </div>
    )
  }

  return (
    <div>
      {renderScraperData()}
      
      <div style={{
        background: 'white',
        borderRadius: '5px',
        marginTop: '20px',
        overflow: 'hidden'
      }}>
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #E2E8F0',
        background: '#F8FAFC'
      }}>
        <div style={{
          fontSize: '18px',
          fontFamily: 'Rubik',
          fontWeight: '500',
          color: '#1E293B'
        }}>
          Найдено компаний: {results.length}
        </div>
      </div>
      
      <div>
        {results.map((result, index) => (
          <Link
            key={result.id}
            href={`/company/${result.inn}`}
            onClick={() => onResultClick?.(result)}
            style={{
              display: 'block',
              padding: '20px',
              borderBottom: index < results.length - 1 ? '1px solid #E2E8F0' : 'none',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F8FAFC'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '20px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '16px',
                  fontFamily: 'Rubik',
                  fontWeight: '500',
                  color: '#1E293B',
                  marginBottom: '5px'
                }}>
                  {result.name}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontFamily: 'Manrope',
                  color: '#64748B',
                  marginBottom: '8px'
                }}>
                  ИНН: {result.inn} | ОГРН: {result.ogrn}
                </div>
                <div style={{
                  fontSize: '12px',
                  fontFamily: 'Manrope',
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {result.status === 'active' ? 'Активная' : 'Неактивная'} | 
                  Рейтинг: {result.rating.level}
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  padding: '8px 16px',
                  background: '#2563EB',
                  color: 'white',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontFamily: 'Manrope',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Подробнее
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </div>
  )
}