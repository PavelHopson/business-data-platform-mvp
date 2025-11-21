import React, { useState } from 'react'

export function ReliabilitySection() {
  const [activeTab, setActiveTab] = useState('all')
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
    <div className="reliability-container">
      <div className="reliability-title">Факты</div>
      <div className="reliability-tabs">
        <div 
          onClick={() => setActiveTab('all')}
          className={`reliability-tab ${activeTab === 'all' ? 'active' : ''}`}
        >
          Все
        </div>
        <div 
          onClick={() => setActiveTab('positive')}
          className={`reliability-tab ${activeTab === 'positive' ? 'active' : ''}`}
        >
          Положительные
        </div>
        <div 
          onClick={() => setActiveTab('attention')}
          className={`reliability-tab ${activeTab === 'attention' ? 'active' : ''}`}
        >
          Требуют внимания
        </div>
        <div 
          onClick={() => setActiveTab('negative')}
          className={`reliability-tab ${activeTab === 'negative' ? 'active' : ''}`}
        >
          Отрицательные
        </div>
      </div>
      <div className="reliability-content">
        <div className="reliability-item">
          <div className="reliability-icon reliability-icon-green">
            <div className="reliability-icon-check" />
          </div>
          <div className="reliability-item-content">
            <div className="reliability-item-title">Банкротство:</div>
            <div className="reliability-item-value">Нет</div>
          </div>
        </div>
        <div className="reliability-description">
          <div className="reliability-description-text">В соответствии с данными Единого федерального ресурса сведений о банкротстве (ЕФРСБ), организация не находится в процессе банкротства.</div>
        </div>
      </div>
      <div className="reliability-divider"></div>
      <div className="reliability-item">
        <div className="reliability-icon reliability-icon-yellow">
          <div className="reliability-icon-warning" />
        </div>
        <div className="reliability-item-content">
          <div className="reliability-item-title">Завершенные арбитражные дела:</div>
          <div className="reliability-item-value">0</div>
        </div>
      </div>
      <div className="reliability-divider"></div>
      <div className="reliability-item">
        <div className="reliability-icon reliability-icon-yellow">
          <div className="reliability-icon-warning" />
        </div>
        <div className="reliability-item-content">
          <div className="reliability-item-title">Завершенные исполнительные производства:</div>
          <div className="reliability-item-value">0</div>
        </div>
      </div>
      <div className="reliability-divider"></div>
      <div className="reliability-item">
        <div className="reliability-icon reliability-icon-red">
          <div className="reliability-icon-error" />
        </div>
        <div className="reliability-item-content">
          <div className="reliability-item-title">Завершенные проверки:</div>
          <div className="reliability-item-value">0</div>
        </div>
      </div>
      <div className="reliability-divider"></div>
      <div className="reliability-item">
        <div className="reliability-icon reliability-icon-green">
          <div className="reliability-icon-check" />
        </div>
        <div className="reliability-item-content">
          <div className="reliability-item-title">Возраст:</div>
          <div className="reliability-item-value">0</div>
        </div>
      </div>
      <div className="reliability-divider"></div>
      <div className="reliability-item">
        <div className="reliability-icon reliability-icon-yellow">
          <div className="reliability-icon-warning" />
        </div>
        <div className="reliability-item-content">
          <div className="reliability-item-title">Среднесписочная численность:</div>
          <div className="reliability-item-value">0</div>
        </div>
      </div>
      <div className="reliability-divider"></div>
      <div className="reliability-item">
        <div className="reliability-icon reliability-icon-green">
          <div className="reliability-icon-check" />
        </div>
        <div className="reliability-item-content">
          <div className="reliability-item-title">Наличие выплат персоналу:</div>
          <div className="reliability-item-value">0</div>
        </div>
      </div>
      <div className="reliability-divider"></div>
      <div className="reliability-item">
        <div className="reliability-icon reliability-icon-yellow">
          <div className="reliability-icon-warning" />
        </div>
        <div className="reliability-item-content">
          <div className="reliability-item-title">Уставный капитал:</div>
          <div className="reliability-item-value">0</div>
        </div>
      </div>
      <div className="reliability-divider"></div>
      <div className="reliability-item">
        <div className="reliability-icon reliability-icon-green">
          <div className="reliability-icon-check" />
        </div>
        <div className="reliability-item-content">
          <div className="reliability-item-title">Руководитель:</div>
          <div className="reliability-item-value">0</div>
        </div>
      </div>
      <div className="reliability-divider"></div>
      <div className="reliability-item">
        <div className="reliability-icon reliability-icon-green">
          <div className="reliability-icon-check" />
        </div>
        <div className="reliability-item-content">
          <div className="reliability-item-title">Учредители:</div>
          <div className="reliability-item-value">0</div>
        </div>
      </div>
      <div className="reliability-pagination">
        <div 
          onClick={handlePrevPage}
          className={`reliability-pagination-arrow ${currentPage <= 1 ? 'disabled' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {[1, 2, 3, 4, 5].map((page) => (
          <div 
            key={page}
            onClick={() => handlePageChange(page)}
            className={`reliability-pagination-number ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </div>
        ))}
        <div 
          onClick={handleNextPage}
          className={`reliability-pagination-arrow ${currentPage >= totalPages ? 'disabled' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
