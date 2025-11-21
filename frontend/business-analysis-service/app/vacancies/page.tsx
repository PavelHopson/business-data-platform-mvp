'use client';

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { useState } from 'react'

export default function VacanciesPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0])) // Первый элемент открыт по умолчанию
  const [showVacancyDetail, setShowVacancyDetail] = useState(false)
  
  const toggleFAQ = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  // Функция для открытия/закрытия всех элементов
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleAll = () => {
    const itemsCount = 5 // Количество FAQ элементов
    if (openItems.size === itemsCount) {
      // Если все открыты - закрываем все
      setOpenItems(new Set())
    } else {
      // Иначе открываем все
      setOpenItems(new Set([0, 1, 2, 3, 4]))
    }
  }

  if (showVacancyDetail) {
    return (
      <div className="page-wrapper bg-slate-50">
        <Header />
        <main>
          <section className="vacancy-detail-section">
            <div className="cap-container">
              <div className="vacancy-detail-card">
                <div className="vacancy-detail-header">
                  <div className="vacancy-detail-title">Менеджер по развитию банковского направления</div>
                  <div className="vacancy-detail-salary-container">
                    <span className="vacancy-detail-salary-text">до&nbsp;</span>
                    <span className="vacancy-detail-salary-value">70 000 ₽</span>
                  </div>
                </div>
                
                <div className="vacancy-detail-tags">
                  <div className="vacancy-detail-tag">Москва</div>
                  <div className="vacancy-detail-tag">Полный день</div>
                  <div className="vacancy-detail-tag">Опыт работы от 3 лет</div>
                  <div className="vacancy-detail-tag">Полная занятость</div>
                </div>

                <div className="vacancy-detail-section-block">
                  <div className="vacancy-detail-section-title">Обязанности:</div>
                  <div className="vacancy-detail-list">
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">1.</span>
                      <span className="vacancy-detail-list-text">Развитие взаимоотношений с банками и финансовыми организациями;</span>
                    </div>
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">2.</span>
                      <span className="vacancy-detail-list-text">Участие в разработке стратегии развития бизнеса и увеличение доли рынка среди клиентов финансового сектора;</span>
                    </div>
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">3.</span>
                      <span className="vacancy-detail-list-text">Поиск и выход на ЛПР в крупных и средних банках;</span>
                    </div>
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">4.</span>
                      <span className="vacancy-detail-list-text">Проведение переговоров, от первого контакта до подписания договора и запуска пилота;</span>
                    </div>
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">5.</span>
                      <span className="vacancy-detail-list-text">Поиск точек роста и создание новых каналов взаимодействия с партнерами;</span>
                    </div>
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">6.</span>
                      <span className="vacancy-detail-list-text">Мониторинг рынка банковских технологий и выявление перспективных направлений сотрудничества;</span>
                    </div>
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">7.</span>
                      <span className="vacancy-detail-list-text">Создание условий для долгосрочного успешного сотрудничества с ключевыми клиентами.</span>
                    </div>
                  </div>
                </div>

                <div className="vacancy-detail-section-block">
                  <div className="vacancy-detail-section-title">Требования:</div>
                  <div className="vacancy-detail-list">
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">1.</span>
                      <span className="vacancy-detail-list-text">Успешный опыт выстраивания партнерских отношений с банками, финансовыми организациями и крупными корпоративными структурами;</span>
                    </div>
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">2.</span>
                      <span className="vacancy-detail-list-text">Глубокое понимание специфики банковской отрасли, знание особенностей работы сотрудников банка с партнерами;</span>
                    </div>
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">3.</span>
                      <span className="vacancy-detail-list-text">Умение структурировать свою работу и управлять временем, четкое следование установленным планам и процессам.</span>
                    </div>
                  </div>
                </div>

                <div className="vacancy-detail-section-block">
                  <div className="vacancy-detail-section-title">Условия:</div>
                  <div className="vacancy-detail-list">
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">1.</span>
                      <span className="vacancy-detail-list-text">Официальное трудоустройство;</span>
                    </div>
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">2.</span>
                      <span className="vacancy-detail-list-text">Достойное вознаграждение;</span>
                    </div>
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">3.</span>
                      <span className="vacancy-detail-list-text">График работы 5/2, сб. вс. - выходные;</span>
                    </div>
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">4.</span>
                      <span className="vacancy-detail-list-text">Работа в стабильной развивающейся компании;</span>
                    </div>
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">5.</span>
                      <span className="vacancy-detail-list-text">Возможность профессионального роста.</span>
                    </div>
                  </div>
                </div>

                <div className="vacancy-detail-section-block">
                  <div className="vacancy-detail-section-title">Мы ищем именно Вас, если Вы:</div>
                  <div className="vacancy-detail-list">
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">1.</span>
                      <span className="vacancy-detail-list-text">Имеете опыт работы в банковской сфере, отлично понимаете, как устроены процессы, кто за что отвечает;</span>
                    </div>
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">2.</span>
                      <span className="vacancy-detail-list-text">Мыслите системно: умеете не только заключать разовые сделки, но и выстраивать долгосрочные, взаимовыгодные партнерские экосистемы;</span>
                    </div>
                    <div className="vacancy-detail-list-item">
                      <span className="vacancy-detail-list-number">3.</span>
                      <span className="vacancy-detail-list-text">Настойчивы и целеустремленны. Вы ищете и находите путь к цели.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="cap-section" style={{marginBottom: '100px'}}>
            <div className="cap-container">
              <div className="hiring-title">
                <span className="hiring-title-dark">Нанимаем </span>{' '}
                <span className="hiring-title-blue">самых достойных</span>
              </div>

              <div className="hiring-container">
                <img className="hiring-image" src="/images/pho.svg" alt="Hiring illustration" />
                <form className="hiring-form-container">
                  <div className="hiring-form-title">Расскажите почему вы нам подходите<br/>и отправьте своё резюме</div>
                  <div className="hiring-form-fields">
                    <div className="hiring-form-row">
                      <input className="hiring-form-input" placeholder="ФИО" />
                      <input className="hiring-form-input" placeholder="Город" />
                    </div>
                    <div className="hiring-form-row">
                      <input type="email" className="hiring-form-input" placeholder="E-mail" />
                      <input type="tel" className="hiring-form-input" placeholder="Телефон" />
                    </div>
                    <textarea className="hiring-form-textarea" placeholder="Комментарии" />
                  </div>
                  <div className="hiring-form-attach">
                    <label className="hiring-form-attach-button">
                      <input type="file" accept=".jpg,.jpeg,.png,.doc,.docx,.pdf" className="hiring-form-file-input" />
                      <div className="hiring-form-attach-text">Прикрепить резюме</div>
                    </label>
                    <div className="hiring-form-attach-info">Размер файла не должен превышать 5 мб. <br/>Формат: jpg, png, doc, docx, pdf.</div>
                  </div>
                  <div className="hiring-form-submit">
                    <button type="submit" className="hiring-form-submit-button">
                      <div className="hiring-form-submit-text">Отправить заявку</div>
                    </button>
                    <div className="hiring-form-disclaimer">Нажимая на кнопку Отправить заявку, я даю своё согласие на обработку персональных данных</div>
                  </div>
                </form>
              </div>
            </div>
          </section>

          <section className="cap-section">
            <div className="cap-container">
              <div className="questions-title">
                <span className="questions-title-dark">Остались </span>
                <span className="questions-title-blue">вопросы?</span>
              </div>
              <Image className="questions-image" src="/images/ost.svg" alt="Questions illustration" width={400} height={300} />
              <div className="questions-button-container">
                <button className="questions-button">
                  <div className="questions-button-text">Связаться с нами</div>
                </button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page-wrapper bg-slate-50 vacancies-page">
      <Header />

      <main>
        {/* Заголовок */}
        <section className="cap-section">
          <div className="cap-container">
            <div className="vacancies-hero-wrapper">
              <div className="vacancies-hero-container">
                <div className="vacancies-hero-title">
                  <span className="vacancies-hero-title-part1">Станьте частью команды<br/></span>
                  <span className="vacancies-hero-title-part2">GEORGE&apos;S ANALISYS</span>
                </div>
                <div className="vacancies-hero-description">Хотите расти и развиваться в области бухгалтерского обслуживания и заниматься интересными задачами? Добро пожаловать в команду GEORGE&apos;S ANALISYS, где важен каждый член команды, и каждая идея имеет значение!</div>
              </div>
              <div className="vacancies-hero-image">
                <Image src="/images/man-with-laptop.svg" alt="Человек с ноутбуком" width={400} height={300} />
              </div>
            </div>
            <div className="vacancies-cta-button">
              <div className="vacancies-cta-button-text">Стать частью команды</div>
          </div>
        </div>
        </section>


        {/* Почему мы? */}
        <section className="cap-section">
          <div className="cap-container">
            
            <div className="hero-features-container">
              <div className="feature-item">
                <Image alt="Работа с комфортом" loading="lazy" width={65} height={52} decoding="async" data-nimg="1" className="feature-icon" src="/images/feature-1.svg" style={{color: 'transparent'}} />
                <h3 className="feature-title">Работа с комфортом</h3>
                <p className="feature-description">удобный график<br/>и поддержка команды</p>
              </div>
              <div className="feature-item">
                <Image alt="Достойная оплата" loading="lazy" width={65} height={52} decoding="async" data-nimg="1" className="feature-icon" src="/images/feature-2.svg" style={{color: 'transparent'}} />
                <h3 className="feature-title">Достойная оплата</h3>
                <p className="feature-description">прозрачная система<br/>вознаграждения</p>
              </div>
              <div className="feature-item">
                <Image alt="Карьерные перспективы" loading="lazy" width={65} height={52} decoding="async" data-nimg="1" className="feature-icon" src="/images/feature-3.svg" style={{color: 'transparent'}} />
                <h3 className="feature-title">Карьерные перспективы</h3>
                <p className="feature-description">рост и развитие<br/>внутри компании</p>
              </div>
              <div className="feature-item">
                <div style={{width: 52, height: 52, borderRadius: 9999, border: '5px #64748B solid'}} />
                <h3 className="feature-title">Поддержка и обучение</h3>
                <p className="feature-description">помощь наставников<br/>и доступ к курсам</p>
              </div>
              <div className="feature-item">
                <div style={{width: 52, height: 52, borderRadius: 9999, border: '5px #64748B solid'}} />
                <h3 className="feature-title">Современные технологии</h3>
                <p className="feature-description">работа с актуальными<br/>инструментами</p>
              </div>
            </div>
            
           
          </div>
        </section>

        {/* Почему мы? - новая секция */}
        <section className="cap-section">
          <div className="cap-container">
            <div className="why-us-title">
              <span className="why-us-title-blue">Почему </span>
              <span className="why-us-title-dark">мы?</span>
            </div>
            
            <div className="why-us-container">
              <div className="why-us-row">
                <div className="why-us-image-card rash">
                </div>
                <div className="why-us-image-card rab">
                </div>
              </div>
              
              <div className="why-us-row">
                <div className="why-us-text-card">
                  <div className="why-us-card-content">
                    <div className="why-us-card-title">Нестандартные кейсы вместо шаблонов</div>
                    <div className="why-us-card-description">Большие данные, производительность и качество кода — ежедневные приоритеты. Мы ценим фундаментальное понимание того, как исполняется написанный код, и умеем оптимизировать процессы без потери чистоты решений и пользы для бизнеса.</div>
                  </div>
                </div>
                <div className="why-us-text-card">
                  <div className="why-us-card-content">
                    <div className="why-us-card-title">Сильная инженерная культура</div>
                    <div className="why-us-card-description">Эффект работы измеряем понятными метриками: удобство сервиса для пользователей и вклад<br/>в финансовые цели компании. Мы быстро проверяем гипотезы, развиваем то, что даёт ценность, и смело отказываемся от лишнего.</div>
                  </div>
                </div>
                <div className="why-us-text-card">
                  <div className="why-us-card-content">
                    <div className="why-us-card-title">Влияние<br/>и рост</div>
                    <div className="why-us-card-description">У нас короткие циклы принятия решений, открытая коммуникация и поддержка инициатив. Можно брать ответственность, расти в экспертизе и видеть прямой эффект своей работы — не через годы,<br/>а уже в ближайших релизах.</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="why-us-button-container">
              <div className="why-us-button">
                <div className="why-us-button-text">Подробнее о компании</div>
              </div>
            </div>
          </div>
        </section>

        {/* Наши вакансии */}
        <section className="cap-section">
          <div className="cap-container">
            <div className="vacancies-title-container">
              <span className="vacancies-title-dark">Наши </span>
              <span className="vacancies-title-blue">вакансии</span>
            </div>
            
            <div className="vacancies-list-container">
              <div className="vacancy-card">
                <div className="vacancy-header">
                  <div className="vacancy-title">UX/UI-Дизайнер</div>
                  <h2 className="vacancy-salary">
                    <span className="vacancy-salary-text">до&nbsp;</span>{' '}<span className="vacancy-salary-value">70 000 ₽</span>
                  </h2>
                </div>
                <div className="vacancy-description">Преоектировать пользовательские потоки, создавать вайрфреймы и интерактивные прототипы</div>
                <div className="vacancy-footer">
                  <div className="vacancy-tags">
                    <div className="vacancy-tag">Удалённая работа</div>
                    <div className="vacancy-tag">Опыт работы от года</div>
                    <div className="vacancy-tag">Полная занятость</div>
                  </div>
                  <div className="vacancy-apply-button" onClick={() => setShowVacancyDetail(true)}>
                    <div className="vacancy-apply-button-text">Откликнуться</div>
                  </div>
                </div>
              </div>

              <div className="vacancy-card">
                <div className="vacancy-header">
                  <div className="vacancy-title">Data-аналитик</div>
                  <h2 className="vacancy-salary">
                    <span className="vacancy-salary-text">до&nbsp;</span>
                    <span className="vacancy-salary-value">65 000 ₽</span>
                  </h2>
                </div>
                <div className="vacancy-description">Анализ данных по продажам и клиентским воронкам, поиск точек роста и узких мест</div>
                <div className="vacancy-footer">
                  <div className="vacancy-tags">
                    <div className="vacancy-tag">Удалённая работа</div>
                    <div className="vacancy-tag">Опыт работы от года</div>
                    <div className="vacancy-tag">Полная занятость</div>
                  </div>
                  <div className="vacancy-apply-button" onClick={() => setShowVacancyDetail(true)}>
                    <div className="vacancy-apply-button-text">Откликнуться</div>
                  </div>
                </div>
              </div>

              <div className="vacancy-card">
                <div className="vacancy-header">
                  <div className="vacancy-title">Аналитик-контролёр</div>
                  <h2 className="vacancy-salary">
                    <span className="vacancy-salary-text">до&nbsp;</span>
                    <span className="vacancy-salary-value">75 000 ₽</span>
                  </h2>
                </div>
                <div className="vacancy-description">Составление и ведение оперативной контрольно-аналитической отчётности по воронке продаж (этапы Pre-sale и Sale)</div>
                <div className="vacancy-footer">
                  <div className="vacancy-tags">
                    <div className="vacancy-tag">Полный день</div>
                    <div className="vacancy-tag">Опыт работы от года</div>
                    <div className="vacancy-tag">Полная занятость</div>
                  </div>
                  <div className="vacancy-apply-button" onClick={() => setShowVacancyDetail(true)}>
                    <div className="vacancy-apply-button-text">Откликнуться</div>
                  </div>
                </div>
              </div>

              <div className="vacancy-card">
                <div className="vacancy-header">
                  <div className="vacancy-title">Старший бухлгалтер</div>
                  <h2 className="vacancy-salary">
                    <span className="vacancy-salary-text">до&nbsp;</span>
                    <span className="vacancy-salary-value">55 000 ₽</span>
                  </h2>
                </div>
                <div className="vacancy-description">Вести бухгалтерский и налоговый учёта нескольких компаний в составе команды с чётко распределёнными функциями</div>
                <div className="vacancy-footer">
                  <div className="vacancy-tags">
                    <div className="vacancy-tag">Удалённая работа</div>
                    <div className="vacancy-tag">Опыт работы от года</div>
                    <div className="vacancy-tag">Полная занятость</div>
                  </div>
                  <div className="vacancy-apply-button" onClick={() => setShowVacancyDetail(true)}>
                    <div className="vacancy-apply-button-text">Откликнуться</div>
                  </div>
                </div>
              </div>

              <div className="vacancy-card">
                <div className="vacancy-header">
                  <div className="vacancy-title">Менеджер по развитию партнёров</div>
                  <h2 className="vacancy-salary">
                    <span className="vacancy-salary-text">до&nbsp;</span>
                    <span className="vacancy-salary-value">75 000 ₽</span>
                  </h2>
                </div>
                <div className="vacancy-description">Полный цикл сопровождения партнёров: от вводного обучения до анализа эффективности</div>
                <div className="vacancy-footer">
                  <div className="vacancy-tags">
                    <div className="vacancy-tag">Полный день</div>
                    <div className="vacancy-tag">Опыт работы от 3 лет</div>
                    <div className="vacancy-tag">Полная занятость</div>
                  </div>
                  <div className="vacancy-apply-button" onClick={() => setShowVacancyDetail(true)}>
                    <div className="vacancy-apply-button-text">Откликнуться</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Часто задаваемые вопросы */}
        <section className="cap-section">
          <div className="cap-container">
            <h2 className="section-title text-center">
              <span className="text-dark">Часто задаваемые</span>{' '}
              <span className="text-primary">вопросы</span>
            </h2>
            <div style={{textAlign: 'center', marginBottom: '20px'}}>
             
            </div>
            <div className="faq-container">
              <div className={`faq-item ${openItems.has(0) ? 'faq-item-open' : ''}`}>
                <div className="faq-question-container" onClick={() => toggleFAQ(0)}>
                  <div className="faq-question-text">Какой у вас формат работы — офис или удалёнка?</div>
                  <Image
                    src={openItems.has(0) ? "/images/up.svg" : "/images/down.svg"}
                    alt={openItems.has(0) ? "Collapse" : "Expand"}
                    width={20}
                    height={20}
                    className="faq-arrow"
                  />
                </div>
                {openItems.has(0) && (
                  <div className="faq-answer">Мы предоставляем гибридный формат: можно работать из офиса в Москве или удалённо из любой точки России. Для удалённой работы достаточно стабильного интернета и ноутбука, всё остальное обеспечим мы.</div>
                )}
              </div>

              <div className={`faq-item ${openItems.has(1) ? 'faq-item-open' : ''}`}>
                <div className="faq-question-container" onClick={() => toggleFAQ(1)}>
                  <div className="faq-question-text">Есть ли испытательный срок и чем он отличается от основного периода?</div>
                  <Image
                    src={openItems.has(1) ? "/images/up.svg" : "/images/down.svg"}
                    alt={openItems.has(1) ? "Collapse" : "Expand"}
                    width={20}
                    height={20}
                    className="faq-arrow"
                  />
                </div>
                {openItems.has(1) && (
                  <div className="faq-answer">Да, испытательный срок обычно длится 3 месяца. На этом этапе вы получаете полную вовлечённость в проекты, менторскую поддержку и обучение, а условия по оплате труда не отличаются от постоянных.</div>
                )}
              </div>

              <div className={`faq-item ${openItems.has(2) ? 'faq-item-open' : ''}`}>
                <div className="faq-question-container" onClick={() => toggleFAQ(2)}>
                  <div className="faq-question-text">Какие перспективы роста и развития внутри компании?</div>
                  <Image
                    src={openItems.has(2) ? "/images/up.svg" : "/images/down.svg"}
                    alt={openItems.has(2) ? "Collapse" : "Expand"}
                    width={20}
                    height={20}
                    className="faq-arrow"
                  />
                </div>
                {openItems.has(2) && (
                  <div className="faq-answer">Мы практикуем горизонтальный и вертикальный рост. Можно развиваться как эксперт в своей области, становясь ведущим инженером или аналитиком, а можно двигаться в сторону руководящих ролей. Для этого у нас есть регулярные performance-review и обучение в корпоративном центре знаний.</div>
                )}
              </div>

              <div className={`faq-item ${openItems.has(3) ? 'faq-item-open' : ''}`}>
                <div className="faq-question-container" onClick={() => toggleFAQ(3)}>
                  <div className="faq-question-text">Предусмотрены ли бонусы и соцпакет?</div>
                  <Image
                    src={openItems.has(3) ? "/images/up.svg" : "/images/down.svg"}
                    alt={openItems.has(3) ? "Collapse" : "Expand"}
                    width={20}
                    height={20}
                    className="faq-arrow"
                  />
                </div>
                {openItems.has(3) && (
                  <div className="faq-answer">Да, мы предлагаем конкурентную зарплату, квартальные бонусы по результатам работы, медицинскую страховку, компенсацию обучения и участия в профильных конференциях. Также у нас действует программа «Приведи друга» — за рекомендацию успешного кандидата выплачивается премия.</div>
                )}
              </div>

              <div className={`faq-item ${openItems.has(4) ? 'faq-item-open' : ''}`}>
                <div className="faq-question-container" onClick={() => toggleFAQ(4)}>
                  <div className="faq-question-text">Как устроен процесс найма?</div>
                  <Image
                    src={openItems.has(4) ? "/images/up.svg" : "/images/down.svg"}
                    alt={openItems.has(4) ? "Collapse" : "Expand"}
                    width={20}
                    height={20}
                    className="faq-arrow"
                  />
                </div>
                {openItems.has(4) && (
                  <div className="faq-answer">Обычно он состоит из трёх этапов:<br/>
                  <span style={{color: '#64748B', fontSize: 16, fontWeight: 300, lineHeight: '115%'}}>1. </span>короткое интервью с HR,<br/>
                  <span style={{color: '#64748B', fontSize: 16, fontWeight: 300, lineHeight: '115%'}}>2. </span>техническое или продуктовое собеседование,<br/>
                  <span style={{color: '#64748B', fontSize: 16, fontWeight: 300, lineHeight: '115%'}}>3. </span>финальная встреча с руководителем команды.<br/>
                   {'   '} Процесс занимает около 1–2 недель, и мы всегда даём обратную связь.</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Нанимаем самых достойных */}
        <section className="cap-section" style={{marginBottom: '100px'}}>
          <div className="cap-container">
            <div className="hiring-title">
              <span className="hiring-title-dark">Нанимаем </span>{' '}
              <span className="hiring-title-blue">самых достойных</span>
        </div>

            <div className="hiring-container">
              <img className="hiring-image" src="/images/pho.svg" alt="Hiring illustration" />
              <form className="hiring-form-container">
                <div className="hiring-form-title">Расскажите почему вы нам подходите<br/>и отправьте своё резюме</div>
                <div className="hiring-form-fields">
                  <div className="hiring-form-row">
                    <input className="hiring-form-input" placeholder="ФИО" />
                    <input className="hiring-form-input" placeholder="Город" />
                  </div>
                  <div className="hiring-form-row">
                    <input type="email" className="hiring-form-input" placeholder="E-mail" />
                    <input type="tel" className="hiring-form-input" placeholder="Телефон" />
                  </div>
                  <textarea className="hiring-form-textarea" placeholder="Комментарии" />
                </div>
                <div className="hiring-form-attach">
                  <label className="hiring-form-attach-button">
                    <input type="file" accept=".jpg,.jpeg,.png,.doc,.docx,.pdf" className="hiring-form-file-input" />
                    <div className="hiring-form-attach-text">Прикрепить резюме</div>
                  </label>
                  <div className="hiring-form-attach-info">Размер файла не должен превышать 5 мб. <br/>Формат: jpg, png, doc, docx, pdf.</div>
                </div>
                <div className="hiring-form-submit">
                  <button type="submit" className="hiring-form-submit-button">
                    <div className="hiring-form-submit-text">Отправить заявку</div>
                  </button>
                  <div className="hiring-form-disclaimer">Нажимая на кнопку Отправить заявку, я даю своё согласие на обработку персональных данных</div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Остались вопросы? */}
        <section className="cap-section">
          <div className="cap-container">
            <div className="questions-title">
              <span className="questions-title-dark">Остались </span>
              <span className="questions-title-blue">вопросы?</span>
            </div>
            <Image className="questions-image" src="/images/ost.svg" alt="Questions illustration" width={400} height={300} />
            <div className="questions-button-container">
              <button className="questions-button">
                <div className="questions-button-text">Связаться с нами</div>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}



