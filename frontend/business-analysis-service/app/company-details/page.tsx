'use client'

import React, { useState, Suspense, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CompanySearchAutocomplete } from '@/components/CompanySearchAutocomplete'
import { SearchResults } from '@/components/SearchResults'
import { useSearchQuery } from '@/hooks/useSearchQuery'
import { useSearch } from '@/hooks/useSearch'
import { SearchResult } from '@/lib/api/search'
import { ScraperResponse } from '@/lib/api/scraper'
import { BriefInfoSection } from './sections/BriefInfoSection'
import { RequisitesSection } from './sections/RequisitesSection'
import { FinanceSection } from './sections/FinanceSection'
import { RequisitesDetailsSection } from './sections/RequisitesDetailsSection'
import { FoundersSection } from './sections/FoundersSection'
import { ConnectionsSection } from './sections/ConnectionsSection'
import { ActivitiesSection } from './sections/ActivitiesSection'
import { ReliabilitySection } from './sections/ReliabilitySection'
import { CourtCasesSection } from './sections/CourtCasesSection'
import { EnforcementSection } from './sections/EnforcementSection'
import { ChangesSection } from './sections/ChangesSection'
import { ReportsSection } from './sections/ReportsSection'
import { TaxesSection } from './sections/TaxesSection'
import { InspectionsSection } from './sections/InspectionsSection'
import { LoadingSpinner } from '@/components/LoadingSpinner'

