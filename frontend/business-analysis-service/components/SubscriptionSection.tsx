'use client'

import React from 'react'

const SubscriptionSection: React.FC = () => {
  return (
    <div className="dashboard-content">
      <div className="tariff-grid">
        <div className="tariff-card">
          <h3 className="tariff-name">Стандарт</h3>
          <p className="tariff-price">
            <span className="text-dark">От</span> 
            <span className="text-primary">0 ₽</span> 
            <span className="text-dark">/ мес.</span>
          </p>
          <a className="tariff-select-outline" href="#">Выбран</a>
          <p className="tariff-subtitle">В тариф входит:</p>
          <ul className="tariff-list">
            <li>Базовые сведения о компании, без доступа к полной информации</li>
            <li>Данные из ЕГРЮЛ, ЕГРИП</li>
          </ul>
        </div>
        
        <div className="tariff-card">
          <h3 className="tariff-name">Профи</h3>
          <p className="tariff-price">
            <span className="text-dark">От</span> 
            <span className="text-primary">990 ₽</span> 
            <span className="text-dark">/ мес.</span>
          </p>
          <a className="tariff-select" href="#">Выбрать</a>
          <p className="tariff-subtitle">В тариф входит:</p>
          <ul className="tariff-list">
            <li>Полная карточка компании</li>
            <li>Проверка руководителей и учредителей</li>
            <li>Выявление цепочек связей контрагентов</li>
            <li>Финансовые показатели, бухотчётность</li>
            <li>Данные из ЕГРЮЛ, ЕГРИП</li>
          </ul>
        </div>
        
        <div className="tariff-card">
          <h3 className="tariff-name">Профи + расширенная <br /> проверка физлиц</h3>
          <p className="tariff-price">
            <span className="text-dark">От</span> 
            <span className="text-primary">1890 ₽</span> 
            <span className="text-dark">/ мес.</span>
          </p>
          <a className="tariff-select" href="#">Выбрать</a>
          <p className="tariff-subtitle">В тариф входит:</p>
          <ul className="tariff-list">
            <li>Все возможности тарифа &quot;Профи&quot;</li>
            <li>10 расширенных отчётов на физлиц в месяц</li>
          </ul>
          <a href="#" className="tariff-features-link">Все особенности тарифа</a>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionSection
