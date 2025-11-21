'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import SubscriptionSection from '@/components/SubscriptionSection'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('favorites')

  const tabs = [
    { id: 'favorites', label: 'Избранные компании' },
    { id: 'my-companies', label: 'Мои компании' },
    { id: 'profile', label: 'Настройки профиля' },
    { id: 'subscription', label: 'Подписка' }
  ]

  const companyChanges = [
    {
      date: '10 июля 2024',
      description: 'Добавлен новый код ОКВЭД &quot;56.10 Деятельность ресторанов и услуги по доставке продуктов питания 2014&quot;'
    },
    {
      date: '10 июля 2024',
      description: 'Основной код ОКВЭД изменился на &quot;56.10 Деятельность ресторанов и услуги по доставке продуктов питания 2014&quot;'
    },
    {
      date: '10 июля 2024',
      description: 'Код ОКВЭД &quot;10.71 Производство хлеба и мучных кондитерских изделий, тортов и пирожных недлительного хранения 2014&quot; удален'
    },
    {
      date: '9 апреля 2024',
      description: 'Юридический адрес изменился с &quot;665401, Иркутская обл, г Черемхово, ул Дударского, д 25&quot; на &quot;665413, Иркутская обл. гор. О. гор. Черемхово, Г Черемхово, Ул Ленина, д. 24, Помещ. 2&quot;'
    },
    {
      date: '20 июля 2016',
      description: 'Добавлен новый код ОКВЭД &quot;47.29.3 Торговля розничная прочими пищевыми продуктами в специализированных магазинах 2014&quot;'
    }
  ]

  return (
    <div className="dashboard-page">
      {/* Header */}
      <Header />

      {/* Tabs */}
      <div className="dashboard-tabs">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            className={`dashboard-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="dashboard-tab-text">{tab.label}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {activeTab === 'subscription' ? (
          <SubscriptionSection />
        ) : (
          <>
            <div className="dashboard-content-header">
              <h1 className="dashboard-title">Избранные компании</h1>
            </div>

            <div className="dashboard-company-section">
              <div className="dashboard-company-info">
                <div className="dashboard-company-name">ООО &quot;ШОКОЛАДНЫЙ РАЙ +&quot;</div>
                <div className="dashboard-company-inn">ИНН 3851005026</div>
              </div>

              <div className="dashboard-changes-section">
                <div className="dashboard-changes-title">Последние изменения:</div>
                
                <div className="dashboard-changes-list">
                  <div className="dashboard-changes-dates">
                    {companyChanges.map((change, index) => (
                      <div key={index} className="dashboard-change-date">
                        {change.date}
                      </div>
                    ))}
                  </div>
                  
                  <div className="dashboard-changes-descriptions">
                    {companyChanges.map((change, index) => (
                      <div key={index} className="dashboard-change-description">
                        {change.description}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-all-changes-link">Все изменения</div>
              </div>

              <div className="dashboard-divider"></div>

              <div className="dashboard-company-info">
                <div className="dashboard-company-name">ООО &quot;ШОКОЛАДНЫЙ РАЙ +&quot;</div>
                <div className="dashboard-company-inn">ИНН 3851005026</div>
              </div>

              <div className="dashboard-pagination">
                <div className="dashboard-pagination-arrow-left"></div>
                <div className="dashboard-pagination-number active">1</div>
                <div className="dashboard-pagination-number">2</div>
                <div className="dashboard-pagination-number">3</div>
                <div className="dashboard-pagination-number">4</div>
                <div className="dashboard-pagination-number">5</div>
                <div className="dashboard-pagination-arrow-right"></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <div className="dashboard-footer-text">© 2025 GEORGE&apos;S ANALYSIS</div>
      </div>
    </div>
  )
}