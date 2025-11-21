import React, { useState } from 'react'

export function InspectionsSection() {
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
    <div className="inspections-container">
      <div className="inspections-title">Проверки</div>
      <div className="inspections-content">
        <div className="inspections-header">
          <div className="inspections-header-info">
            <div className="inspection-number">№ 38240061000211880280</div>
            <div className="inspection-date">от 22 августа 2024 г.</div>
          </div>
        </div>
        <div className="inspections-table">
          <div className="inspections-table-column">
            <div className="inspections-table-cell-header">
              <div className="inspections-table-label">Тип и форма проверки</div>
            </div>
            <div className="inspections-table-cell">
              <div className="inspections-table-label">Проверяющий орган</div>
            </div>
            <div className="inspections-table-cell">
              <div className="inspections-table-label">Цель проведения проверки</div>
            </div>
            <div className="inspections-table-cell">
              <div className="inspections-table-label">Основания проведения проверки</div>
            </div>
            <div className="inspections-table-cell">
              <div className="inspections-table-label">Место проведения проверки</div>
            </div>
          </div>
          <div className="inspections-table-column-content">
            <div className="inspections-table-cell-content">
              <div className="inspections-table-value">Объявление предостережения</div>
            </div>
            <div className="inspections-table-cell-content">
              <div className="inspections-table-value">ГЛАВНОЕ УПРАВЛЕНИЕ МИНИСТЕРСТВА РОССИЙСКОЙ ФЕДЕРАЦИИ ПО ДЕЛАМ ГРАЖДАНСКОЙ ОБОРОНЫ, ЧРЕЗВЫЧАЙНЫМ СИТУАЦИЯМ И ЛИКВИДАЦИИ ПОСЛЕДСТВИЙ СТИХИЙНЫХ БЕДСТВИЙ ПО ИРКУТСКОЙ ОБЛАСТИ</div>
            </div>
            <div className="inspections-table-cell-content">
              <div className="inspections-table-value">Федеральный государственный пожарный надзор</div>
            </div>
            <div className="inspections-table-cell-content">
              <div className="inspections-table-value">Выдано по результатам КНМ, ПМ</div>
            </div>
            <div className="inspections-table-cell-content">
              <div className="inspections-table-value">Производственные объекты</div>
            </div>
          </div>
        </div>
      </div>
      <div className="inspections-divider"></div>
      <div className="inspections-header">
        <div className="inspections-header-info">
          <div className="inspection-number">№38240061000211880280</div>
          <div className="inspection-date">от 22 августа 2024 г.</div>
        </div>
      </div>
      <div className="inspections-pagination">
        <div 
          onClick={handlePrevPage}
          className={`inspections-pagination-arrow ${currentPage <= 1 ? 'disabled' : ''}`}
        >
          <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(90deg)' }}>
            <path d="M7.84089 0.140065C8.05304 0.32685 8.05304 0.629616 7.84089 0.816401L4.38409 3.85991C4.17194 4.0467 3.82806 4.0467 3.61591 3.85991L0.159112 0.816401C-0.0530367 0.629616 -0.0530367 0.32685 0.159112 0.140065C0.371265 -0.0466723 0.715159 -0.0467042 0.927289 0.140065L4 2.84541L7.07271 0.140065C7.28484 -0.0467042 7.62873 -0.0466723 7.84089 0.140065Z" fill={currentPage > 1 ? '#2563EB' : '#E2E8F0'}/>
          </svg>
        </div>
        {[1, 2, 3, 4, 5].map((page) => (
          <div 
            key={page}
            onClick={() => handlePageChange(page)}
            className={`inspections-pagination-number ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </div>
        ))}
        <div 
          onClick={handleNextPage}
          className={`inspections-pagination-arrow ${currentPage >= totalPages ? 'disabled' : ''}`}
        >
          <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-90deg)' }}>
            <path d="M7.84089 0.140065C8.05304 0.32685 8.05304 0.629616 7.84089 0.816401L4.38409 3.85991C4.17194 4.0467 3.82806 4.0467 3.61591 3.85991L0.159112 0.816401C-0.0530367 0.629616 -0.0530367 0.32685 0.159112 0.140065C0.371265 -0.0466723 0.715159 -0.0467042 0.927289 0.140065L4 2.84541L7.07271 0.140065C7.28484 -0.0467042 7.62873 -0.0466723 7.84089 0.140065Z" fill={currentPage < totalPages ? '#2563EB' : '#E2E8F0'}/>
          </svg>
        </div>
      </div>
    </div>
  )
}
