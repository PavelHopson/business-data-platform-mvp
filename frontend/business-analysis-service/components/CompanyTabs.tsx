'use client';

import React, { useState } from 'react';

interface Company {
  name: string;
  inn: string;
  ogrn: string;
  status: string;
  region: string;
  address: string;
  registration_date: string;
  financials?: Array<{
    year: number;
    revenue: number;
    profit: number;
    assets: number;
  }>;
  court_cases?: Array<{
    case_number: string;
    date: string;
    court: string;
    status: string;
  }>;
  contracts?: Array<{
    contract_id: string;
    date: string;
    amount: number;
    customer: string;
  }>;
  founders?: Array<{
    name: string;
    share: number;
  }>;
  connections?: Array<{
    name: string;
    relation: string;
  }>;
}

interface CompanyTabsProps {
  company: Company;
}

const CompanyTabs: React.FC<CompanyTabsProps> = ({ company }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const formatNumber = (num: number | undefined): string => {
    if (!num) return '0';
    return num.toLocaleString('ru-RU');
  };

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="company-tabs-container">
      <div className="tabs-navigation">
        {[
          { key: 'overview', label: 'Обзор' },
          { key: 'financials', label: 'Финансы' },
          { key: 'courts', label: 'Суды' },
          { key: 'procurements', label: 'Закупки' },
          { key: 'founders', label: 'Учредители' },
          { key: 'connections', label: 'Связи' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`tab-button ${activeTab === tab.key ? 'active-tab' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <h2 className="company-name">{company.name}</h2>
            <div className="overview-details">
              <p><span className="detail-label">ИНН:</span> {company.inn}</p>
              <p><span className="detail-label">ОГРН:</span> {company.ogrn}</p>
              <p><span className="detail-label">Статус:</span> {company.status}</p>
              <p><span className="detail-label">Регион:</span> {company.region}</p>
              <p><span className="detail-label">Адрес:</span> {company.address}</p>
              <p><span className="detail-label">Дата регистрации:</span> {formatDate(company.registration_date)}</p>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div>
            {company.financials && company.financials.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Год</th>
                    <th>Выручка (₽)</th>
                    <th>Прибыль (₽)</th>
                    <th>Активы (₽)</th>
                  </tr>
                </thead>
                <tbody>
                  {company.financials.map((f, i) => (
                    <tr key={i}>
                      <td>{f.year}</td>
                      <td>{formatNumber(f.revenue)}</td>
                      <td>{formatNumber(f.profit)}</td>
                      <td>{formatNumber(f.assets)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">Финансовые данные недоступны</div>
            )}
          </div>
        )}

        {activeTab === 'courts' && (
          <div>
            {company.court_cases && company.court_cases.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Номер дела</th>
                    <th>Дата</th>
                    <th>Суд</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {company.court_cases.map((c, i) => (
                    <tr key={i}>
                      <td>{c.case_number}</td>
                      <td>{formatDate(c.date)}</td>
                      <td>{c.court}</td>
                      <td>{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">Судебные дела не найдены</div>
            )}
          </div>
        )}

        {activeTab === 'procurements' && (
          <div>
            {company.contracts && company.contracts.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Номер закупки</th>
                    <th>Дата</th>
                    <th>Сумма (₽)</th>
                    <th>Заказчик</th>
                  </tr>
                </thead>
                <tbody>
                  {company.contracts.map((p, i) => (
                    <tr key={i}>
                      <td>{p.contract_id}</td>
                      <td>{formatDate(p.date)}</td>
                      <td>{formatNumber(p.amount)}</td>
                      <td>{p.customer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">Закупки не найдены</div>
            )}
          </div>
        )}

        {activeTab === 'founders' && (
          <div>
            {company.founders && company.founders.length > 0 ? (
              <ul className="data-list">
                {company.founders.map((f, i) => (
                  <li key={i} className="list-item">
                    {f.name} — {f.share * 100}%
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-data">Информация об учредителях недоступна</div>
            )}
          </div>
        )}

        {activeTab === 'connections' && (
          <div>
            {company.connections && company.connections.length > 0 ? (
              <ul className="data-list">
                {company.connections.map((c, i) => (
                  <li key={i} className="list-item">
                    {c.name} ({c.relation})
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-data">Связи не найдены</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyTabs;
