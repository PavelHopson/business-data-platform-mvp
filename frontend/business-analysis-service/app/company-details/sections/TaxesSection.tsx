import React from 'react'
import Image from 'next/image'

export function TaxesSection() {
  return (
    <div className="taxes-container">
      <div className="taxes-title">Налоги и взносы</div>
      <div className="taxes-content">
        <div className="taxes-row">
          <div className="taxes-column">
            <div className="taxes-item-header">
              <div className="taxes-indicator taxes-indicator-blue" />
              <div className="taxes-label">Всего</div>
            </div>
            <div className="taxes-value">
              <div className="taxes-value-text">0 ₽</div>
            </div>
          </div>
          <div className="taxes-column">
            <div className="taxes-item-header">
              <div className="taxes-indicator taxes-indicator-green" />
              <div className="taxes-label">Взносы на случай ВНиМ</div>
            </div>
            <div className="taxes-value-container">
              <div className="taxes-value taxes-value-text">0 ₽</div>
            </div>
          </div>
          <div className="taxes-column">
            <div className="taxes-item-header">
              <div className="taxes-indicator taxes-indicator-orange" />
              <div className="taxes-label">Взносы на ОПС</div>
            </div>
            <div className="taxes-value-container">
              <div className="taxes-value taxes-value-text">0 ₽</div>
            </div>
          </div>
        </div>
        <div className="taxes-row">
          <div className="taxes-column">
            <div className="taxes-item-header">
              <div className="taxes-indicator taxes-indicator-purple" />
              <div className="taxes-label">Взносы на ОМС</div>
            </div>
            <div className="taxes-value-container">
              <div className="taxes-value taxes-value-text">0 ₽</div>
            </div>
          </div>
          <div className="taxes-column">
            <div className="taxes-item-header">
              <div className="taxes-indicator taxes-indicator-yellow" />
              <div className="taxes-label">Неналоговые доходы</div>
            </div>
            <div className="taxes-value-container">
              <div className="taxes-value taxes-value-text">0 ₽</div>
            </div>
          </div>
          <div className="taxes-column">
            <div className="taxes-item-header">
              <div className="taxes-indicator taxes-indicator-blue" />
              <div className="taxes-label">Пени</div>
            </div>
            <div className="taxes-value-container">
              <div className="taxes-value taxes-value-text">0 ₽</div>
            </div>
          </div>
        </div>
      </div>
      <Image className="taxes-chart-image" src="/images/graph.png" alt="Taxes chart" width={1370} height={450} />
      <div className="taxes-table">
        <div className="taxes-table-column">
          <div className="taxes-table-header">
            <div className="taxes-table-header-text">Налоги</div>
          </div>
          <div className="taxes-table-cell">
            <div className="taxes-table-cell-text">Взносы на случай временной нетрудоспособности и материнства</div>
          </div>
          <div className="taxes-table-cell">
            <div className="taxes-table-cell-text">Взносы на обязательное пенсионное страхование</div>
          </div>
          <div className="taxes-table-cell">
            <div className="taxes-table-cell-text">Взносы на обязательное медицинское страхование</div>
          </div>
          <div className="taxes-table-cell">
            <div className="taxes-table-cell-text">Налог при упрощенной системе налогообложения</div>
          </div>
          <div className="taxes-table-cell">
            <div className="taxes-table-cell-text">Неналоговые доходы</div>
          </div>
          <div className="taxes-table-cell">
            <div className="taxes-table-cell-text">Пени</div>
          </div>
          <div className="taxes-table-cell">
            <div className="taxes-table-cell-text taxes-table-cell-text-bold">Уплаченные налоги</div>
          </div>
        </div>
        <div className="taxes-table-columns-container">
          <div className="taxes-table-column">
            <div className="taxes-table-header">
              <div className="taxes-table-header-text">2019</div>
            </div>
            <div className="taxes-table-cell taxes-table-cell-highlighted">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
          </div>
          <div className="taxes-table-column">
            <div className="taxes-table-header">
              <div className="taxes-table-header-text">2020</div>
            </div>
            <div className="taxes-table-cell taxes-table-cell-highlighted">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
          </div>
          <div className="taxes-table-column">
            <div style={{alignSelf: 'stretch', padding: 5, background: 'rgba(100, 116, 139, 0.05)', justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'inline-flex'}}>
              <div style={{flex: '1 1 0', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#141414', fontSize: 16, fontFamily: 'Rubik', fontWeight: '400', lineHeight: 'normal', wordWrap: 'break-word'}}>2021</div>
            </div>
            <div className="taxes-table-cell taxes-table-cell-highlighted">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
          </div>
          <div className="taxes-table-column">
            <div className="taxes-table-header">
              <div className="taxes-table-header-text">2022</div>
            </div>
            <div className="taxes-table-cell taxes-table-cell-highlighted">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
          </div>
          <div className="taxes-table-column">
            <div className="taxes-table-header">
              <div className="taxes-table-header-text">2023</div>
            </div>
            <div className="taxes-table-cell taxes-table-cell-highlighted">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
            <div className="taxes-table-cell">
              <div className="taxes-table-cell-text taxes-table-cell-text-blue">0 ₽</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
