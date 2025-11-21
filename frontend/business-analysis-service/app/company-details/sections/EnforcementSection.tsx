import React, { useState } from 'react'

export function EnforcementSection() {
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
    <div className="enforcement-container">
      <div className="enforcement-title">Исполнительные производства</div>
      <div className="enforcement-content">
        <div className="enforcement-header">
          <div className="enforcement-header-info">
            <div className="enforcement-number">№10406/16/38038-ИП</div>
            <div className="enforcement-date">от 17 марта 2016 г.</div>
          </div>
        </div>
        <div className="enforcement-table">
          <div className="enforcement-table-column">
            <div className="enforcement-table-cell-header">
              <div className="enforcement-table-label">Статус</div>
            </div>
            <div className="enforcement-table-cell">
              <div className="enforcement-table-label">Предмет исполнения</div>
            </div>
            <div className="enforcement-table-cell">
              <div className="enforcement-table-label">Реквизиты исполнительного документа</div>
            </div>
            <div className="enforcement-table-cell">
              <div className="enforcement-table-label">Должник</div>
            </div>
            <div className="enforcement-table-cell">
              <div className="enforcement-table-label">Юридический адрес</div>
            </div>
          </div>
          <div className="enforcement-table-column-content">
            <div className="enforcement-table-cell-content">
              <div className="enforcement-table-value">Завершено 29.05.2016 на основании невозможности установить местонахождение должника, его имущества либо получить сведения о наличии принадлежащих ему денежных средств и иных ценностей, находящихся на счетах, во вкладах или на хранении в банках или иных кредитных организациях (229-ФЗ статья 46 п. 1 п.п. 3).</div>
            </div>
            <div className="enforcement-table-cell-content">
              <div className="enforcement-table-value">Взыскание налогов и сборов, включая пени</div>
            </div>
            <div className="enforcement-table-cell-content">
              <div className="enforcement-table-value">от 01.03.2016 № 25399</div>
            </div>
            <div className="enforcement-table-cell-content">
              <div className="enforcement-table-value-blue">ООО &quot;Шоколадный РАЙ +&quot;</div>
            </div>
            <div className="enforcement-table-cell-content">
              <div className="enforcement-table-value">Иркутская обл., г. Черемхово, ул. Дударского, д. 25, 665401</div>
            </div>
          </div>
        </div>
      </div>
      <div className="enforcement-divider"></div>
      <div className="enforcement-header">
        <div className="enforcement-header-info">
          <div className="enforcement-number">№12345/67/89101-ИП</div>
          <div className="enforcement-date">от 1 января 2025 г.</div>
        </div>
      </div>
      <div className="enforcement-pagination">
        <div 
          onClick={handlePrevPage}
          className={`enforcement-pagination-arrow ${currentPage <= 1 ? 'disabled' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {[1, 2, 3, 4, 5].map((page) => (
          <div 
            key={page}
            onClick={() => handlePageChange(page)}
            className={`enforcement-pagination-number ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </div>
        ))}
        <div 
          onClick={handleNextPage}
          className={`enforcement-pagination-arrow ${currentPage >= totalPages ? 'disabled' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}