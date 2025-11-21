'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function PersonCheckPage() {
  return (
    <div className="page-wrapper person-check-page bg-slate-50">
      <Header />

      <main className="person-check-page-container">
        {/* Заголовок */}
        <section className="cap-section">
          <div className="cap-container">
            <h2 className="person-check-title-container">
              <span className="person-check-title-part1">Тариф &quot;Профи&quot;<br/>+ расширенная </span>
              <span className="person-check-title-part2">проверка физлиц</span>
          </h2>
        </div>
        </section>

        {/* Тариф */}
        <section className="cap-section">
          <div className="cap-container">
            <div className="person-check-tariff-container">
              <div className="person-check-tariff-left">
                <div className="person-check-tariff-content">
                  <div className="person-check-tariff-title">Профи + расширенная проверка физлиц</div>
                  <div className="tariff-price">
                  <span className="text-dark">От </span>
                  <span className="text-primary">1890 ₽</span>
                  <span className="text-dark"> / мес.</span>
                  </div>
                </div>
                <div className="person-check-tariff-actions">
                  <a href="/tariffs" className="person-check-tariff-button">
                    <div className="person-check-tariff-button-text">Выбрать</div>
                  </a>
                  <div className="person-check-tariff-disclaimer">Нажимая на кнопку Выбрать, я даю своё согласие на обработку персональных данных</div>
                </div>
              </div>
              
              <div className="person-check-tariff-right">
                <div className="person-check-tariff-section-title">Что входит в тариф?</div>
          
                <div className="person-check-tariff-features">
                  <div className="person-check-tariff-feature-item">
                    <div className="person-check-tariff-feature-dot"></div>
                    <div className="person-check-tariff-feature-text">
                      <span className="person-check-tariff-feature-text-normal">Все возможности </span>
                      <span className="person-check-tariff-feature-text-blue">тарифа &quot;Профи&quot;</span>
                
  
                    </div>
                  </div>
                  <div className="person-check-tariff-feature-item">
                    <div className="person-check-tariff-feature-dot"></div>
                    <div className="person-check-tariff-feature-text">
                      <span className="person-check-tariff-feature-text-normal">10 расширенных отчётов на физлиц в месяц. </span>
                      <span className="person-check-tariff-feature-text-blue">Пример отчёта</span>
                    </div>
                  </div>
                 
              </div>

                <div className="person-check-tariff-subtitle">Что вы найдёте в отчёте:</div>
                
                <div className="person-check-tariff-columns">
                  <div className="person-check-tariff-column">
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Действительность паспорта</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Нахождение в розыске МВД, ФСИН</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Включение в список террористов и экстремистов</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Сведения о банкротстве</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Суды общей юрисдикции (административные, уголовные, гражданские дела)</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Арбитражные дела</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Блокировка счетов по требованию ФНС</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Долги у судебных приставов</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Действительность ИНН</div>
                    </div>
              </div>

                  <div className="person-check-tariff-column">
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Статус иностранного агента</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Арест имущества, запрет на регистрационные действия и другие обеспечительные меры</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Имущество в залоге</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Регистрация в качестве ИП или самозанятого</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Сведения об управляемых организациях</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Запрет на управление организациями</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Признак &quot;Массовый руководитель&quot;</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Признак &quot;Массовый учредитель&quot;</div>
                    </div>
                    <div className="person-check-tariff-feature-item">
                      <div className="person-check-tariff-feature-dot"></div>
                      <div className="person-check-tariff-feature-text">Недостоверность сведений об участии в организациях</div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
        </section>

        {/* Для чего нужен отчет */}
        <section className="cap-section">
          <div className="cap-container">
            <h2 className="person-check-purpose-title">
              <span className="person-check-purpose-blue">Для чего </span>
              <span className="person-check-purpose-dark">нужен отчет?</span>
            </h2>
          </div>
        </section>

        {/* Кейсы использования */}
        <section className="cap-section">
          <div className="cap-container">
            <div className="person-check-cases-container">
              <div className="person-check-tabs">
                <div className="person-check-tab-active">Бизнесу</div>
                <div className="person-check-tab">Частным лица</div>
              </div>

              <div className="person-check-cases-grid">
                <div className="person-check-case-card">
                  <div className="person-check-case-title">Когда вы заключаете сделку<br/>с самозанятым или ИП</div>
                  <div className="person-check-case-description">Контрагент с долгами и судебными исками<br/>от прошлых заказчиков может оказаться мошенником –<br/>взять предоплату и не исполнить взятые на себя обязательства.</div>
                </div>
                <div className="person-check-case-card-large">
                  <Image 
                    src="/images/when.svg" 
                    alt="Когда нанимаете сотрудника на работу" 
                    width={842} 
                    height={250}
                    className="person-check-case-image"
                  />
                  <div className="person-check-case-overlay">
                  </div>
                </div>
              </div>

              <div className="person-check-cases-grid">
                <div className="person-check-case-card-large">
                  <Image 
                    src="/images/whenb.svg" 
                    alt="Когда работаете с новым бизнес‑партнером" 
                    width={842} 
                    height={250}
                    className="person-check-case-image"
                  />
                  <div className="person-check-case-overlay">
                  </div>
                </div>
                <div className="person-check-case-card">
                  <div className="person-check-case-title">Когда предоставляете займ<br/>или рассрочку покупателю</div>
                  <div className="person-check-case-description">Наличие у кредитора задолженности перед<br/>судебными приставами или заблокированных счетов,<br/>а также статус банкрота повышают риск невозврата долга.</div>
                </div>
              </div>
          </div>
        </div>
        </section>

        {/* Как это работает */}
        <section className="cap-section">
          <div className="cap-container">
            <div className="person-check-how-title">
              <span className="person-check-how-blue">Как </span>
              <span className="person-check-how-dark">это работает?</span>
            </div>
          </div>
        </section>

        {/* Шаги работы */}
        <section className="cap-section">
          <div className="cap-container">
            <div className="person-check-steps-container">
              <div className="person-check-step-card">
                <div className="person-check-step-header">
                  <div className="person-check-step-number">
                    <div className="person-check-step-number-text">1</div>
                  </div>
                  <div className="person-check-step-title">Подключите подписку</div>
                </div>
                <div className="person-check-step-description">
                  <div className="person-check-step-description-text">Оформите доступ к сервису, чтобы получать данные<br/>из государственных источников.</div>
                </div>
              </div>
              
              <div className="person-check-step-card">
                <div className="person-check-step-header">
                  <div className="person-check-step-number">
                    <div className="person-check-step-number-text">2</div>
                  </div>
                  <div className="person-check-step-title">Выберите физлицо</div>
                </div>
                <div className="person-check-step-description">
                  <div className="person-check-step-description-text">Введите данные физлица — паспорт, ИНН, ФИО. Система автоматически проверит их по десяткам баз.</div>
                </div>
              </div>

              <div className="person-check-step-card">
                <div className="person-check-step-header">
                  <div className="person-check-step-number">
                    <div className="person-check-step-number-text">3</div>
                  </div>
                  <div className="person-check-step-title">Отправьте заявку<br/>на проверку</div>
                </div>
                <div className="person-check-step-description">
                  <div className="person-check-step-description-text">Сформируйте запрос<br/>одним кликом. Проверка запускается сразу, никаких лишних действий.</div>
                </div>
              </div>

              <div className="person-check-step-card">
                <div className="person-check-step-header">
                  <div className="person-check-step-number">
                    <div className="person-check-step-number-text">4</div>
                  </div>
                  <div className="person-check-step-title">Через 10 минут отчёт<br/>придёт на почту</div>
                </div>
                <div className="person-check-step-description">
                  <div className="person-check-step-description-text">Вы получите готовый отчёт: действительность паспорта, наличие долгов, суды, аресты имущества и др.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Источники данных */}
        <section className="cap-section">
          <div className="cap-container">
            <h2 className="person-check-sources-title">
              <span className="person-check-sources-blue">Источники </span>{' '}<span className="person-check-sources-dark">данных</span>
            </h2>
          </div>
        </section>

        {/* Сетка источников */}
        <section className="cap-section">
          <div className="cap-container">
            <div className="person-check-sources-container">
              <div className="person-check-sources-grid">
                <div className="person-check-source-card">
                  <Image src="/images/1.png" alt="Картотека арбитражных дел" width={54} height={52} className="person-check-source-icon" />
                  <div className="person-check-source-text">Картотека арбитражных дел</div>
                </div>
                <div className="person-check-source-card">
                  <Image src="/images/2.png" alt="База Росфинмониторинга" width={55} height={52} className="person-check-source-icon" />
                  <div className="person-check-source-text">База Росфинмониторинга</div>
                </div>
                <div className="person-check-source-card">
                  <Image src="/images/3.png" alt="База недействительных паспортов МВД" width={54} height={52} className="person-check-source-icon" />
                  <div className="person-check-source-text">База недействительных паспортов МВД</div>
                </div>
                <div className="person-check-source-card">
                  <Image src="/images/4.png" alt="Федеральная служба судебных приставов" width={55} height={52} className="person-check-source-icon" />
                  <div className="person-check-source-text">Федеральная служба судебных приставов</div>
                </div>
              </div>

              <div className="person-check-sources-grid">
                <div className="person-check-source-card">
                  <Image src="/images/5.png" alt="Федеральная нотариальная палата" width={54} height={52} className="person-check-source-icon" />
                  <div className="person-check-source-text">Федеральная нотариальная палата</div>
                </div>
                <div className="person-check-source-card">
                  <Image src="/images/6.png" alt="База розыска МВД" width={54} height={52} className="person-check-source-icon" />
                  <div className="person-check-source-text">База розыска МВД</div>
                </div>
                <div className="person-check-source-card">
                  <Image src="/images/7.png" alt="База ГИБДД" width={55} height={52} className="person-check-source-icon" />
                  <div className="person-check-source-text">База ГИБДД</div>
                </div>
                <div className="person-check-source-card">
                  <Image src="/images/8.png" alt="Федеральная налоговая служба" width={55} height={52} className="person-check-source-icon" />
                  <div className="person-check-source-text">Федеральная налоговая служба</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA секция */}
        <section className="cap-section">
          <div className="cap-container text-center">
            <h2 className="section-title">
              <span className="text-primary">Будьте в курсе</span> <span className="text-dark">изменений</span>
            </h2>
            <div className="cap-cta-box">
              <h3 className="cap-cta-title">Получайте уведомления<br/>о важных событиях в компаниях:</h3>
              <p className="cap-cta-text">Смена руководства, новые судебные дела, банкротство.<br/>Вся история обновлений хранится в личном кабинете.</p>
              <a className="cap-btn-primary" href="/register">Попробовать бесплатно</a>
              <p className="cap-terms">Нажимая на кнопку Попробовать бесплатно,<br/>я даю своё согласие на обработку персональных данных</p>
          </div>
        </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
