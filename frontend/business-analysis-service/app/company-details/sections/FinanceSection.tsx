import React from 'react'
import Image from 'next/image'
import { ScraperResponse } from '@/lib/api/scraper'

interface FinanceSectionProps {
  scraperData?: ScraperResponse | null;
}

export function FinanceSection({ scraperData }: FinanceSectionProps) {
  // Функция для форматирования чисел
  const formatCurrency = (value: number | undefined): string => {
    if (!value) return '0 ₽';
    return `${value.toLocaleString('ru-RU')} ₽`;
  };

  // Получаем данные за последний доступный год
  const getLatestRevenue = (): number => {
    if (!scraperData?.data?.revenue) return 0;
    const years = Object.keys(scraperData.data.revenue);
    if (years.length === 0) return 0;
    const latestYear = Math.max(...years.map(Number));
    return scraperData.data.revenue[latestYear.toString()] || 0;
  };

  const getLatestProfit = (): number => {
    if (!scraperData?.data?.profit) return 0;
    const years = Object.keys(scraperData.data.profit);
    if (years.length === 0) return 0;
    const latestYear = Math.max(...years.map(Number));
    return scraperData.data.profit[latestYear.toString()] || 0;
  };

  return (
    <div className="activities-container">
      <div className="tab-content-container">
      <div className="tab-content-card">
        <div className="tab-section-title">Основные показатели</div>
        <div className="finance-metrics-container">
          <div className="finance-metrics-row">
            <div className="finance-metric-item">
              <div className="finance-metric-header">
                <div className="finance-metric-color" style={{ background: '#2563EB' }} />
                <div className="finance-metric-label">Выручка</div>
              </div>
              <div className="finance-metric-value-container">
                <div className="finance-metric-value">{formatCurrency(getLatestRevenue())}</div>
              </div>
            </div>
            <div className="finance-metric-item">
              <div className="finance-metric-header">
                <div className="finance-metric-color" style={{ background: '#2AC715' }} />
                <div className="finance-metric-label">Прибыль</div>
              </div>
              <div className="finance-metric-value-container">
                <div className="finance-metric-value">{formatCurrency(getLatestProfit())}</div>
              </div>
            </div>
            <div className="finance-metric-item">
              <div className="finance-metric-header">
                <div className="finance-metric-color" style={{ background: '#FA4D0E' }} />
                <div className="finance-metric-label">Расходы</div>
              </div>
              <div className="finance-metric-value-container">
                <div className="finance-metric-value">0 ₽</div>
              </div>
            </div>
          </div>
          <div className="finance-metrics-row-compact">
            <div className="finance-metric-item">
              <div className="finance-metric-header">
                <div className="finance-metric-color" style={{ background: '#C325EB' }} />
                <div className="finance-metric-label">Дебиторская задолженность</div>
              </div>
              <div className="finance-metric-value-container">
                <div className="finance-metric-value">0 ₽</div>
              </div>
            </div>
            <div className="finance-metric-item">
              <div className="finance-metric-header">
                <div className="finance-metric-color" style={{ background: '#FDA00B' }} />
                <div className="finance-metric-label">Кредиторская задолженность</div>
                </div>
              <div className="finance-metric-value-container">
                <div className="finance-metric-value">0 ₽</div>
              </div>
            </div>
          </div>
        </div>
          <div className="finance-description">Сравнение выручки с другими показателями позволит сделать общие выводы об эффективности деятельности организации.</div>
          <Image className="finance-chart" src="/images/graph.png" alt="Financial chart" width={1370} height={357} />
      </div>
      </div>

      <div className="finance-accounting-container">
        <div className="finance-accounting-title">Бухгалтерия</div>
        <div className="finance-accounting-content">
          <div className="finance-accounting-column">
            <div className="finance-accounting-section">
              <div className="finance-accounting-section-title">Актив в 2024 году</div>
              <div className="finance-accounting-item">
                <div className="finance-accounting-item-header">
                  <div className="finance-accounting-dot-blue" />
                  <div className="finance-accounting-label">Внеоборотные активы</div>
                </div>
                <div className="finance-accounting-value-container">
                  <div className="finance-accounting-value">0 ₽</div>
                </div>
              </div>
              <div className="finance-accounting-item">
                <div className="finance-accounting-item-header">
                  <div className="finance-accounting-dot-green" />
                  <div className="finance-accounting-label">Оборотные активы</div>
                </div>
                <div className="finance-accounting-value-container">
                  <div className="finance-accounting-value">0 ₽</div>
                </div>
              </div>
            </div>
            <div className="finance-accounting-total">
              <div className="finance-accounting-total-label">Всего</div>
              <div className="finance-accounting-total-value">0 ₽</div>
            </div>
          </div>
          <div className="finance-accounting-column">
            <div className="finance-passive-section">
              <div className="finance-passive-title">Пассив в 2024 году</div>
              <div className="finance-passive-item">
                <div className="finance-passive-item-header">
                  <div className="finance-passive-dot finance-passive-dot-blue" />
                  <div className="finance-passive-label">Капитал и резервы</div>
                    </div>
                <div className="finance-passive-value-container">
                  <div className="finance-passive-value">0 ₽</div>
                    </div>
                  </div>
              <div className="finance-passive-item">
                <div className="finance-passive-item-header">
                  <div className="finance-passive-dot finance-passive-dot-green" />
                  <div className="finance-passive-label">Долгосрочные обязательства</div>
                </div>
                <div className="finance-passive-value-container">
                  <div className="finance-passive-value">0 ₽</div>
                </div>
              </div>
              <div className="finance-passive-item">
                <div className="finance-passive-item-header">
                  <div className="finance-passive-dot finance-passive-dot-orange" />
                  <div className="finance-passive-label">Краткосрочные обязательства</div>
                </div>
                <div className="finance-passive-value-container">
                  <div className="finance-passive-value">0 ₽</div>
                </div>
              </div>
            </div>
            <div className="finance-passive-circle">
              <div className="finance-passive-circle-label">Всего</div>
              <div className="finance-passive-circle-value">0 ₽</div>
            </div>
          </div>
        </div>
        <div className="finance-reporting-table-container">
          <div className="finance-reporting-table-column">
            <div className="finance-reporting-table-cell-header-empty" />
            <div className="finance-reporting-table-cell finance-reporting-table-cell-header">
              <div className="finance-reporting-table-cell-text finance-reporting-table-cell-text-header">Актив</div>
            </div>
            <div className="finance-reporting-table-cell-content">
              <div className="finance-reporting-table-cell-text">Внеоборотные активы</div>
            </div>
            <div className="finance-reporting-table-cell-content">
              <div className="finance-reporting-table-cell-text">Оборотные активы</div>
            </div>
            <div className="finance-reporting-table-cell finance-reporting-table-cell-header">
              <div className="finance-reporting-table-cell-text finance-reporting-table-cell-text-header">Пассив</div>
            </div>
            <div className="finance-reporting-table-cell-content">
              <div className="finance-reporting-table-cell-text">Капитал и резервы</div>
            </div>
            <div className="finance-reporting-table-cell-content">
              <div className="finance-reporting-table-cell-text">Долгосрочные обязательства</div>
            </div>
            <div className="finance-reporting-table-cell-content">
              <div className="finance-reporting-table-cell-text">Краткосрочные обязательства</div>
            </div>
          </div>
          <div className="finance-reporting-table-data-column">
            <div className="finance-reporting-table-data-cell">
              <div className="finance-reporting-table-data-cell-header">
                <div className="finance-reporting-table-data-cell-text finance-reporting-table-data-cell-text-header">Код</div>
              </div>
              <div className="finance-reporting-table-data-cell-content">
                <div className="finance-reporting-table-data-cell-text">1600</div>
              </div>
              <div className="finance-reporting-table-data-cell-content">
                <div className="finance-reporting-table-data-cell-text">1100</div>
              </div>
              <div className="finance-reporting-table-data-cell-content">
                <div className="finance-reporting-table-data-cell-text">1200</div>
              </div>
              <div className="finance-reporting-table-data-cell-header">
                <div className="finance-reporting-table-data-cell-text finance-reporting-table-data-cell-text-header">1700</div>
              </div>
              <div className="finance-reporting-table-data-cell-content">
                <div className="finance-reporting-table-data-cell-text">1300</div>
              </div>
              <div className="finance-reporting-table-data-cell-content">
                <div className="finance-reporting-table-data-cell-text">1400</div>
              </div>
              <div className="finance-reporting-table-data-cell-content">
                <div className="finance-reporting-table-data-cell-text">1500</div>
              </div>
            </div>
            <div className="finance-reporting-table-year-cell">
              <div className="finance-reporting-table-year-cell-header">
                <div className="finance-reporting-table-year-cell-text">2020</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-header">
                <div className="finance-reporting-table-year-cell-text">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
            </div>
            <div className="finance-reporting-table-year-cell">
              <div className="finance-reporting-table-year-cell-header">
                <div className="finance-reporting-table-year-cell-text">2021</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-header">
                <div className="finance-reporting-table-year-cell-text">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
            </div>
            <div className="finance-reporting-table-year-cell">
              <div className="finance-reporting-table-year-cell-header">
                <div className="finance-reporting-table-year-cell-text">2022</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-header">
                <div className="finance-reporting-table-year-cell-text">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
            </div>
            <div className="finance-reporting-table-year-cell">
              <div className="finance-reporting-table-year-cell-header">
                <div className="finance-reporting-table-year-cell-text">2023</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-header">
                <div className="finance-reporting-table-year-cell-text">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
          </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
                </div>
            </div>
            <div className="finance-reporting-table-year-cell">
              <div className="finance-reporting-table-year-cell-header">
                <div className="finance-reporting-table-year-cell-text">2024</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-header">
                <div className="finance-reporting-table-year-cell-text">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
                </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
                  </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
            </div>
          </div>
        </div>
        <div className="finance-expand-button">
          <div className="finance-expand-button-text">Развернуть</div>
        </div>
      </div>

      <div className="finance-reporting-container">
        <div className="finance-reporting-title">Финансовая отчетность</div>
        <div className="finance-reporting-summary">
          <div className="finance-reporting-summary-item">
            <div className="finance-reporting-summary-label">Выручка</div>
            <div className="finance-reporting-summary-value">{formatCurrency(getLatestRevenue())}</div>
          </div>
          <div className="finance-reporting-summary-item">
            <div className="finance-reporting-summary-label">Чистая прибыль (убыток)</div>
            <div className="finance-reporting-summary-value">{formatCurrency(getLatestProfit())}</div>
          </div>
        </div>
        <div className="finance-reporting-table-container">
          <div className="finance-reporting-table-column">
            <div className="finance-reporting-table-cell-header-empty" />
            <div className="finance-reporting-table-cell-content">
              <div className="finance-reporting-table-cell-text">Выручка</div>
            </div>
            <div className="finance-reporting-table-cell-content">
              <div className="finance-reporting-table-cell-text">Чистая прибыль (убыток)</div>
            </div>
          </div>
          <div className="finance-reporting-table-data-column">
            <div className="finance-reporting-table-data-cell">
              <div className="finance-reporting-table-data-cell-header">
                <div className="finance-reporting-table-data-cell-text finance-reporting-table-data-cell-text-header">Код</div>
              </div>
              <div className="finance-reporting-table-data-cell-content">
                <div className="finance-reporting-table-data-cell-text">2110</div>
              </div>
              <div className="finance-reporting-table-data-cell-content">
                <div className="finance-reporting-table-data-cell-text">2400</div>
              </div>
            </div>
            <div className="finance-reporting-table-year-cell">
              <div className="finance-reporting-table-year-cell-header">
                <div className="finance-reporting-table-year-cell-text">2020</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
            </div>
            <div className="finance-reporting-table-year-cell">
              <div className="finance-reporting-table-year-cell-header">
                <div className="finance-reporting-table-year-cell-text">2021</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
            </div>
            <div className="finance-reporting-table-year-cell">
              <div className="finance-reporting-table-year-cell-header">
                <div className="finance-reporting-table-year-cell-text">2022</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
            </div>
            <div className="finance-reporting-table-year-cell">
              <div className="finance-reporting-table-year-cell-header">
                <div className="finance-reporting-table-year-cell-text">2023</div>
          </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
                </div>
            </div>
            <div className="finance-reporting-table-year-cell">
              <div className="finance-reporting-table-year-cell-header">
                <div className="finance-reporting-table-year-cell-text">2024</div>
                </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
                  </div>
              <div className="finance-reporting-table-year-cell-content">
                <div className="finance-reporting-table-year-cell-value">0 ₽</div>
              </div>
            </div>
          </div>
        </div>
        <div className="finance-expand-button">
          <div className="finance-expand-button-text">Развернуть</div>
        </div>
      </div>
    </div>
  )
}