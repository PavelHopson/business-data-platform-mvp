import React from "react";
import { ScraperResponse } from "@/lib/api/scraper";

interface RequisitesSectionProps {
  scraperData?: ScraperResponse | null;
}

export const RequisitesSection: React.FC<RequisitesSectionProps> = ({ scraperData }) => {
  return (
    <div className="company-details-section">
      <div className="company-details-section-title">
        Реквизиты
      </div>
      
      <div className="company-details-subsection-title">
        Основные
      </div>
      
      <div className="company-details-two-columns">
        <div className="company-details-column">
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              Полное название:
            </div>
            <div className="company-details-field-value-blue">
              {scraperData && scraperData.success ? scraperData.data.company_name : 'Данные не найдены'}
            </div>
          </div>
          
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              Уставный капитал:
            </div>
            <div className="company-details-field-value">
              {scraperData && scraperData.success && scraperData.data.authorized_capital ? 
                `${scraperData.data.authorized_capital.toLocaleString()} ₽` : 
                'Данные не найдены'
              }
            </div>
          </div>
          
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              Руководитель:
            </div>
            <div style={{
              alignSelf: 'stretch',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <span style={{
                color: '#2563EB',
                fontSize: 16,
                fontFamily: 'Rubik',
                fontWeight: '400',
                lineHeight: '18.40px',
                wordWrap: 'break-word'
              }}>
                {scraperData && scraperData.success ? scraperData.data.general_director : 'Данные не найдены'}
              </span>
              <span style={{
                color: '#64748B',
                fontSize: 16,
                fontFamily: 'Rubik',
                fontWeight: '300',
                lineHeight: '18.40px',
                wordWrap: 'break-word'
              }}>
              </span>
            </div>
            </div>
          
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              Учредители:
            </div>
            <div style={{
              alignSelf: 'stretch',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <span style={{
                color: '#2563EB',
                fontSize: 16,
                fontFamily: 'Rubik',
                fontWeight: '400',
                lineHeight: '18.40px',
                wordWrap: 'break-word'
              }}>
                {scraperData && scraperData.success && scraperData.data.founders && scraperData.data.founders.length > 0 ? 
                  scraperData.data.founders.join(', ') : 
                  'Данные не найдены'
                }
              </span>
              <span style={{
                color: '#64748B',
                fontSize: 16,
                fontFamily: 'Rubik',
                fontWeight: '300',
                lineHeight: '18.40px',
                wordWrap: 'break-word'
              }}>
              </span>
            </div>
            </div>
          
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              Форма:
            </div>
            <div className="company-details-field-value">
              {scraperData && scraperData.success && scraperData.data.company_form ? 
                scraperData.data.company_form : 
                'Данные не найдены'
              }
            </div>
          </div>
        </div>
        
        <div className="company-details-column">
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              Дата регистрации:
            </div>
            <div className="company-details-field-value">
              {scraperData && scraperData.success && scraperData.data.registration_date ? 
                scraperData.data.registration_date : 
                'Данные не найдены'
              }
            </div>
          </div>
          
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              Юридический адрес:
            </div>
            <div className="company-details-field-value">
              {scraperData && scraperData.success && scraperData.data.legal_address ? 
                scraperData.data.legal_address : 
                'Данные не найдены'
              }
            </div>
          </div>
          
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              ИНН:
            </div>
            <div className="company-details-field-value">
              {scraperData && scraperData.success ? scraperData.data.inn : 'Данные не найдены'}
            </div>
          </div>
          
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              ОГРН:
            </div>
            <div style={{
              alignSelf: 'stretch',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <span style={{
                color: '#141414',
                fontSize: 16,
                fontFamily: 'Rubik',
                fontWeight: '300',
                lineHeight: '18.40px',
                wordWrap: 'break-word'
              }}>
                {scraperData && scraperData.success ? scraperData.data.ogrn : 'Данные не найдены'}{' '}
              </span>
              <span style={{
                color: '#64748B',
                fontSize: 16,
                fontFamily: 'Rubik',
                fontWeight: '300',
                lineHeight: '18.40px',
                wordWrap: 'break-word'
              }}>
                (от 26 декабря 2011)
              </span>
            </div>
            </div>
          
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              КПП:
            </div>
            <div className="company-details-field-value">
              {scraperData && scraperData.success && scraperData.data.kpp ? 
                scraperData.data.kpp : 
                'Данные не найдены'
              }
            </div>
          </div>
        </div>
      </div>
      
      <div className="company-details-subsection-title">
        Регистрация ФНС
      </div>
      
      <div className="company-details-column">
        <div className="company-details-field-group">
          <div className="company-details-field-label">
            Дата регистрации:
          </div>
          <div className="company-details-field-value">
            {scraperData && scraperData.success && scraperData.data.registration_date ? 
              scraperData.data.registration_date : 
              'Данные не найдены'
            }
          </div>
        </div>
        
        <div className="company-details-field-group">
          <div className="company-details-field-label">
            Налоговая:
          </div>
          <div className="company-details-field-value">
            {scraperData && scraperData.success && scraperData.data.tax_authority ? 
              scraperData.data.tax_authority : 
              'Данные не найдены'
            }
          </div>
        </div>
        
        <div className="company-details-field-group">
          <div className="company-details-field-label">
            Адрес налоговой:
          </div>
          <div className="company-details-field-value">
            {scraperData && scraperData.success && scraperData.data.tax_authority_address ? 
              scraperData.data.tax_authority_address : 
              'Данные не найдены'
            }
          </div>
        </div>
      </div>
      
      <div className="company-details-subsection-title">
        Внебюджетные фонды
      </div>
      
      <div className="company-details-two-columns">
        <div className="company-details-column">
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              Регистрационный номер в ПФР:
            </div>
            <div className="company-details-field-value">
              {scraperData && scraperData.success && scraperData.data.pfr_registration_number ? 
                scraperData.data.pfr_registration_number : 
                'Данные не найдены'}
            </div>
          </div>
          
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              Дата регистрации:
            </div>
            <div className="company-details-field-value">
              {scraperData && scraperData.success && scraperData.data.pfr_registration_date ? 
                scraperData.data.pfr_registration_date : 
                'Данные не найдены'}
            </div>
          </div>
          
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              Наименование территориального органа:
            </div>
            <div className="company-details-field-value">
              {scraperData && scraperData.success && scraperData.data.pfr_territorial_authority ? 
                scraperData.data.pfr_territorial_authority : 
                'Данные не найдены'}
            </div>
          </div>
        </div>
        
        <div className="company-details-column">
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              Регистрационный номер ФССРФ:
            </div>
            <div className="company-details-field-value">
              {scraperData && scraperData.success && scraperData.data.fss_registration_number ? 
                scraperData.data.fss_registration_number : 
                'Данные не найдены'}
            </div>
          </div>
          
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              Дата регистрации:
            </div>
            <div className="company-details-field-value">
              {scraperData && scraperData.success && scraperData.data.fss_registration_date ? 
                scraperData.data.fss_registration_date : 
                'Данные не найдены'}
            </div>
          </div>
          
          <div className="company-details-field-group">
            <div className="company-details-field-label">
              Наименование территориального органа:
            </div>
            <div className="company-details-field-value">
              {scraperData && scraperData.success && scraperData.data.fss_territorial_authority ? 
                scraperData.data.fss_territorial_authority : 
                'Данные не найдены'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="company-details-field-value-blue" style={{ textAlign: 'center', cursor: 'pointer' }}>
        Все реквизиты подробно
      </div>
    </div>
  );
};