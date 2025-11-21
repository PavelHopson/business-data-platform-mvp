import React, { useState } from 'react'

export function ChangesSection() {
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
    <div className="changes-container">
      <div className="changes-title">Последние изменения</div>
      <div className="changes-item">
        <div className="changes-date">10 июля 2024</div>
        <div className="changes-description">Добавлен новый код ОКВЭД &quot;56.10 Деятельность ресторанов и услуги по доставке продуктов питания 2014&quot;</div>
      </div>
      <div className="changes-divider"></div>
      <div className="changes-item">
        <div className="changes-date">10 июля 2024</div>
        <div className="changes-description">Основной код ОКВЭД изменился на &quot;56.10 Деятельность ресторанов и услуги по доставке продуктов питания 2014&quot;</div>
      </div>
      <div className="changes-divider"></div>
      <div className="changes-item">
        <div className="changes-date">10 июля 2024</div>
        <div className="changes-description">Код ОКВЭД &quot;10.71 Производство хлеба и мучных кондитерских изделий, тортов и пирожных недлительного хранения 2014&quot; удален</div>
      </div>
      <div className="changes-divider"></div>
      <div className="changes-item">
        <div className="changes-date">9 апреля 2024</div>
        <div className="changes-description">Юридический адрес изменился с &quot;665401, Иркутская обл, г Черемхово, ул Дударского, д 25&quot; на &quot;665413, Иркутская обл. гор. О. гор. Черемхово, Г Черемхово, Ул Ленина, д. 24, Помещ. 2&quot;</div>
      </div>
      <div className="changes-divider"></div>
      <div className="changes-item">
        <div className="changes-date">20 июля 2016</div>
        <div className="changes-description">Добавлен новый код ОКВЭД &quot;47.29.3 Торговля розничная прочими пищевыми продуктами в специализированных магазинах 2014&quot;</div>
      </div>
      <div className="changes-divider"></div>
      <div className="changes-item">
        <div className="changes-date">20 июля 2016</div>
        <div className="changes-description">Добавлен новый код ОКВЭД &quot;47.29.39 Торговля розничная прочими пищевыми продуктами в специализированных магазинах, не включенными в другие группировки 2014&quot;</div>
      </div>
      <div className="changes-divider"></div>
      <div className="changes-item">
        <div className="changes-date">20 июля 2016</div>
        <div className="changes-description">Добавлен новый код ОКВЭД &quot;47.29.35 Торговля розничная чаем, кофе, какао в специализированных магазинах 2014&quot;</div>
      </div>
      <div className="changes-divider"></div>
      <div className="changes-item">
        <div className="changes-date">20 июля 2016</div>
        <div className="changes-description">Добавлен новый код ОКВЭД &quot;47.29.34 Торговля розничная солью в специализированных магазинах 2014&quot;</div>
      </div>
      <div className="changes-divider"></div>
      <div className="changes-item">
        <div className="changes-date">20 июля 2016</div>
        <div className="changes-description">Добавлен новый код ОКВЭД &quot;47.29.33 Торговля розничная сахаром в специализированных магазинах 2014&quot;</div>
      </div>
      <div className="changes-divider"></div>
      <div className="changes-item">
        <div className="changes-date">20 июля 2016</div>
        <div className="changes-description">Добавлен новый код ОКВЭД &quot;47.29.32 Торговля розничная крупами в специализированных магазинах 2014&quot;</div>
      </div>
      <div className="changes-pagination">
        <div 
          onClick={handlePrevPage}
          className={`pagination-arrow ${currentPage <= 1 ? 'disabled' : ''}`}
        >
          <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(90deg)' }}>
            <path d="M7.84089 0.140065C8.05304 0.32685 8.05304 0.629616 7.84089 0.816401L4.38409 3.85991C4.17194 4.0467 3.82806 4.0467 3.61591 3.85991L0.159112 0.816401C-0.0530367 0.629616 -0.0530367 0.32685 0.159112 0.140065C0.371265 -0.0466723 0.715159 -0.0467042 0.927289 0.140065L4 2.84541L7.07271 0.140065C7.28484 -0.0467042 7.62873 -0.0466723 7.84089 0.140065Z" fill={currentPage > 1 ? '#2563EB' : '#E2E8F0'}/>
          </svg>
        </div>
        {[1, 2, 3, 4, 5].map((page) => (
          <div 
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-number ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </div>
        ))}
        <div 
          onClick={handleNextPage}
          className={`pagination-arrow ${currentPage >= totalPages ? 'disabled' : ''}`}
        >
          <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-90deg)' }}>
            <path d="M7.84089 0.140065C8.05304 0.32685 8.05304 0.629616 7.84089 0.816401L4.38409 3.85991C4.17194 4.0467 3.82806 4.0467 3.61591 3.85991L0.159112 0.816401C-0.0530367 0.629616 -0.0530367 0.32685 0.159112 0.140065C0.371265 -0.0466723 0.715159 -0.0467042 0.927289 0.140065L4 2.84541L7.07271 0.140065C7.28484 -0.0467042 7.62873 -0.0466723 7.84089 0.140065Z" fill={currentPage < totalPages ? '#2563EB' : '#E2E8F0'}/>
          </svg>
        </div>
      </div>
    </div>
  )
}