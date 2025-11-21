import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function CapabilitiesPage() {
  return (
    <div className="page-wrapper capabilities-page bg-slate-50">
      <Header />

      <main>
        <section className="cap-hero">
          <div className="cap-container">
            <h1 className="section-heading mb-6">
              <span className="section-heading-primary">Все возможности</span>{' '}
              <span className="section-heading-dark">сервиса</span>
            </h1>
            <div className="capabilities-hero-content">
              <div className="capabilities-hero-title">
                Проверка контрагентов, аналитика<br/>и мониторинг в одном месте
              </div>
              <div className="capabilities-hero-description">
                Получайте достоверные данные из официальных источников, оценивайте риски, финансы<br/>и связи, отслеживайте изменения — чтобы решения были быстрыми и безопасными.
              </div>
              <a href="/search" className="capabilities-hero-button">
                <div className="capabilities-hero-button-text">Проверить контрагента</div>
              </a>
            </div>
          </div>
          <div className="cap-container">
            <div className="cap-hero-image" aria-hidden>
              <Image
                src="/images/lapp.png"
                alt="Business Analysis Dashboard"
                width={1420}
                height={480}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </section>

        <section className="cap-section">
          <div className="cap-container">
            <h2 className="section-title">
              <span className="text-primary">Проверка</span>{' '}<span className="text-dark">и база</span>
            </h2>

            <div className="cap-grid cap-grid-2 mb-8">
              <div className="cap-card cap-card-image" style={{ position: 'relative' }}>
                <div className="w-full h-auto">
                  <Image
                    src="/images/fulldos.svg"
                    alt="Полное досье компании"
                    width={557}
                    height={227}
                    className="w-full h-auto"
                  />
                </div>
                <a 
                  className="cap-btn-primary" 
                  href="/company"
                  style={{ 
                    position: 'absolute',
                    width: '118px', 
                    height: '21px', 
                    top: '151px',
                    right: '473px',
                    zIndex: 10
                  }}
                >
                  Попробовать
                </a>
              </div>

              <div className="cap-card cap-card-image" style={{ position: 'relative' }}>
                <div className="w-full h-auto">
                  <Image
                    src="/images/expr.svg"
                    alt="Экспресс-проверка рисков"
                    width={557}
                    height={227}
                    className="w-full h-auto"
                  />
                </div>
                <a 
                  className="cap-btn-primary" 
                  href="/company"
                  style={{ 
                    position: 'absolute',
                    width: '172px', 
                    height: '21px', 
                    top: '151px',
                    right: '420px',
                    zIndex: 10
                  }}
                >
                  Смотреть финансы
                </a>
              </div>
            </div>

            <div className="capabilities-cards-container">
              <div className="capabilities-card">
                <div className="capabilities-card-content">
                  <div className="capabilities-card-title">Изменения и история</div>
                  <div className="capabilities-card-description">
                    Хронология адресов, руководителей/учредителей, уставного капитала, ОКВЭД и правового статуса. Помогает увидеть стабильность,<br/>и понять контекст «до/после».
                  </div>
                </div>
                <a href="/company" className="capabilities-card-button capabilities-card-button-chronology">
                  <div className="capabilities-card-button-text">Смотреть хронологию</div>
                </a>
              </div>
              <div className="capabilities-card">
                <div className="capabilities-card-content">
                  <div className="capabilities-card-title">Связи</div>
                  <div className="capabilities-card-description">
                    Граф связей, бенефициаров<br/>и холдингов. Находим цепочки «однодневок» и сложные владения, предупреждаем налоговые/комплаенс-риски.
                  </div>
                </div>
                <a href="/company" className="capabilities-card-button capabilities-card-button-connections">
                  <div className="capabilities-card-button-text">Изучить связи</div>
                </a>
              </div>
              <div className="capabilities-card">
                <div className="capabilities-card-content">
                  <div className="capabilities-card-title">Лицензии<br/>и проверки</div>
                  <div className="capabilities-card-description">
                    Показываем действующие лицензии и результаты плановых/внеплановых проверок. Оценка регуляторной чистоты и соответствия виду деятельности.
                  </div>
                </div>
                <a href="/company" className="capabilities-card-button capabilities-card-button-licenses">
                  <div className="capabilities-card-button-text">Проверить лицензии</div>
                </a>
              </div>
              <div className="capabilities-card">
                <div className="capabilities-card-content">
                  <div className="capabilities-card-title">Документы ФНС</div>
                  <div className="capabilities-card-description">
                    Скачивание выписок ЕГРЮЛ/ЕГРИП/МСП и бухотчётности с ЭП ФНС. Готовый пакет для процедур должной осмотрительности и внутреннего комплаенса.
                  </div>
                </div>
                <a href="/company" className="capabilities-card-button capabilities-card-button-extract">
                  <div className="capabilities-card-button-text">Скачать выписку</div>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="cap-section">
          <div className="cap-container">
            <h2 className="section-title text-center">
              <span className="text-primary">Попробуйте</span>{' '}<span className="text-dark">сейчас</span>
            </h2>
            <div className="cap-cta-box">
              <h3 className="cap-cta-title">Поиск контрагента за секунды</h3>
              <p className="cap-cta-text">Введите ИНН, ОГРН, название или точный адрес — получите полную карточку, риск-профиль и историю изменений.<br/>Нужны документы? Скачайте официальные выписки прямо из карточки.</p>
              <div className="cap-cta-container">
                <div className="cap-cta-input-container">
                  <Image 
                    src="/images/Union.svg" 
                    alt="Search icon" 
                    width={18} 
                    height={18} 
                    className="cap-cta-icon-new" 
                  />
                  <div className="cap-cta-hint-new">Название, адрес, ФИО, учредителям, ОГРН и ИНН</div>
                </div>
                <div className="cap-cta-button-container">
                  <div className="cap-cta-button-text-new">Проверить контрагента</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cap-section">
          <div className="cap-container">
            <h2 className="section-title text-center">Деньги и правовая устойчивость</h2>

            <div className="money-section-container">
              <div className="money-section-row">
                <div className="money-section-card money-section-card-small">
                  <Image
                    src="/images/bankstat.svg"
                    alt="Банкротства и статусы"
                    width={553}
                    height={250}
                    className="w-full h-auto"
                  />
                </div>
                <div className="money-section-card money-section-card-large">
                  <Image
                    src="/images/finance.svg"
                    alt="Финансовая аналитика"
                    width={892}
                    height={250}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="money-section-row">
                <div className="money-section-card money-section-card-large">
                  <Image
                    src="/images/sud.svg"
                    alt="Суды и ФССП"
                    width={842}
                    height={250}
                    className="w-full h-auto"
                  />
                </div>
                <div className="money-section-card money-section-card-small">
                  <Image
                    src="/images/gos.svg"
                    alt="Госзакупки и поддержка"
                    width={553}
                    height={250}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cap-section">
          <div className="cap-container">
            <h2 className="section-title text-center">
              <span className="text-dark">Выбор</span>{' '}<span className="text-primary">тарифа</span>
            </h2>
            <div className="cap-cta-box text-center">
              <h3 className="cap-cta-title">Выберите тариф под вашу задачу</h3>
              <p className="cap-cta-text">Начните с базовой проверки или подключите командный доступ и автоматизацию.<br/>Прозрачные условия, быстрый старт, масштабирование по мере роста.</p>
              <a className="cap-btn-primary" href="/tariffs">Выбрать тариф</a>
            </div>
          </div>
        </section>

        <section className="cap-section">
          <div className="container">
            <h2 className="section-title text-center">
              <span className="text-dark">Непрерывный</span>{' '}<span className="text-primary">контроль и интеграции</span>
            </h2>
            <div className="integration-container">
              <div className="integration-left-column">
                <div className="integration-small-card">
                  <Image
                    src="/images/API.svg"
                    alt="API и выгрузки"
                    width={697}
                    height={227}
                    className="w-full h-auto"
                  />
                </div>
                <div className="integration-small-card">
                  <Image
                    src="/images/team.svg"
                    alt="Командный доступ"
                    width={697}
                    height={227}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="integration-large-card">
                <div className="integration-card-content">
                  <div className="integration-card-title">Мониторинг и уведомления</div>
                  <div className="integration-card-description">
                    Подписка на изменения в карточках: новое руководство, смена<br/>адреса, капитал, ОКВЭД, отметки о недостоверности, статусы банкротств и др.
                  </div>
                </div>
                <a href="/notifications" className="integration-card-button">
                  <div className="integration-card-button-text">Подписаться на уведомления</div>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="cap-section">
          <div className="cap-container text-center">
            <h2 className="section-title">
              <span className="text-primary">Будьте в курсе</span>{' '}<span className="text-dark">изменений</span>
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


