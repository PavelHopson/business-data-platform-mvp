'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AboutCompanyPage() {
  return (
    <div className="page-wrapper bg-slate-50 contacts-page">
      <Header />

      <main>
        {/* Заголовок */}
        <section className="cap-section">
          <div className="cap-container">
            <div className="about-company-title">
              <span className="about-company-title-blue">Помогаем бизнесу</span>
              <span className="about-company-title-dark"> принимать решения</span>
            </div>
            
            <div className="about-company-description">
              Наш сервис проверяет контрагентов по официальным источникам.<br/>
              Вы вводите данные, а мы собираем досье: реквизиты, учредители,<br/>
              связи, судебные дела, финансовые показатели и многое другое.<br/>
              Всё в одном месте — быстро и прозрачно.
            </div>
            
            <div className="about-company-button-container">
              <button className="about-company-button">
                <div className="about-company-button-text">Стать частью команды</div>
              </button>
            </div>
            
            <div className="about-company-stats-container">
              <div className="stats-card-container">
                <div className="stat-item">
                  <div className="stat-number">10+</div>
                  <p className="stats-description whitespace-pre-line">лет опыта<br/>
в бизнес-аналитике</p>
                </div>
                <div className="stat-item">
                  <div className="stat-number">700 000</div>
                  <p className="stats-description whitespace-pre-line">человек принимают решения <br/>на основе данных Rusprofile ежедневно</p>
                </div>
                <div className="stat-item">
                  <div className="stat-number">200 000</div>
                  <p className="stats-description whitespace-pre-line">организаций используют сервис<br/> для проверки партнёров</p>
                </div>
                <div className="stat-item">
                  <div className="stat-number">38</div>
                  <p className="stats-description whitespace-pre-line">официальных<br/>
источников данных</p>
                </div>
              </div>
              <img className="about-company-stats-image" src="/images/man-with-laptop.svg" alt="Man with laptop" />
            </div>

            {/* Секция "Как мы работаем?" */}
            <div className="how-we-work-container">
              <div className="how-we-work-title-combined">
                <span className="how-we-work-title">Как </span>
                <span className="how-we-work-subtitle">мы работаем?</span>
              </div>
              
              <div className="how-we-work-row">
                <div className="how-we-work-card-small obn"></div>
                <div className="how-we-work-card-large tolk"></div>
              </div>
              
              <div className="how-we-work-row">
                <img src="/images/conf.svg" alt="Conf" width="842" height="250" />
                <img src="/images/rehse.svg" alt="Rehse" width="553" height="250" />
              </div>
            </div>

            {/* Секция "Попробуйте сейчас" */}
            <div className="try-now-container">
              <div className="try-now-title">
                <span className="try-now-title-blue">Попробуйте</span>
                <span className="try-now-title-dark"> сейчас</span>
              </div>
              
              <div className="search-contractor-form">
                <div className="search-contractor-title">Поиск контрагента за секунды</div>
                <div className="search-contractor-description">
                  Введите ИНН, ОГРН, название или точный адрес — получите полную карточку, риск-профиль и историю изменений.<br/>
                  Нужны документы? Скачайте официальные выписки прямо из карточки.
                </div>
                <div className="search-input-container">
                  <div className="search-input-wrapper">
                    <img src="/images/Union.svg" alt="Search" className="search-icon" />
                    <div className="search-placeholder">Название, адрес, ФИО, учредителям, ОГРН и ИНН</div>
                  </div>
                  <div className="search-button">
                    <div className="search-button-text">Проверить контрагента</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Секция "Кто делает сервис?" */}
            <div className="who-makes-service-container">
              <div className="who-makes-service-title">
                <span className="who-makes-service-title-blue">Кто </span>
                <span className="who-makes-service-title-dark">делает сервис?</span>
              </div>
              
              <div className="who-makes-service-cards">
                <div className="who-makes-service-card">
                  <div className="who-makes-service-icon"></div>
                  <div className="who-makes-service-content">
                    <div className="who-makes-service-card-title">Дата-<br/>инженеры</div>
                    <div className="who-makes-service-card-description">Сбор, очистка, нормализация, скоринг. SLA по обновлениям.</div>
                  </div>
                </div>
                
                <div className="who-makes-service-card">
                  <div className="who-makes-service-icon"></div>
                  <div className="who-makes-service-content">
                    <div className="who-makes-service-card-title">Дата-<br/>аналитики</div>
                    <div className="who-makes-service-card-description">Модели рисков, факторы, метрики качества.</div>
                  </div>
                </div>
                
                <div className="who-makes-service-card">
                  <div className="who-makes-service-icon"></div>
                  <div className="who-makes-service-content">
                    <div className="who-makes-service-card-title">Продакт, дизайн-менеджеры</div>
                    <div className="who-makes-service-card-description">Карточка контрагента, отчёты, UX-паттерны.</div>
                  </div>
                </div>
                
                <div className="who-makes-service-card">
                  <div className="who-makes-service-icon"></div>
                  <div className="who-makes-service-content">
                    <div className="who-makes-service-card-title">Сотрудники поддержки</div>
                    <div className="who-makes-service-card-description">Комплаенс-вопросы, помощь клиентам, документация.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Секция "Станьте частью команды" */}
            <div className="join-team-container">
              <div className="join-team-title">
                <span className="join-team-title-dark">Станьте </span>
                <span className="join-team-title-blue">частью команды</span>
              </div>
              
              <div className="join-team-form">
                <div className="join-team-form-title">Хотите расти и развиваться вместе с нами?</div>
                <div className="join-team-form-description">
                  Хотите расти и развиваться в области бухгалтерского обслуживания и заниматься интересными задачами?<br/>
                  Добро пожаловать в команду GEORGE&apos;S ANALISYS, где важен каждый член команды, и каждая идея имеет значение!
                </div>
                <Link href="/tariffs" className="join-team-button">
                  <div className="join-team-button-text">Выбрать тариф</div>
                </Link>
              </div>
            </div>

            {/* Секция "Наши клиенты" */}
            <div className="our-clients-container">
              <div className="our-clients-title">
                <span className="our-clients-title-dark">Наши </span>
                <span className="our-clients-title-blue">клиенты</span>
              </div>
              
              <div className="our-clients-cards">
                <div className="our-clients-row">
                  <div className="our-clients-card">
                    <div className="our-clients-logo" style={{width: '271px', height: '52px'}}></div>
                  </div>
                  <div className="our-clients-card">
                    <div className="our-clients-logo" style={{width: '252px', height: '52px'}}></div>
                  </div>
                  <div className="our-clients-card">
                    <div className="our-clients-logo" style={{width: '222px', height: '52px'}}></div>
                  </div>
                  <div className="our-clients-card">
                    <div className="our-clients-logo" style={{width: '164px', height: '52px'}}></div>
                  </div>
                </div>
                
                <div className="our-clients-row">
                  <div className="our-clients-card">
                    <div className="our-clients-logo" style={{width: '246px', height: '52px'}}></div>
                  </div>
                  <div className="our-clients-card">
                    <div className="our-clients-logo" style={{width: '191px', height: '52px'}}></div>
                  </div>
                  <div className="our-clients-card">
                    <div className="our-clients-logo" style={{width: '171px', height: '52px'}}></div>
                  </div>
                  <div className="our-clients-card">
                    <div className="our-clients-logo" style={{width: '105px', height: '52px'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Секция "Они говорят за нас" */}
            <div className="testimonials-container">
              <div className="testimonials-title">
                <span className="testimonials-title-dark">Они </span>
                <span className="testimonials-title-blue">говорят за нас</span>
              </div>
              
              <div className="testimonials-cards">
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-category">
                      <div className="testimonial-category-text">Упаковочное оборудование</div>
                    </div>
                    <div className="testimonial-text">
                      Мы известны в России, но в некоторых регионах о нас знают мало или не знают совсем. Возможности и времени регулярно летать на Дальний Восток или во Владикавказ, чтобы знакомиться с потенциальными клиентами, у меня нет. Поэтому я использую Rusprofile — по коду ОКВЭД нахожу в регионе все предприятия, отбираю компании, которые потенциально смогут позволить наше оборудование. Смотрю на их выручку, наличие долгов и судебных дел. Это здорово экономит время: я не трачу время на нецелевых клиентов, которые не смогут приобрести наш продукт.
                    </div>
                  </div>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar"></div>
                    <div className="testimonial-author-info">
                      <div className="testimonial-author-name">Алексей</div>
                      <div className="testimonial-author-position">Менеджер по продажам</div>
                    </div>
                  </div>
                </div>
                
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-category">
                      <div className="testimonial-category-text">Строительная компания</div>
                    </div>
                    <div className="testimonial-text">
                      Направление моей работы — продажи, поэтому я ежедневно работаю с контрагентами. Так как клиенты платят за товар после его получения, их способность исполнять финансовые обязательства по договору для нас имеет большое значение. Я детально изучаю контрагента с помощью Rusprofile, проверяю его платежеспособность и выношу свой вердикт: быть сделке или нет.
                    </div>
                  </div>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar"></div>
                    <div className="testimonial-author-info">
                      <div className="testimonial-author-name">Алла</div>
                      <div className="testimonial-author-position">Начальник отдела снабжения</div>
                    </div>
                  </div>
                </div>
                
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-category">
                      <div className="testimonial-category-text">Фармацевтическая компания</div>
                    </div>
                    <div className="testimonial-text">
                      Мы обеспечиваем строительными материалами большое количество объектов. Поэтому у нас много поставщиков. Однажды мы не проверили компанию и столкнулись с обманом: не получили товар и не смогли вернуть предоплату. Поэтому решили, что каждую компанию нужно проверять и оценивать. Когда стоимость контракта с поставщиком превышает определенную сумму, я сразу же проверяю компанию через Rusprofile. Максимум за полчаса я узнаю почти все про своего потенциального поставщика.
                    </div>
                  </div>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar"></div>
                    <div className="testimonial-author-info">
                      <div className="testimonial-author-name">Виктор</div>
                      <div className="testimonial-author-position">Коммерческий директор</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Секция "Будьте в курсе изменений" */}
            <div className="container max-w-[1420px] mx-auto px-4 lg:px-25">
              <h2 className="section-heading mb-8">
                <span className="section-heading-primary">Будьте в курсе</span> 
                <span className="section-heading-dark"> изменений</span>
              </h2>
              <div className="cta-card bg-white rounded-2xl w-[1420px] mx-auto flex flex-col justify-center items-center self-stretch cta-card-content">
                <div className="cta-text-container">
                  <h3 className="cta-heading cta-heading-spaced">Получайте уведомления<br/>о важных событиях в компаниях:</h3>
                  <p className="cta-description cta-description-spaced">Смена руководства, новые судебные дела, банкротство.<br/>Вся история обновлений хранится в личном кабинете.</p>
                </div>
                <a className="cta-button" href="#">Попробовать бесплатно</a>
                <p className="disclaimer-text max-w-[377px]">Нажимая на кнопку Попробовать бесплатно,<br/>я даю своё согласие на обработку персональных данных</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


