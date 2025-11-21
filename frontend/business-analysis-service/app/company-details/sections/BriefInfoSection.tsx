import React from "react";
import { ScraperResponse } from "@/lib/api/scraper";

interface BriefInfoSectionProps {
  scraperData?: ScraperResponse | null;
}

export const BriefInfoSection: React.FC<BriefInfoSectionProps> = ({ scraperData }) => {
  return (
    <div className="activities-container brief-info-positioned">
      <div className="brief-info-container">
        <div className="brief-info-title">Краткая справка</div>
        
        <div className="brief-info-content">
          {scraperData && scraperData.success ? (
            <>
              <div className="brief-info-text">
                {scraperData.data.company_name} ИНН {scraperData.data.inn}, ОГРН {scraperData.data.ogrn}. 
                {scraperData.data.employees_count ? ` В организации числится ${scraperData.data.employees_count} сотрудников.` : ''}
                {scraperData.data.activity.desc ? ` Основным направлением деятельности является "${scraperData.data.activity.desc}".` : ''}
              </div>
              
              <div className="brief-info-text">
                Руководителем организации является: {scraperData.data.general_director}.
                {scraperData.data.founders && scraperData.data.founders.length > 0 ? ` У организации ${scraperData.data.founders.length} учредителей.` : ''}
              </div>
              
              <div className="brief-info-text">
                {scraperData.data.contacts && scraperData.data.contacts.phone ? `Контакты (телефон): ${scraperData.data.contacts.phone}.` : 'Контакты (телефон) - не указан.'}
                {scraperData.data.contacts && scraperData.data.contacts.email ? ` E-mail: ${scraperData.data.contacts.email}.` : ' E-mail - не указан.'}
                {scraperData.data.contacts && scraperData.data.contacts.website ? ` Сайт: ${scraperData.data.contacts.website}.` : ' Сайт - не указан.'}
              </div>
            </>
          ) : (
            <div className="brief-info-text">
              Данные о компании не найдены. Попробуйте ввести ИНН для получения актуальной информации.
            </div>
          )}
        </div>
      </div>

      <div className="brief-info-container">
        <div className="brief-info-title">
          Надёжность
        </div>
        
        <div className="reliability-description-text">
          Выявлены 22 факта об организации:
        </div>
        
        <div className="reliability-stats-container">
          <div className="reliability-stat-item reliability-stat-item-positive">
            <div className="reliability-stat-label">
              Положительные
            </div>
            <div className="reliability-stat-value">
              13
            </div>
          </div>
          
          <div className="reliability-stat-item reliability-stat-item-warning">
            <div className="reliability-stat-label">
              Требуют внимания
            </div>
            <div className="reliability-stat-value">
              6
            </div>
          </div>
          
          <div className="reliability-stat-item reliability-stat-item-negative">
            <div className="reliability-stat-label">
              Отрицательные
            </div>
            <div className="reliability-stat-value">
              3
            </div>
          </div>
        </div>
        
        <div className="reliability-more-link">
          Подробнее
        </div>
      </div>

      <div className="changes-section-container">
        <div className="changes-section-title">
          Последние изменения
        </div>
        
        <div className="changes-list-container">
          <div className="changes-date">
            10 июля 2024
          </div>
          <div className="changes-item-container">
            <div className="changes-description">
              Добавлен новый код ОКВЭД &quot;56.10 Деятельность ресторанов и услуги по доставке продуктов питания 2014&quot;
            </div>
            <div className="changes-more-link">
              Ещё...
            </div>
          </div>
        </div>
        
        <div className="changes-divider"></div>
        
        <div className="changes-list-container">
          <div className="changes-date">
            10 июля 2024
          </div>
          <div className="changes-item-container">
            <div className="changes-description">
              Основной код ОКВЭД изменился на &quot;56.10 Деятельность ресторанов и услуги по доставке продуктов питания 2014&quot;
            </div>
            <div className="changes-more-link">
              Ещё...
            </div>
          </div>
        </div>
        
        <div className="changes-divider"></div>
        
        <div className="changes-list-container">
          <div className="changes-date">
            10 июля 2024
          </div>
          <div className="changes-item-container">
            <div className="changes-description">
              Код ОКВЭД &quot;10.71 Производство хлеба и мучных кондитерских изделий, тортов и пирожных недлительного хранения 2014&quot; удален
            </div>
            <div className="changes-more-link">
              Ещё...
            </div>
          </div>
        </div>
        
        <div className="changes-all-link">
          Все события
        </div>
      </div>

      <div className="documents-section-container">
        <div className="documents-section-title">
          Документы и отчёты
        </div>
        
        <div className="documents-list-container">
          <div className="document-item">
            <div className="document-icon" />
            <div className="document-content">
              <div className="document-title">
                Сводный отчет
              </div>
              <div className="document-description">
                Общие сведения об организации
              </div>
            </div>
          </div>
          
          <div className="document-item">
            <div className="document-icon" />
            <div className="document-content">
              <div className="document-title">
                Отчет по требованиям ФНС на нужную дату
              </div>
              <div className="document-description">
                Для обоснования выбора контрагента
              </div>
            </div>
          </div>
          
          <div className="document-item">
            <div className="document-icon" />
            <div className="document-content">
              <div className="document-title">
                Бухгалтерская отчетность с ЭЦП
              </div>
              <div className="document-description">
                Актуальный баланс с ЭЦП ФНС РФ
              </div>
            </div>
          </div>
        </div>
        
        <div className="documents-all-link">
          Все отчеты и документы
        </div>
      </div>

      <div className="registries-section-container">
        <div className="registries-section-title">
          Сведения об участии в реестрах
        </div>
        
        <div className="registries-list-container">
          <div className="registry-item">
            <div className="registry-label">
              Реестр о банкротстве
            </div>
            <div className="registry-value">
              Не числится
            </div>
          </div>
          
          <div className="registry-item">
            <div className="registry-label">
              Реестр террористов и экстремистов
            </div>
            <div className="registry-value">
              Не числится
            </div>
          </div>
          
          <div className="registry-item">
            <div className="registry-label">
              Реестр иноагентов
            </div>
            <div className="registry-value">
              Не числится
            </div>
          </div>
          
          <div className="registry-item">
            <div className="registry-label">
              Реестр недобросовестных поставщиков
            </div>
            <div className="registry-value">
              Не числится
            </div>
          </div>
          
          <div className="registry-item">
            <div className="registry-label">
              Реестр дисквалифицированных лиц
            </div>
            <div className="registry-value">
              Не числится
            </div>
          </div>
          
          <div className="registry-item">
            <div className="registry-label">
              Массовое руководство/учредительство
            </div>
            <div className="registry-value">
              Не числится
            </div>
          </div>
          
          <div className="registry-item">
            <div className="registry-label">
              Реестр получателей поддержки
            </div>
            <div className="registry-value">
              Не числится
            </div>
          </div>
          
          <div className="registry-item">
            <div className="registry-label">
              Реестр субъектов МСП
            </div>
            <div className="registry-value">
              Не числится
            </div>
          </div>
          
          <div className="registry-item">
            <div className="registry-label">
              Стоп-листы банков
            </div>
            <div className="registry-value">
              Не числится
            </div>
          </div>
          
          <div className="registry-item">
            <div className="registry-label">
              Реестры МФО, ломбардов, платежных приложений
            </div>
            <div className="registry-value">
              Не числится
            </div>
          </div>
          
          <div className="registry-item">
            <div className="registry-label">
              Связь с коррупцией
            </div>
            <div className="registry-value">
              Не выявлено
            </div>
          </div>
        </div>
      </div>

      <div className="fns-section-container">
        <div className="fns-section-title">
          Сведения от ФНС
        </div>
        
        <div className="fns-list-container">
          <div className="fns-item">
            <div className="fns-label">
              Нарушение сроков сдачи отчетности
            </div>
            <div className="fns-value">
              Сведения отсутствуют
            </div>
          </div>
          
          <div className="fns-item">
            <div className="fns-label">
              Наличие налоговой задолженности
            </div>
            <div className="fns-value">
              Сведения отсутствуют
            </div>
          </div>
          
          <div className="fns-item">
            <div className="fns-label">
              Достоверность сведений о руководителе
            </div>
            <div className="fns-value">
              Подтверждена
            </div>
          </div>
          
          <div className="fns-item">
            <div className="fns-label">
              Достоверность сведений об учредителе
            </div>
            <div className="fns-value">
              Подтверждена
            </div>
          </div>
          
          <div className="fns-item">
            <div className="fns-label">
              Отсутствие связи по юридическому адресу
            </div>
            <div className="fns-value">
              Не выявлено
            </div>
          </div>
          
          <div className="fns-item">
            <div className="fns-label">
              Достоверность юридического адреса
            </div>
            <div className="fns-value">
              Подтверждена
            </div>
          </div>
          
          <div className="fns-item">
            <div className="fns-label">
              Блокировка расчетных счетов
            </div>
            <div className="fns-value">
              Сведения отсутствуют
            </div>
          </div>
          
          <div className="fns-item">
            <div className="fns-label">
              Наличие обеспечительных мер
            </div>
            <div className="fns-value">
              Сведения отсутствуют
            </div>
          </div>
          
          <div className="fns-item">
            <div className="fns-label">
              Подача документов на изменения в ЕГРЮЛ
            </div>
            <div className="fns-value">
              Сведения отсутствуют
            </div>
          </div>
        </div>
      </div>

      <div className="sanctions-section-container">
        <div className="sanctions-section-title">
          Сведения о наличии санкционных рисков
        </div>
        
        <div className="sanctions-list-container">
          <div className="sanctions-item">
            <div className="sanctions-label">
              Включение в санкционные перечни
            </div>
            <div className="sanctions-value">
              Сведения отсутствуют
            </div>
          </div>
          
          <div className="sanctions-item">
            <div className="sanctions-label">
              Участие юрлиц, находящихся под санкциями
            </div>
            <div className="sanctions-value">
              Не выявлено
            </div>
          </div>
          
          <div className="sanctions-item">
            <div className="sanctions-label">
              Наличие филиалов и представительств за рубежом
            </div>
            <div className="sanctions-value">
              Не выявлено
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