function CompanyDetailsPageContent() {
  const [activeSection, setActiveSection] = useState('main')
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  
  // Функция для форматирования чисел
  const formatCurrency = (value: number | undefined): string => {
    if (!value) return '0 ₽';
    return `${value.toLocaleString('ru-RU')} ₽`;
  };

  // Получаем данные за последний доступный год
  const getLatestRevenue = (): number => {
    if (!scraperData?.data?.revenue) return 0;
    const years = Object.keys(scraperData.data.revenue);
    if (years.length === 0) return 0;
    const latestYear = Math.max(...years.map(Number));
    return scraperData.data.revenue[latestYear.toString()] || 0;
  };

  const getLatestProfit = (): number => {
    if (!scraperData?.data?.profit) return 0;
    const years = Object.keys(scraperData.data.profit);
    if (years.length === 0) return 0;
    const latestYear = Math.max(...years.map(Number));
    return scraperData.data.profit[latestYear.toString()] || 0;
  };
  const { query, results, isLoading, error } = useSearchQuery()
  const searchParams = useSearchParams()
  
  // Добавляем хук для парсера
  const {
    scraperData,
    isScraperLoading,
    scrapeCompany,
  } = useSearch({
    debounceMs: 300,
    autoSearch: false,
    cacheResults: true,
    maxCacheSize: 50,
  })

  // Автоматически запускаем парсер при загрузке страницы
  useEffect(() => {
    const inn = searchParams?.get('inn')
    console.log('useEffect triggered:', { inn, scraperData: !!scraperData, isScraperLoading })
    if (inn && !scraperData && !isScraperLoading) {
      console.log(`Loading company profile for INN: ${inn}`)
      scrapeCompany(inn)
    }
  }, [searchParams, scraperData, isScraperLoading, scrapeCompany])


  const handleCompanySelect = (company: SearchResult | ScraperResponse) => {
    if ('inn' in company) {
      // Обычный результат поиска
      window.location.href = `/company-details?inn=${company.inn}`
    } else if (company.data && company.data.inn) {
      // Данные парсера
      window.location.href = `/company-details?inn=${company.data.inn}`
    }
  }

  const mainMenuItems = [
    { id: 'main', label: 'Главное' },
    { id: 'finance', label: 'Финансы' },
    { id: 'requisites', label: 'Реквизиты' },
    { id: 'founders', label: 'Учредители' },
    { id: 'connections', label: 'Связи' },
    { id: 'activities', label: 'Виды деятельности' },
    { id: 'reliability', label: 'Надёжность' },
    { id: 'cases', label: 'Судебные дела' },
    { id: 'enforcement', label: 'Исполнительные...' },
    { id: 'changes', label: 'Последние изменения' }
  ]

  const moreMenuItems = [
    { id: 'reports', label: 'Отчеты и документы' },
    { id: 'taxes', label: 'Налоги и взносы' },
    { id: 'inspections', label: 'Проверки' }
  ]

  const allMenuItems = [...mainMenuItems, ...moreMenuItems]

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <style jsx global>{`
        body {
          overflow-x: hidden;
        }
        html {
          overflow-x: hidden;
        }
      `}</style>
      <div className="company-page" style={{ 
        background: '#F8FAFC', 
        height: activeSection === 'main' ? '4755px' : 'auto',
        overflow: activeSection === 'main' ? 'hidden' : 'visible',
        overflowX: 'hidden',
        paddingLeft: '250px',
        paddingRight: '250px',
        maxWidth: '1420px',
        margin: '0 auto'
      }}>
      
      <Header />

      
      <div className="company-tabs-container" style={{ paddingRight: '250px', margin: 0 }}>
        <div className="search-container" style={{ marginLeft: '-110px' }}>
        <CompanySearchAutocomplete 
          onCompanySelect={handleCompanySelect}
          placeholder="Название, адрес, ФИО, учредителям, ОГРН и ИНН"
        />
        </div>

        
        <div style={{width: 1420, height: 38, justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'inline-flex', overflowX: showMoreMenu ? 'auto' : 'visible'}}>
          {(showMoreMenu ? allMenuItems : mainMenuItems).map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                width: showMoreMenu ? 100 : 120,
                height: 38,
                background: 'white',
                overflow: 'hidden',
                borderRadius: 5,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'inline-flex',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <div style={{
                alignSelf: 'stretch',
                textAlign: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                color: activeSection === item.id ? '#2563EB' : '#141414',
                fontSize: 12,
                fontFamily: 'Rubik',
                fontWeight: '300',
                lineHeight: 17.50,
                wordWrap: 'break-word',
                height: 'auto',
                minHeight: '17.5px'
              }}>
                {item.label}
              </div>
            </div>
          ))}
          <div 
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            style={{
              width: showMoreMenu ? 100 : 120,
              height: 38,
              background: 'white',
              overflow: 'hidden',
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 5,
              display: 'flex',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <div style={{
              textAlign: 'center',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: '#141414',
              fontSize: 14,
              fontFamily: 'Rubik',
              fontWeight: '300',
              lineHeight: 17.50,
              wordWrap: 'break-word',
              height: 'auto',
              minHeight: '17.5px'
            }}>
              {showMoreMenu ? 'Скрыть' : 'Ещё'}
            </div>
            <svg 
              width="8" 
              height="4" 
              viewBox="0 0 8 4" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: showMoreMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
            >
              <path d="M7.84089 0.140065C8.05304 0.32685 8.05304 0.629616 7.84089 0.816401L4.38409 3.85991C4.17194 4.0467 3.82806 4.0467 3.61591 3.85991L0.159112 0.816401C-0.0530367 0.629616 -0.0530367 0.32685 0.159112 0.140065C0.371265 -0.0466723 0.715159 -0.0467042 0.927289 0.140065L4 2.84541L7.07271 0.140065C7.28484 -0.0467042 7.62873 -0.0466723 7.84089 0.140065Z" fill="#141414"/>
            </svg>
          </div>
        </div>
      </div>

      {query && (
        <div style={{ 
          maxWidth: 1440, 
          margin: '0 auto', 
          paddingLeft: 10, 
          paddingRight: 10, 
          paddingTop: 20
        }}>
          <SearchResults 
            results={results}
            isLoading={isLoading}
            error={error}
          />
        </div>
      )}

      
      <div className="tab-content" style={{ 
        maxWidth: 1440, 
        margin: '0 auto', 
        paddingLeft: 10, 
        paddingRight: 250, 
        paddingTop: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 0,
        position: 'relative'
      }}>
        
        
        <div style={{ 
          display: 'flex',
          width: '1420px', 
          padding: '25px',
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          background: 'white',
          borderRadius: 5,
          marginBottom: 25
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <h1 className="headline-2" style={{ margin: 0 }}>
              {isScraperLoading ? 'Загрузка данных...' : 
               scraperData && scraperData.success ? scraperData.data.company_name : 
               'Данные не найдены'}
            </h1>
            <div style={{ color: '#64748B', fontSize: 14, fontFamily: 'Rubik', fontWeight: '300', lineHeight: '16.10px' }}>
              ИНН {isScraperLoading ? '...' : 
                   scraperData && scraperData.success ? scraperData.data.inn : 
                   searchParams?.get('inn') || '...'}
            </div>
          </div>
          <button style={{ 
            width: '157px',
            height: '38px',
            background: '#2563EB', 
            borderRadius: 5,
            border: 'none',
            cursor: 'pointer',
            color: 'white', 
            fontSize: 16, 
            fontFamily: 'Rubik', 
            fontWeight: '500', 
            lineHeight: '18.40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            Отслеживать
          </button>
        </div>

        
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          alignItems: 'flex-start'
        }}>
            
            {/* Показываем кружок загрузки во время загрузки данных */}
            {isScraperLoading && (
              <div style={{ 
                width: '100%', 
                background: 'white',
                borderRadius: '8px',
                padding: '40px',
                marginBottom: 25
              }}>
                <LoadingSpinner size="large" text="Загрузка данных компании..." />
              </div>
            )}
            
            {/* Показываем контент только после завершения загрузки */}
            {!isScraperLoading && activeSection === 'main' && (
              <div style={{ width: '100%', marginBottom: 25 }}>
                <RequisitesSection scraperData={scraperData} />
              </div>
            )}

            {!isScraperLoading && activeSection === 'main' && (
              <div className="company-details-container" style={{ 
                position: 'relative', 
                top: '10px', 
                left: '0', 
                right: '0', 
                zIndex: 10,
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                marginTop: '25px'
              }}>
                  
                  <div className="company-details-column">
                    
                    <div className="company-details-card">
                      <div className="company-details-title">Контакты организации</div>
                      <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'flex'}}>
                        <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 5, display: 'flex'}}>
                          <div className="company-details-label">Телефон:</div>
                          <div className="company-details-value">
                            {scraperData && scraperData.success && scraperData.data.contacts && scraperData.data.contacts.phone ? 
                              scraperData.data.contacts.phone : 
                              'Данные не найдены'
                            }
                          </div>
                        </div>
                        <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 5, display: 'flex'}}>
                          <div className="company-details-label">E-mail:</div>
                          <div className="company-details-link">
                            {scraperData && scraperData.success && scraperData.data.contacts && scraperData.data.contacts.email ? 
                              scraperData.data.contacts.email : 
                              'Добавить'
                            }
                          </div>
                        </div>
                        <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 5, display: 'flex'}}>
                          <div className="company-details-label">Сайт:</div>
                          <div className="company-details-link">
                            {scraperData && scraperData.success && scraperData.data.contacts && scraperData.data.contacts.website ? 
                              scraperData.data.contacts.website : 
                              'Добавить'
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    
                    <div className="company-details-card">
                      <div className="company-details-title">Связи</div>
                      <div className="company-details-tabs">
                        <div className="company-details-tab active">Актуальные</div>
                        <div className="company-details-tab">Исторические</div>
                        <div className="company-details-tab">Все</div>
                      </div>
                      <div className="company-details-stats">
                        <div className="company-details-stats-row">
                          <div className="company-details-stat">
                            <div className="company-details-stat-label">Всего</div>
                            <div className="company-details-stat-value">0</div>
                          </div>
                          <div className="company-details-stat">
                            <div className="company-details-stat-label">По адресу</div>
                            <div className="company-details-stat-value">0</div>
                          </div>
                          <div className="company-details-stat">
                            <div className="company-details-stat-label">По руководителю</div>
                            <div className="company-details-stat-value">0</div>
                          </div>
                        </div>
                        <div className="company-details-stats-row">
                          <div className="company-details-stat">
                            <div className="company-details-stat-label">По учредителю</div>
                            <div className="company-details-stat-value">0</div>
                          </div>
                          <div className="company-details-stat">
                            <div className="company-details-stat-label">По правопреемнику</div>
                            <div className="company-details-stat-value">0</div>
                          </div>
                          <div className="company-details-stat">
                            <div className="company-details-stat-label">Дочерние</div>
                            <div className="company-details-stat-value">0</div>
                          </div>
                        </div>
                      </div>
                      <Image className="company-details-chart" src="https://placehold.co/407x56" alt="Connections chart" width={407} height={56} />
                      <div className="company-details-subtitle">Правопреемники:</div>
                      <div className="company-details-list">
                        <div className="company-details-list-item">
                          <div className="company-details-list-number">1.</div>
                          <div className="company-details-list-text">ООО &quot;ШОКОЛАДНЫЙ РАЙ +&quot;</div>
                        </div>
                        <div className="company-details-list-item">
                          <div className="company-details-list-number">2.</div>
                          <div className="company-details-list-text">ООО &quot;ШОКОЛАДНЫЙ РАЙ +&quot;</div>
                        </div>
                        <div className="company-details-list-item">
                          <div className="company-details-list-number">3.</div>
                          <div className="company-details-list-text">ООО &quot;ШОКОЛАДНЫЙ РАЙ +&quot;</div>
                        </div>
                      </div>
                      <div className="company-details-subtitle">Правопредшественник:</div>
                      <div className="company-details-list-text">ООО &quot;ШОКОЛАДНЫЙ РАЙ +&quot;</div>
                      <div className="company-details-link">Все связи подробно</div>
                    </div>

                    
                    <div className="company-details-card">
                      <div className="company-details-title">Учредители</div>
                      <div className="company-details-tabs">
                        <div className="company-details-tab active">Актуальные</div>
                        <div className="company-details-tab">Исторические</div>
                      </div>
                      <div className="company-details-list">
                        <div className="company-details-list-item">
                          <div className="company-details-list-number">1.</div>
                          <div className="company-details-list-text">Нечаева Наталья Андреевна</div>
                        </div>
                        <div className="company-details-list-item">
                          <div className="company-details-list-number">2.</div>
                          <div className="company-details-list-text">Нечаева Наталья Андреевна</div>
                        </div>
                        <div className="company-details-list-item">
                          <div className="company-details-list-number">3.</div>
                          <div className="company-details-list-text">Нечаева Наталья Андреевна</div>
                        </div>
                        <div className="company-details-list-item">
                          <div className="company-details-list-number">4.</div>
                          <div className="company-details-list-text">Нечаева Наталья Андреевна</div>
                        </div>
                        <div className="company-details-list-item">
                          <div className="company-details-list-number">5.</div>
                          <div className="company-details-list-text">Нечаева Наталья Андреевна</div>
                        </div>
                      </div>
                      <div className="company-details-link">Все учредители</div>
                    </div>

                    
                    <div className="company-details-card">
                      <div className="company-details-title">Судебные дела</div>
                      <div className="company-details-tabs">
                        <div className="company-details-tab active">Арбитражный суд</div>
                        <div className="company-details-tab">Суд общей юрисдикции</div>
                      </div>
                      <div className="company-details-stats-row">
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">Всего дел</div>
                          <div className="company-details-stat-value">1489</div>
                        </div>
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">На общую сумму</div>
                          <div className="company-details-stat-value">10 670 000 ₽</div>
                        </div>
                      </div>
                      <div className="company-details-link">Все дела подробно</div>
                    </div>

                    
                    <div className="company-details-card">
                      <div className="company-details-title">Исполнительные производства</div>
                      <div className="company-details-subtitle">Найдены сведения о 3 исполнительных производствах:</div>
                      <div className="company-details-stats-row">
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">Всего</div>
                          <div className="company-details-stat-value">3</div>
                        </div>
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">Страховые взносы</div>
                          <div className="company-details-stat-value">1</div>
                        </div>
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">Взыскания</div>
                          <div className="company-details-stat-value">2</div>
                        </div>
                      </div>
                      <div className="company-details-link">Все исполнительные производства</div>
                    </div>

                    
                    <div className="company-details-card">
                      <div className="company-details-title">Филиалы и представительства</div>
                      <div className="company-details-subtitle">Найдено 0 филиалов в России и 0 в других странах:</div>
                      <div className="company-details-stats-row">
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">В России</div>
                          <div className="company-details-stat-value">0</div>
                        </div>
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">В других странах</div>
                          <div className="company-details-stat-value">0</div>
                        </div>
                      </div>
                      <div className="company-details-link">Все филиалы и представительства</div>
                    </div>

                    
                    <div className="company-details-card">
                      <div className="company-details-title">Похожие организации</div>
                      <div className="company-details-list">
                        <div className="company-details-list-item">
                          <div className="company-details-list-number">1.</div>
                          <div className="company-details-list-text">ООО &quot;Прованс&quot;</div>
                        </div>
                        <div className="company-details-list-item">
                          <div className="company-details-list-number">2.</div>
                          <div className="company-details-list-text">ООО &quot;Кони&quot;</div>
                        </div>
                        <div className="company-details-list-item">
                          <div className="company-details-list-number">3.</div>
                          <div className="company-details-list-text">ООО &quot;Деловая Русь-Иркутск&quot;</div>
                        </div>
                        <div className="company-details-list-item">
                          <div className="company-details-list-number">4.</div>
                          <div className="company-details-list-text">ООО &quot;Блэкберри&quot;</div>
                        </div>
                        <div className="company-details-list-item">
                          <div className="company-details-list-number">5.</div>
                          <div className="company-details-list-text">ООО &quot;Артстиль&quot;</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  
                  <div className="company-details-column">
                    
                    <div className="company-details-card">
                      <div className="company-details-title">Финансы</div>
                      <div className="company-details-subtitle">Найдены сведения за 2024 год:</div>
                      <div className="company-details-legend">
                        <div className="company-details-legend-item">
                          <div className="company-details-legend-header">
                            <div className="company-details-legend-color" style={{background: '#2563EB'}} />
                            <div className="company-details-legend-text">Выручка</div>
                          </div>
                          <div className="company-details-legend-value">
                            <div className="company-details-legend-value-text">{formatCurrency(getLatestRevenue())}</div>
                          </div>
                        </div>
                        <div className="company-details-legend-item">
                          <div className="company-details-legend-header">
                            <div className="company-details-legend-color" style={{background: '#2AC715'}} />
                            <div className="company-details-legend-text">Прибыль</div>
                          </div>
                          <div className="company-details-legend-value">
                            <div className="company-details-legend-value-text">{formatCurrency(getLatestProfit())}</div>
                          </div>
                        </div>
                        <div className="company-details-legend-item">
                          <div className="company-details-legend-header">
                            <div className="company-details-legend-color" style={{background: '#FA4D0E'}} />
                            <div className="company-details-legend-text">Расходы</div>
                          </div>
                          <div className="company-details-legend-value">
                            <div className="company-details-legend-value-text">0 ₽</div>
                          </div>
                        </div>
                      </div>
                      <Image className="company-details-finance-chart" src="/images/graph.png" alt="Finance chart" width={407} height={110} />
                      <div className="company-details-link">Все финансовые показатели и их анализ</div>
                    </div>

                    
                    <div className="company-details-card">
                      <div className="company-details-title">Налоги и взносы</div>
                      <div className="company-details-subtitle">Найдены сведения за 2024 год:</div>
                      <div className="company-details-stats-row">
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">Налоги</div>
                          <div className="company-details-stat-value">410 000 000 ₽</div>
                        </div>
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">Взносы</div>
                          <div className="company-details-stat-value">67 000 000 ₽</div>
                        </div>
                      </div>
                      <div className="company-details-link">Подробнее</div>
                    </div>

                    
                    <div className="company-details-card">
                      <div className="company-details-title">Госзакупки</div>
                      <div className="company-details-tabs">
                        <div className="company-details-tab active">Как поставщик</div>
                        <div className="company-details-tab">Как заказчик</div>
                      </div>
                      <div className="company-details-stats-row">
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">Закупок</div>
                          <div className="company-details-stat-value">0</div>
                        </div>
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">Контрактов</div>
                          <div className="company-details-stat-value">0</div>
                        </div>
                      </div>
                      <div className="company-details-subtitle">Статус закупки:</div>
                      <div style={{alignSelf: 'stretch', justifyContent: 'space-between', alignItems: 'flex-start', display: 'inline-flex'}}>
                        <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'inline-flex'}}>
                          <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 5, display: 'flex'}}>
                            <div className="company-details-bullet">
                              <div className="company-details-bullet-dot" style={{background: '#2563EB'}} />
                              <div className="company-details-bullet-text">Выиграно</div>
                            </div>
                            <div className="company-details-bullet-value">
                              <div className="company-details-bullet-value-text">0 ₽</div>
                            </div>
                          </div>
                          <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 5, display: 'flex'}}>
                            <div className="company-details-bullet">
                              <div className="company-details-bullet-dot" style={{background: '#2AC715'}} />
                              <div className="company-details-bullet-text">Не выиграно</div>
                            </div>
                            <div className="company-details-bullet-value">
                              <div className="company-details-bullet-value-text">0 ₽</div>
                            </div>
                          </div>
                        </div>
                        <div className="company-details-circle">
                          <div className="company-details-circle-text">Всего</div>
                          <div className="company-details-circle-value">0 ₽</div>
                        </div>
                      </div>
                      <div className="company-details-link">Все закупки</div>
                    </div>

                    
                    <div className="company-details-card">
                      <div className="company-details-title">Проверки</div>
                      <div className="company-details-subtitle">Найдены сведения о 1 проверке:</div>
                      <div className="company-details-stats">
                        <div className="company-details-stats-row">
                          <div className="company-details-stat">
                            <div className="company-details-stat-label">Плановые</div>
                            <div className="company-details-stat-value">1</div>
                          </div>
                          <div className="company-details-stat">
                            <div className="company-details-stat-label">Внеплановые</div>
                            <div className="company-details-stat-value">0</div>
                          </div>
                        </div>
                        <div className="company-details-stats-row">
                          <div className="company-details-stat">
                            <div className="company-details-stat-label">Без нарушений</div>
                            <div className="company-details-stat-value">0</div>
                          </div>
                          <div className="company-details-stat">
                            <div className="company-details-stat-label">С нарушениями</div>
                            <div className="company-details-stat-value">1</div>
                          </div>
                        </div>
                      </div>
                      <div className="company-details-link">Все проверки</div>
                    </div>

                    
                    <div className="company-details-card">
                      <div className="company-details-title">Существенные факты</div>
                      <div className="company-details-subtitle">Найдено 0 сообщений на Федресурсе:</div>
                      <div className="company-details-stats">
                        <div className="company-details-stats-row">
                          <div className="company-details-stat">
                            <div className="company-details-stat-label">Все сообщения</div>
                            <div className="company-details-stat-value">0</div>
                          </div>
                          <div className="company-details-stat">
                            <div className="company-details-stat-label">Банкротства</div>
                            <div className="company-details-stat-value">0</div>
                          </div>
                        </div>
                        <div className="company-details-stats-row">
                          <div className="company-details-stat">
                            <div className="company-details-stat-label">Корпоративные</div>
                            <div className="company-details-stat-value">0</div>
                          </div>
                          <div className="company-details-stat">
                            <div className="company-details-stat-label">Активы и аудит</div>
                            <div className="company-details-stat-value">0</div>
                          </div>
                        </div>
                      </div>
                      <div className="company-details-link">Все сообщения</div>
                    </div>

                    
                    <div className="company-details-card">
                      <div className="company-details-title">Товарные знаки</div>
                      <div className="company-details-subtitle">Найдено 0 товарных знаков:</div>
                      <div className="company-details-stats-row">
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">Всего</div>
                          <div className="company-details-stat-value">2</div>
                        </div>
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">Действующие</div>
                          <div className="company-details-stat-value">1</div>
                        </div>
                      </div>
                      <div className="company-details-link">Все товарные знаки</div>
                    </div>

                    
                    <div className="company-details-card">
                      <div className="company-details-title">Лицензии</div>
                      <div className="company-details-subtitle">Найдены сведения 3 лицензиях по 2 видам лицензируемой деятельности:</div>
                      <div className="company-details-stats-row">
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">Всего</div>
                          <div className="company-details-stat-value">3</div>
                        </div>
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">ЕГРЮЛ</div>
                          <div className="company-details-stat-value">1</div>
                        </div>
                        <div className="company-details-stat">
                          <div className="company-details-stat-label">Росздравнадзор</div>
                          <div className="company-details-stat-value">2</div>
                        </div>
                      </div>
                      <div className="company-details-link">Все лицензии</div>
                    </div>
                  </div>
                </div>
            )}

            {activeSection === 'main' && (
              <div style={{
                display: 'flex',
                gap: 25,
                alignItems: 'flex-start',
                width: '100%',
                marginTop: '25px'
              }}>
                
                <div style={{ width: '938px' }}>
                </div>

                <div style={{ width: '400px', flexShrink: 0 }}>
                  <BriefInfoSection scraperData={scraperData} />
                </div>
              </div>
            )}

               
               {!isScraperLoading && activeSection === 'finance' && (
                 <FinanceSection scraperData={scraperData} />
               )}

               
               {!isScraperLoading && activeSection === 'requisites' && (
                 <RequisitesDetailsSection scraperData={scraperData} />
               )}

               
               {!isScraperLoading && activeSection === 'founders' && (
                 <FoundersSection scraperData={scraperData} />
               )}

               
               {!isScraperLoading && activeSection === 'connections' && (
                 <ConnectionsSection />
               )}

               
               {!isScraperLoading && activeSection === 'activities' && (
                 <ActivitiesSection scraperData={scraperData} />
               )}

               
               {!isScraperLoading && activeSection === 'reliability' && (
                 <ReliabilitySection />
               )}

               
               {!isScraperLoading && activeSection === 'cases' && (
                 <CourtCasesSection />
               )}

               
               {!isScraperLoading && activeSection === 'enforcement' && (
                 <EnforcementSection />
               )}

               
               {!isScraperLoading && activeSection === 'changes' && (
                 <ChangesSection />
               )}

               
               {!isScraperLoading && activeSection === 'reports' && (
                 <ReportsSection />
               )}

               
               {!isScraperLoading && activeSection === 'taxes' && (
                 <TaxesSection />
               )}

               
               {!isScraperLoading && activeSection === 'inspections' && (
                 <InspectionsSection />
               )}

               
               {!isScraperLoading && activeSection !== 'main' && activeSection !== 'finance' && activeSection !== 'requisites' && activeSection !== 'founders' && activeSection !== 'connections' && activeSection !== 'activities' && activeSection !== 'reliability' && activeSection !== 'cases' && activeSection !== 'enforcement' && activeSection !== 'changes' && activeSection !== 'reports' && activeSection !== 'taxes' && activeSection !== 'inspections' && (
                 <div style={{
                   display: 'flex',
                   padding: 25,
                   flexDirection: 'column',
                   alignItems: 'flex-start',
                   gap: 20,
                   alignSelf: 'stretch',
                   background: 'white',
                   borderRadius: 5,
                   minHeight: '400px',
                   width: '100%'
                 }}>
                   <div style={{
                     color: '#64748B',
                     fontSize: 16,
                     fontFamily: 'Rubik',
                     fontWeight: '300',
                     textAlign: 'center',
                     width: '100%'
                   }}>
                     Контент для вкладки &quot;{allMenuItems.find((item) => item.id === activeSection)?.label}&quot; будет добавлен позже
                   </div>
                 </div>
               )}
        </div>

      </div>

      
      <div style={{ marginTop: activeSection === 'main' ? '230px' : '100px' }}>
        <Footer />
      </div>
      </div>
    </>
  )
}

export default function CompanyDetailsPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        width: '100%', 
        minHeight: '100vh', 
        background: '#F8FAFC', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#64748B',
          fontSize: '16px',
          fontFamily: 'Manrope'
        }}>
          Загрузка...
        </div>
      </div>
    }>
      <CompanyDetailsPageContent />
    </Suspense>
  )
}
