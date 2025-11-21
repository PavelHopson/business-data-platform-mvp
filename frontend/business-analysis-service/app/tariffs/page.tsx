'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { useState } from 'react'

export default function TariffsPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0])) // Первый элемент открыт по умолчанию
  
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
  
  return (
    <div className="page-wrapper bg-slate-50">
      <Header />

      <main>
        {/* Заголовок */}
        <section className="cap-section tariff-header">
          <div className="cap-container">
            <h1 className="section-title text-center">
              <span className="text-dark">Выбор</span> <span className="text-primary">тарифа</span>
            </h1>
          </div>
        </section>

        {/* Тарифы */}
        <section className="cap-section">
          <div className="cap-container">
            <div className="tariff-grid">
              <div className="tariff-card">
                <h3 className="tariff-name">Стандарт</h3>
                <p className="tariff-price"><span className="text-dark">От</span> <span className="text-primary">0 ₽</span> <span className="text-dark">/ мес.</span></p>
                <a className="tariff-select-outline" href="#">Выбран</a>
                <p className="tariff-subtitle">В тариф входит:</p>
                <ul className="tariff-list">
                  <li>Базовые сведения о компании, без доступа к полной информации</li>
                  <li>Данные из ЕГРЮЛ, ЕГРИП</li>
                </ul>
              </div>

              <div className="tariff-card">
                <h3 className="tariff-name">Профи</h3>
                <p className="tariff-price"><span className="text-dark">От</span> <span className="text-primary">990 ₽</span> <span className="text-dark">/ мес.</span></p>
                <a className="tariff-select" href="#">Выбрать</a>
                <p className="tariff-subtitle">В тариф входит:</p>
                <ul className="tariff-list">
                  <li>Полная карточка компании</li>
                  <li>Проверка руководителей и учредителей</li>
                  <li>Выявление цепочек связей контрагентов</li>
                  <li>Финансовые показатели, бухотчётность</li>
                  <li>Данные из ЕГРЮЛ, ЕГРИП</li>
                </ul>
              </div>

              <div className="tariff-card">
                <h3 className="tariff-name">Профи + расширенная <br/> проверка физлиц</h3>
                <p className="tariff-price"><span className="text-dark">От</span> <span className="text-primary">1890 ₽</span> <span className="text-dark">/ мес.</span></p>
                <a className="tariff-select" href="#">Выбрать</a>
                <p className="tariff-subtitle">В тариф входит:</p>
                <ul className="tariff-list">
                  <li>Все возможности тарифа &quot;Профи&quot;</li>
                  <li>10 расширенных отчётов на физлиц в месяц</li>
                </ul>
                <a href="#" className="tariff-features-link">Все особенности тарифа</a>
              </div>

            </div>
          </div>
        </section>

        {/* Возможности сервиса */}
        <section className="cap-section">
          <div className="container max-w-[1420px] mx-auto px-4 lg:px-25">
            <h2 className="section-heading mb-24">
              <span className="section-heading-primary">Возможности</span> <span className="section-heading-dark">сервиса</span>
            </h2>
            <div className="capabilities-grid flex gap-6 flex-col lg:flex-row">
              <div className="capability-card large-card bg-white rounded-2xl p-8 shadow-lg flex flex-col gap-6 w-[997px] h-[480px]" style={{display: 'flex', height: '480px', padding: '25px', flexDirection: 'column', alignItems: 'flex-start', gap: '25px', flex: '1 0 0px', marginLeft: '250px'}}>
                <div className="flex-1">
                  <h3 className="capability-card-title mb-4">Финансовая аналитика и риски</h3>
                  <p className="capability-card-description" style={{marginTop: '-15px'}}>Карточки KPI по выручке, прибыли, активам. Графики динамикиза 5 лет.<br/> Автоматическая оценка рисков и признаков банкротства.</p>
                  <a className="btn btn-primary bg-blue-600 text-white px-8 py-3 rounded self-start hover:opacity-90 transition-opacity" href="#">Подробнее</a>
                </div>
                <div className="w-32 h-32 flex items-center justify-center self-end">
                  <img alt="Financial Analytics" loading="lazy" width="360" height="360" decoding="async" data-nimg="1" className="object-contain" src="/images/img1.png" style={{color: 'transparent'}} />
                </div>
              </div>
              <div className="capabilities-column flex-1 flex flex-col gap-6">
                <div className="capability-card small-card bg-white rounded-2xl p-8 shadow-lg flex gap-4" style={{width: '697px', height: '227px'}}>
                  <img alt="Courts and Contracts" loading="lazy" width="697" height="227" decoding="async" data-nimg="1" className="object-cover w-full h-full" src="/images/sudi.svg" style={{color: 'transparent'}} />
                </div>
                <div className="capability-card small-card bg-white rounded-2xl p-8 shadow-lg flex gap-4 h-[227px]">
                  <img alt="Connections and Monitoring" loading="lazy" width="557" height="227" decoding="async" data-nimg="1" className="object-contain" src="/images/mon.svg" style={{color: 'transparent', marginLeft: '25px', marginRight: '100px', width: '697px', height: '227px', flexShrink: '0', maxWidth: '697px', maxHeight: '227px', minWidth: '697px', minHeight: '227px'}} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Свяжитесь с нами */}
        <section className="cap-section">
          <div className="cap-container">
            <h2 className="section-title text-center mb-8">
              <span className="text-primary">Свяжитесь</span> <span className="text-dark">с нами</span>
            </h2>
          </div>
          <div className="cap-container" style={{position: 'relative'}}>
            <img 
              src="/images/we.svg" 
              alt="Contact section" 
              width={1470} 
              height={209}
              className="contact-section-image"
            />
            <button className="contact-section-overlay-button">
              Связаться с нами
            </button>
          </div>
        </section>

        {/* FAQ */}
        <section className="cap-section">
          <div className="cap-container">
            <h2 className="section-title text-center">
              <span className="text-dark">Часто задаваемые</span> <span className="text-primary">вопросы</span>
            </h2>
            {/* Кнопка для управления всеми элементами */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              
            </div>
            <div className="faq-container">
              <div className={`faq-item ${openItems.has(0) ? 'faq-item-open' : ''}`}>
                <div className="faq-question-container" onClick={() => toggleFAQ(0)}>
                  <div className="faq-question-text">На скольких устройствах можно использовать доступ?</div>
                  <Image
                    src={openItems.has(0) ? "/images/up.svg" : "/images/down.svg"}
                    alt={openItems.has(0) ? "Collapse" : "Expand"}
                    width={20}
                    height={20}
                    className="faq-arrow"
                  />
                </div>
                {openItems.has(0) && (
                  <div className="faq-answer">Каждый пользователь имеет личную учётную запись, которую можно использовать на любом своём устройстве. Одновременно — только на одном. При входе с нового устройства на старом произойдёт автоматический выход.</div>
                )}
              </div>

              <div className={`faq-item ${openItems.has(1) ? 'faq-item-open' : ''}`}>
                <div className="faq-question-container" onClick={() => toggleFAQ(1)}>
                  <div className="faq-question-text">Входит ли НДС в стоимость?</div>
                  <Image
                    src={openItems.has(1) ? "/images/up.svg" : "/images/down.svg"}
                    alt={openItems.has(1) ? "Collapse" : "Expand"}
                    width={20}
                    height={20}
                    className="faq-arrow"
                  />
                </div>
                {openItems.has(1) && (
                  <div className="faq-answer">Мы резиденты &quot;Сколково&quot; и освобождены от НДС (ст. 145.1 НК РФ). Поэтому услуги НДС не облагаются.</div>
                )}
              </div>

              <div className={`faq-item ${openItems.has(2) ? 'faq-item-open' : ''}`}>
                <div className="faq-question-container" onClick={() => toggleFAQ(2)}>
                  <div className="faq-question-text">Предоставляете ли вы закрывающие документы?</div>
                  <Image
                    src={openItems.has(2) ? "/images/up.svg" : "/images/down.svg"}
                    alt={openItems.has(2) ? "Collapse" : "Expand"}
                    width={20}
                    height={20}
                    className="faq-arrow"
                  />
                </div>
                {openItems.has(2) && (
                  <div className="faq-answer">Да, для юрлиц и ИП оформляются закрывающие документы. Скачать электронные копии и заказать оригиналы можно в личном кабинете.</div>
                )}
              </div>

              <div className={`faq-item ${openItems.has(3) ? 'faq-item-open' : ''}`}>
                <div className="faq-question-container" onClick={() => toggleFAQ(3)}>
                  <div className="faq-question-text">Как работает автопродление?</div>
                  <Image
                    src={openItems.has(3) ? "/images/up.svg" : "/images/down.svg"}
                    alt={openItems.has(3) ? "Collapse" : "Expand"}
                    width={20}
                    height={20}
                    className="faq-arrow"
                  />
                </div>
                {openItems.has(3) && (
                  <div className="faq-answer">Оплата списывается автоматически, начиная с первого платежа. Отключить автопродление можно в личном кабинете в любой момент.</div>
                )}
              </div>

              <div className={`faq-item ${openItems.has(4) ? 'faq-item-open' : ''}`}>
                <div className="faq-question-container" onClick={() => toggleFAQ(4)}>
                  <div className="faq-question-text">Можно ли подключить несколько сотрудников?</div>
                  <Image
                    src={openItems.has(4) ? "/images/up.svg" : "/images/down.svg"}
                    alt={openItems.has(4) ? "Collapse" : "Expand"}
                    width={20}
                    height={20}
                    className="faq-arrow"
                  />
                </div>
                {openItems.has(4) && (
                  <div className="faq-answer">Да. Владелец подписки управляет доступом пользователей через личный кабинет: добавляет, деактивирует и отслеживает активность.</div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA секция */}
        <section className="cap-section cta-section">
          <div className="container max-w-[1420px] mx-auto px-4 lg:px-25">
            <h2 className="section-heading mb-8">
              <span className="section-heading-primary">Будьте в курсе</span> <span className="section-heading-dark">изменений</span>
            </h2>
            <div className="cta-card bg-white rounded-2xl w-[1420px] h-[277px] mx-auto flex flex-col justify-center items-center self-stretch cta-card-content" style={{marginLeft: '250px'}}>
              <div className="cta-text-container">
                <h3 className="cta-heading cta-heading-spaced">Получайте уведомления<br/>о важных событиях в компаниях:</h3>
                <p className="cta-description max-w-[425px] cta-description-spaced">Смена руководства, новые судебные дела, банкротство.<br/>Вся история обновлений хранится в личном кабинете.</p>
              </div>
              <a className="cta-button" href="#">Попробовать бесплатно</a>
              <p className="disclaimer-text max-w-[377px]">Нажимая на кнопку Попробовать бесплатно,<br/>я даю своё согласие на обработку персональных данных</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
