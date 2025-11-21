import React from 'react'
import { ScraperResponse } from '@/lib/api/scraper'

interface ActivitiesSectionProps {
  scraperData?: ScraperResponse | null;
}

export function ActivitiesSection({ scraperData }: ActivitiesSectionProps) {
  return (
    <div className="activities-container">
      <div className="activities-card">
        <div className="activities-title">Вид деятельности</div>
        <div className="activities-subtitle">Основной вид деятельности ОКВЭД</div>
        <div className="activities-field-group">
          <div className="activities-field-value">
            {scraperData?.data?.activity?.code || 'Не указано'}
          </div>
          <div className="activities-field-description">
            {scraperData?.data?.activity?.desc || 'Описание не указано'}
          </div>
        </div>
        <div className="activities-subtitle">Позиции в отрасли</div>
        <div className="activities-stats-container">
          <div className="activities-stat-column">
            <div className="activities-stat-label-container">
              <div className="activities-stat-label">Место в отрасли</div>
              <div className="activities-stat-label-secondary">(в России)</div>
            </div>
            <div className="activities-stat-value-container">
              <div className="activities-stat-value">#23988</div>
              <div className="activities-stat-value-secondary">из 41639</div>
            </div>
          </div>
          <div className="activities-stat-column">
            <div className="activities-stat-label-container">
              <div className="activities-stat-label">Место в отрасли</div>
              <div className="activities-stat-label-secondary">(в Иркутской области)</div>
            </div>
            <div className="activities-stat-value-container">
              <div className="activities-stat-value">#261</div>
              <div className="activities-stat-value-secondary">из 478</div>
            </div>
          </div>
          <div className="activities-stat-column">
            <div className="activities-stat-label-container">
              <div className="activities-stat-label">Средняя выручка в отрасли</div>
              <div className="activities-stat-label-secondary">(в России)</div>
            </div>
            <div className="activities-stat-value-container">
              <div className="activities-stat-value">85 ₽</div>
              <div className="activities-stat-value-secondary">млн.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="activities-card-centered">
        <div className="activities-title">Все виды деятельности</div>
        <div className="activities-field-group">
          <div className="activities-field-value">
            {scraperData?.data?.activity?.code || 'Не указано'}
          </div>
          <div className="activities-field-description">
            {scraperData?.data?.activity?.desc || 'Описание не указано'}
          </div>
        </div>
        {scraperData?.data?.founders && scraperData.data.founders.length === 0 && (
          <>
            <div className="activities-divider"></div>
            <div className="activities-field-group">
              <div className="activities-field-value">Нет дополнительных видов деятельности</div>
              <div className="activities-field-description">Данные не найдены</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
