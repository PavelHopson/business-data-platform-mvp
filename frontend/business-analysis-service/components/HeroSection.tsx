'use client'
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
import { CompanySearchAutocomplete } from '@/components/CompanySearchAutocomplete'
import { SearchResult } from '@/lib/api/search'
import { ScraperResponse } from '@/lib/api/scraper'

export default function HeroSection() {
  const router = useRouter();

  const features = [
    {
      icon: '/images/feature-1.svg',
      title: <>Проверяем контрагентов</>,
      description: <>достоверные данные<br />из 38 источников</>
    },
    {
      icon: '/images/feature-2.svg',
      title: <>Анализируем финансы и риски</>,
      description: <>динамика показателей<br />и вероятность банкротства</>
    },
    {
      icon: '/images/feature-3.svg',
      title: <>Изучаем суды и закупки</>,
      description: <>арбитражные дела<br />и госконтракты в цифрах</>
    },
    {
      icon: '/images/feature-4.svg',
      title: <>Выявляем связи и партнёров</>,
      description: <>структура владельцев<br />и дочерних компаний</>
    },
    {
      icon: '/images/feature-5.svg',
      title: <>Отслеживаем изменения</>,
      description: <>мгновенные уведомления<br />о ключевых событиях</>
    }
  ]

  const handleCompanySelect = (company: SearchResult | ScraperResponse) => {
    if ('inn' in company) {
      // Обычный результат поиска
      router.push(`/company-details?inn=${company.inn}`);
    } else if (company.data && company.data.inn) {
      // Данные парсера
      router.push(`/company-details?inn=${company.data.inn}`);
    }
  };

  return (
    <section id="section-hero" className="hero-section py-32 bg-gray-50">
      <div className="container max-w-[1420px] mx-auto px-[150px]">
        <div className="flex items-center justify-between mb-52">
          <nav className="hidden lg:flex gap-8">
            <a href="/" className="nav-link-black">Главная</a>
            <a href="/capabilities" className="nav-link-black">Возможности</a>
            <a href="/tariffs" className="nav-link-black">Тарифы</a>
            <a href="/person-check" className="nav-link-black">Проверка физлиц</a>
            <a href="/vacancies" className="nav-link-black">Вакансии</a>
            <a href="/contacts" className="nav-link-black">О компании</a>
          </nav>
          <a href="/login" className="hidden lg:block bg-white border-2 border-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 hover:border-blue-700 transition-all">
            Вход / Регистрация
          </a>
        </div>

        <div className="relative flex flex-col lg:flex-row items-center gap-12 mb-48 hero-section-offset">
          <div className="w-full lg:w-1/2" style={{ position: 'relative', zIndex: 99998, pointerEvents: 'auto' }}>
            <h1 className="hero-headline mb-6">
              Быстрая и удобная<br />
              <span className="text-blue-forced">проверка контрагентов</span>
            </h1>
            <p className="hero-description hero-description-spaced">
              Помогаем быстро и эффективно оценить надежность контрагента:<br /> защитите бизнес от штрафов, доначислений налогов<br /> и недобросовестных партнеров
            </p>
            <CompanySearchAutocomplete
              onCompanySelect={handleCompanySelect}
              placeholder="Название, адрес, ФИО, учредителям, ОГРН и ИНН"
              className="mb-12"
            />
          </div>
          
          <div className="hero-image-container">
            <Image 
              src="/images/man-with-laptop.svg"
              alt="A man holding a laptop"
              width={550}
              height={516}
              className="hero-image"
            />
          </div>
        </div>

        <div className="hero-features-bar bg-white py-6 rounded-2xl mx-4 lg:mx-6 mb-12">
          <div className="hero-features-container flex flex-wrap justify-between items-start px-6 lg:px-12" style={{ 
            gap: '50px', 
            rowGap: '10px',
            display: 'flex',
            width: '1420px',
            padding: '25px',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-item flex flex-col items-center text-center flex-1 min-w-[150px]"
                style={{ gap: '10px' }}
              >
                <Image
                  src={feature.icon}
                  alt=""
                  width={65.237}
                  height={52}
                  style={{ marginBottom: '10px' }}
                />
                <h3 className="feature-title" style={{ marginBottom: '10px' }}>
                  {feature.title}
                </h3>
                <p className="feature-description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
