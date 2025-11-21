import React from 'react'
import { ScraperResponse } from '@/lib/api/scraper'

interface RequisitesDetailsSectionProps {
  scraperData: ScraperResponse | null
}

export function RequisitesDetailsSection({ scraperData }: RequisitesDetailsSectionProps) {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start'}}>
      <div className="tab-content-container">
        <div className="tab-content-card">
          <div className="tab-section-title">Реквизиты</div>
          
          <div className="tab-subsection-title">Основные</div>
          <div className="tab-two-columns">
            <div className="tab-column">
              <div className="tab-field-group">
                <div className="tab-field-label">ОГРН:</div>
                <div className="tab-field-value">{scraperData?.data?.ogrn || 'Не указано'}</div>
              </div>
              <div className="tab-field-group">
                <div className="tab-field-label">Дата присвоения ОГРН:</div>
                <div className="tab-field-value">{scraperData?.data?.registration_date || 'Данные не найдены'}</div>
              </div>
              <div className="tab-field-group">
                <div className="tab-field-label">Регистратор:</div>
                <div className="tab-field-value">Данные не найдены</div>
              </div>
              <div className="tab-field-group">
                <div className="tab-field-label">ИНН:</div>
                <div className="tab-field-value">{scraperData?.data?.inn || 'Не указано'}</div>
              </div>
            </div>
            <div className="tab-column">
              <div className="tab-field-group">
                <div className="tab-field-label">КПП:</div>
                <div className="tab-field-value">{scraperData?.data?.kpp || 'Данные не найдены'}</div>
              </div>
              <div className="tab-field-group">
                <div className="tab-field-label">Налоговый орган: </div>
                <div className="tab-field-value">{scraperData?.data?.tax_authority || 'Данные не найдены'}</div>
              </div>
              <div className="tab-field-group">
                <div className="tab-field-label">Дата постановки на учет:</div>
                <div className="tab-field-value">{scraperData?.data?.registration_date || 'Данные не найдены'}</div>
              </div>
            </div>
          </div>

          <div className="tab-subsection-title">Коды статистики</div>
          <div className="tab-two-columns">
            <div className="tab-column">
              <div className="tab-field-group">
                <div className="tab-field-label">ОКПО:</div>
                <div className="tab-field-value">Данные не найдены</div>
              </div>
              <div className="tab-field-group">
                <div className="tab-field-label">ОКТМО:</div>
                <div className="tab-field-value">Данные не найдены</div>
              </div>
              <div className="tab-field-group">
                <div className="tab-field-label">ОКАТО:</div>
                <div className="tab-field-value">Данные не найдены</div>
              </div>
            </div>
            <div className="tab-column">
              <div className="tab-field-group">
                <div className="tab-field-label">ОКОГУ:</div>
                <div className="tab-field-value">Данные не найдены</div>
              </div>
              <div className="tab-field-group">
                <div className="tab-field-label">ОКОПФ:</div>
                <div className="tab-field-value">Данные не найдены</div>
              </div>
              <div className="tab-field-group">
                <div className="tab-field-label">ОКФС:</div>
                <div className="tab-field-value">Данные не найдены</div>
              </div>
            </div>
          </div>

          <div className="tab-subsection-title">Сведения о регистрации в ФНС</div>
          <div className="tab-single-column">
            <div className="tab-field-group">
              <div className="tab-field-label">ОГРН:</div>
              <div className="tab-field-value">{scraperData?.data?.ogrn || 'Данные не найдены'}</div>
            </div>
            <div className="tab-field-group">
              <div className="tab-field-label">Дата регистрации:</div>
              <div className="tab-field-value">{scraperData?.data?.registration_date || 'Данные не найдены'}</div>
            </div>
            <div className="tab-field-group">
              <div className="tab-field-label">Наименование территориального органа:</div>
              <div className="tab-field-value">{scraperData?.data?.tax_authority || 'Данные не найдены'}</div>
            </div>
          </div>

          <div className="tab-subsection-title">Сведения о регистрации в ФСС</div>
          <div className="tab-single-column">
            <div className="tab-field-group">
              <div className="tab-field-label">Регистрационный номер:</div>
              <div className="tab-field-value">{scraperData?.data?.fss_registration_number || 'Данные не найдены'}</div>
            </div>
            <div className="tab-field-group">
              <div className="tab-field-label">Дата регистрации:</div>
              <div className="tab-field-value">{scraperData?.data?.fss_registration_date || 'Данные не найдены'}</div>
            </div>
            <div className="tab-field-group">
              <div className="tab-field-label">Наименование территориального органа:</div>
              <div className="tab-field-value">{scraperData?.data?.fss_territorial_authority || 'Данные не найдены'}</div>
            </div>
          </div>

          <div className="tab-subsection-title">Сведения о регистрации в ПФР</div>
          <div className="tab-single-column">
            <div className="tab-field-group">
              <div className="tab-field-label">Регистрационный номер:</div>
              <div className="tab-field-value">{scraperData?.data?.pfr_registration_number || 'Данные не найдены'}</div>
            </div>
            <div className="tab-field-group">
              <div className="tab-field-label">Дата регистрации:</div>
              <div className="tab-field-value">{scraperData?.data?.pfr_registration_date || 'Данные не найдены'}</div>
            </div>
            <div className="tab-field-group">
              <div className="tab-field-label">Наименование территориального органа:</div>
              <div className="tab-field-value">{scraperData?.data?.pfr_territorial_authority || 'Данные не найдены'}</div>
            </div>
          </div>

          <div className="tab-subsection-title">Сведения МСП</div>
          <div className="tab-single-column">
            <div className="tab-field-group">
              <div className="tab-field-label">Дата включения:</div>
              <div className="tab-field-value">Данные не найдены</div>
            </div>
            <div className="tab-field-group">
              <div className="tab-field-label">Категория субъекта:</div>
              <div className="tab-field-value">Данные не найдены</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{width: 1420, padding: 25, background: 'white', overflow: 'hidden', borderRadius: 5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, display: 'inline-flex', marginLeft: '20px'}}>
        <div style={{
          alignSelf: 'stretch',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          color: '#141414',
          fontSize: 32,
          fontFamily: 'Rubik',
          fontWeight: 500,
          lineHeight: 'normal',
          wordWrap: 'break-word'
        }}>
          Для договора
        </div>
        <div
          style={{
            alignSelf: 'stretch',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            color: '#141414',
            fontSize: 16,
            fontFamily: 'Rubik',
            fontWeight: 300,
            lineHeight: 'normal',
            wordWrap: 'break-word',
            whiteSpace: 'pre-line'
          }}
        >
          {scraperData?.data?.company_name || 'Название компании не указано'}{'\n'}
          Юридический адрес: {scraperData?.data?.legal_address || 'Адрес не указан'}{'\n'}
          ОГРН {scraperData?.data?.ogrn || 'Не указано'}{'\n'}
          ИНН {scraperData?.data?.inn || 'Не указано'}{'\n'}
          КПП {scraperData?.data?.kpp || 'Не указано'}{'\n'}
          ОКВЭД {scraperData?.data?.activity?.code || 'Не указано'}{'\n'}
          {'\n'}
          Генеральный Директор{'\n'}
          {'\n'}
          __________________ / {scraperData?.data?.general_director || 'Не указано'} /{'\n'}
          {'      '}М.П.
        </div>
        <div style={{paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10, background: '#2563EB', overflow: 'hidden', borderRadius: 5, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'flex'}}>
          <div style={{textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 16, fontFamily: 'Rubik', fontWeight: '500', lineHeight: 'normal', wordWrap: 'break-word'}}>Скопировать</div>
        </div>
      </div>
    </div>
  )
}
