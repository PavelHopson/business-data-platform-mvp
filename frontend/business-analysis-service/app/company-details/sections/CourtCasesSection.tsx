import React, { useState } from 'react'

export function CourtCasesSection() {
  const [activeTab, setActiveTab] = useState('arbitration')
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
    <div className="court-cases-container">
      <div className="court-cases-title">Судебные дела</div>
      <div className="court-cases-tabs">
        <div 
          onClick={() => setActiveTab('arbitration')}
          className={`court-cases-tab ${activeTab === 'arbitration' ? 'active' : ''}`}
        >
          Арбитражный суд
        </div>
        <div 
          onClick={() => setActiveTab('general')}
          className={`court-cases-tab ${activeTab === 'general' ? 'active' : ''}`}
        >
          Суд общей юрисдикции
        </div>
      </div>
      <div className="court-cases-content">
        <div className="court-case-header">
          <div className="court-case-header-info">
            <div className="court-case-number">№А19-16627/2014</div>
            <div className="court-case-date">от 10 октября 2014 г.</div>
          </div>
        </div>
        <div className="court-cases-table">
          <div className="court-cases-table-column">
            <div className="court-cases-table-cell-header">
              <div className="court-cases-table-label">Сумма</div>
            </div>
            <div className="court-cases-table-cell">
              <div className="court-cases-table-label">Исход</div>
            </div>
            <div className="court-cases-table-cell">
              <div className="court-cases-table-label">Категория</div>
            </div>
            <div className="court-cases-table-cell">
              <div className="court-cases-table-label">Тип</div>
            </div>
            <div className="court-cases-table-cell">
              <div className="court-cases-table-label">Истец</div>
            </div>
            <div className="court-cases-table-cell">
              <div className="court-cases-table-label">Ответчик</div>
            </div>
            <div className="court-cases-table-cell">
              <div className="court-cases-table-label">Инстанция</div>
            </div>
          </div>
          <div className="court-cases-table-column-content">
            <div className="court-cases-table-cell-content">
              <div className="court-cases-table-value">300 000 руб.</div>
            </div>
            <div className="court-cases-table-cell-content">
              <div className="court-cases-table-value">Определить не удалось</div>
            </div>
            <div className="court-cases-table-cell-content">
              <div className="court-cases-table-value">О взыскании убытков из средств соотв. бюджета, связ-ных с реализац. законов о предоставл. льгот отдельным категориям граждан</div>
            </div>
            <div className="court-cases-table-cell-content">
              <div className="court-cases-table-value">Экономические споры по гражданским правоотношениям</div>
            </div>
            <div className="court-cases-table-cell-content">
              <div className="court-cases-table-value">Министерство Экономического Развития Иркутской Области</div>
            </div>
            <div className="court-cases-table-cell-content">
              <div className="court-cases-table-value-blue">ООО &quot;Шоколадный РАЙ +&quot;</div>
            </div>
            <div className="court-cases-table-cell-content">
              <div className="court-cases-table-value">АС Иркутской области</div>
            </div>
          </div>
        </div>
      </div>
      <div className="court-cases-divider"></div>
      <div className="court-case-header">
        <div className="court-case-header-info">
          <div className="court-case-number">№А12-34567/2025</div>
          <div className="court-case-date">от 1 января 2025 г.</div>
        </div>
      </div>
      <div className="court-cases-pagination">
        <div 
          onClick={handlePrevPage}
          className={`court-cases-pagination-arrow ${currentPage <= 1 ? 'disabled' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {[1, 2, 3, 4, 5].map((page) => (
          <div 
            key={page}
            onClick={() => handlePageChange(page)}
            className={`court-cases-pagination-number ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </div>
        ))}
        <div 
          onClick={handleNextPage}
          className={`court-cases-pagination-arrow ${currentPage >= totalPages ? 'disabled' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
