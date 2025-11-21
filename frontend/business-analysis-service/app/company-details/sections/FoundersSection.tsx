import React, { useState } from 'react'
import { ScraperResponse } from '@/lib/api/scraper'

interface FoundersSectionProps {
  scraperData?: ScraperResponse | null;
}

export function FoundersSection({ scraperData }: FoundersSectionProps) {
  const [activeTab, setActiveTab] = useState('current')
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 5

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="founders-container">
      <div className="founders-title">Учредители</div>
      <div className="founders-tabs">
        <div 
          onClick={() => setActiveTab('current')}
          className={`founders-tab ${activeTab === 'current' ? 'active' : ''}`}
        >
          Актуальные
        </div>
        <div 
          onClick={() => setActiveTab('historical')}
          className={`founders-tab ${activeTab === 'historical' ? 'active' : ''}`}
        >
          Исторические
        </div>
      </div>
      
      {scraperData?.data?.founders && scraperData.data.founders.length > 0 ? (
        <div className="founders-content">
          {scraperData.data.founders.map((founder, index) => (
            <div key={index}>
              <div className="founders-header">
                <div className="founders-header-info">
                  <div className="founders-name">{founder}</div>
                  <div className="founders-inn">ИНН не указан</div>
                </div>
              </div>
              <div className="founders-table">
                <div className="founders-table-column">
                  <div className="founders-table-cell">
                    <div className="founders-table-label">Роль</div>
                  </div>
                  <div className="founders-table-cell">
                    <div className="founders-table-label">Доля</div>
                  </div>
                  <div className="founders-table-cell">
                    <div className="founders-table-label">Период</div>
                  </div>
                </div>
                <div className="founders-table-column-content">
                  <div className="founders-table-cell-content">
                    <div className="founders-table-value">Учредитель</div>
                  </div>
                  <div className="founders-table-cell-content">
                    <div className="founders-table-value-container">
                      <div className="founders-table-value-amount">Данные не найдены</div>
                      <div className="founders-table-value-percent">(Данные не найдены)</div>
                    </div>
                  </div>
                  <div className="founders-table-cell-content">
                    <div className="founders-table-value">Данные не найдены</div>
                  </div>
                </div>
              </div>
              {index < scraperData.data.founders.length - 1 && <div className="founders-divider"></div>}
            </div>
          ))}
        </div>
      ) : (
        <div className="founders-content">
          <div className="founders-header">
            <div className="founders-header-info">
              <div className="founders-name">Данные не найдены</div>
              <div className="founders-inn">Учредители не указаны</div>
            </div>
          </div>
          <div className="founders-table">
            <div className="founders-table-column">
              <div className="founders-table-cell">
                <div className="founders-table-label">Роль</div>
              </div>
              <div className="founders-table-cell">
                <div className="founders-table-label">Доля</div>
              </div>
              <div className="founders-table-cell">
                <div className="founders-table-label">Период</div>
              </div>
            </div>
            <div className="founders-table-column-content">
              <div className="founders-table-cell-content">
                <div className="founders-table-value">-</div>
              </div>
              <div className="founders-table-cell-content">
                <div className="founders-table-value-container">
                  <div className="founders-table-value-amount">-</div>
                  <div className="founders-table-value-percent">(-)</div>
                </div>
              </div>
              <div className="founders-table-cell-content">
                <div className="founders-table-value">-</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="founders-pagination">
        <div 
          onClick={handlePrevPage}
          className={`founders-pagination-arrow ${currentPage <= 1 ? 'disabled' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {[1, 2, 3, 4, 5].map((page) => (
          <div 
            key={page}
            onClick={() => handlePageChange(page)}
            className={`founders-pagination-number ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </div>
        ))}
        <div 
          onClick={handleNextPage}
          className={`founders-pagination-arrow ${currentPage >= totalPages ? 'disabled' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}