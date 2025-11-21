import React from 'react'

export function ReportsSection() {
  return (
    <div className="reports-container">
      <div className="reports-title">Отчеты и документы</div>
      <div className="reports-section-title">Основной комплект документов</div>
      <div className="reports-content">
        <div className="reports-column">
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Сводный отчет</div>
              <div className="reports-item-description">Общие сведения об организации</div>
            </div>
          </div>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Отчет по требованиям ФНС на нужную дату</div>
              <div className="reports-item-description">Для обоснования выбора контрагента</div>
            </div>
          </div>
        </div>
        <div className="reports-column">
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Выписка из ЕГРЮЛ</div>
              <div className="reports-item-description">С подписью ФНС / на нужную дату</div>
            </div>
          </div>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Бухгалтерская отчетность с ЭЦП</div>
              <div className="reports-item-description">Актуальный баланс с ЭЦП ФНС РФ</div>
            </div>
          </div>
        </div>
      </div>
      <div className="reports-section-title">Риски</div>
      <div className="reports-content">
        <div className="reports-column">
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Важные факты деятельности организации</div>
              <div className="reports-item-description">Отчет о рисках (включая Сводный отчет)</div>
            </div>
          </div>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Риск невыполнения обязательств</div>
              <div className="reports-item-description">Оценка вероятности дефолта</div>
            </div>
          </div>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Риск закредитованности</div>
              <div className="reports-item-description">Оценка объёма обязательств</div>
            </div>
          </div>
        </div>
        <div style={{flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'inline-flex'}}>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Кредитный рейтинг</div>
              <div className="reports-item-description">Информация о кредитном состоянии организации</div>
            </div>
          </div>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Риск банкротства</div>
              <div className="reports-item-description">Оценка вероятности банкротства</div>
            </div>
          </div>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Должная осмотрительность</div>
              <div className="reports-item-description">Отчет о рисках по нормативам ФНС</div>
            </div>
          </div>
        </div>
      </div>
      <div className="reports-section-title">Финансы</div>
      <div className="reports-content">
        <div className="reports-column">
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Бухгалтерская отчетность</div>
              <div className="reports-item-description">Баланс на нужную дату</div>
            </div>
          </div>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Финансы</div>
              <div className="reports-item-description">Информация о финансовом положении организации</div>
            </div>
          </div>
        </div>
        <div style={{flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'inline-flex'}}>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Бухгалтерская отчетность с ЭЦП</div>
              <div className="reports-item-description">Актуальный баланс с ЭЦП ФНС РФ</div>
            </div>
          </div>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Вероятность налоговой проверки</div>
              <div className="reports-item-description">Критерии ФНС для налоговой проверки</div>
            </div>
          </div>
        </div>
      </div>
      <div className="reports-section-title">Прочие отчеты</div>
      <div className="reports-content">
        <div className="reports-column">
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Судебные дела</div>
              <div className="reports-item-description">Отчет о судебных делах организации</div>
            </div>
          </div>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Банкротство</div>
              <div className="reports-item-description">Информация о процедуре банкротства</div>
            </div>
          </div>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Существенные факты</div>
              <div className="reports-item-description">Отчёт о существенных фактах</div>
            </div>
          </div>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Признаки хозяйственной деятельности</div>
              <div className="reports-item-description">Признаки хозяйственной деятельности за 12 месяцев</div>
            </div>
          </div>
        </div>
        <div style={{flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'inline-flex'}}>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Исполнительные производства</div>
              <div className="reports-item-description">Отчет об исполнительных производствах (ФССП)</div>
            </div>
          </div>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Лизинговые договора</div>
              <div className="reports-item-description">Отчёт о лизинговых договорах</div>
            </div>
          </div>
          <div className="reports-item">
            <div className="reports-icon" />
            <div className="reports-item-content">
              <div className="reports-item-title">Лицензии</div>
              <div className="reports-item-description">Отчёт о лицензиях</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
