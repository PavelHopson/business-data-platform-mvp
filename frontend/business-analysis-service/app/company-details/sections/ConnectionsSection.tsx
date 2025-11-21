import React, { useState } from 'react'

export function ConnectionsSection() {
  const [activeTab, setActiveTab] = useState('current')

  return (
    <div className="connections-container">
      <div className="connections-title">Связи</div>
      <div className="connections-tabs">
        <div 
          onClick={() => setActiveTab('current')}
          className={`connections-tab ${activeTab === 'current' ? 'active' : ''}`}
        >
          Актуальные
        </div>
        <div 
          onClick={() => setActiveTab('historical')}
          className={`connections-tab ${activeTab === 'historical' ? 'active' : ''}`}
        >
          Исторические
        </div>
        <div 
          onClick={() => setActiveTab('all')}
          className={`connections-tab ${activeTab === 'all' ? 'active' : ''}`}
        >
          Все
        </div>
      </div>
      <div className="connections-table">
        <div className="connections-table-column">
          <div className="connections-table-header">
            <div className="connections-table-header-text">Контрагент</div>
          </div>
          <div className="connections-table-content">
            <div className="connections-table-value">ООО &quot;ШОКОЛАДНЫЙ РАЙ +&quot;</div>
            <div className="connections-table-secondary">ИНН 3851005026</div>
          </div>
        </div>
        <div className="connections-table-column">
          <div className="connections-table-header">
            <div className="connections-table-header-text">Тип связи</div>
          </div>
          <div className="connections-table-content">
            <div className="connections-table-secondary">Генеральный директор</div>
            <div className="connections-table-secondary">100.0% (10 000 ₽)</div>
          </div>
        </div>
        <div className="connections-table-column">
          <div className="connections-table-header">
            <div className="connections-table-header-text">Связанный контрагент</div>
          </div>
          <div className="connections-table-content">
            <div className="connections-table-value">Нечаева Наталья Андреевна</div>
            <div className="connections-table-secondary">ИНН 382000171714</div>
          </div>
        </div>
        <div className="connections-table-column">
          <div className="connections-table-header">
            <div className="connections-table-header-text">Уровень</div>
          </div>
          <div className="connections-table-content">
            <div className="connections-table-secondary">0</div>
          </div>
        </div>
      </div>
    </div>
  )
}