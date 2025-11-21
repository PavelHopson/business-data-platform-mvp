'use client';

import Link from 'next/link';

export default function CareersPage() {
  const positions = [
    {
      title: 'Frontend Developer',
      department: 'Разработка',
      location: 'Москва / Удаленно',
      type: 'Полная занятость',
      description: 'Разработка пользовательского интерфейса для платформы анализа бизнеса'
    },
    {
      title: 'Backend Developer',
      department: 'Разработка',
      location: 'Москва / Удаленно',
      type: 'Полная занятость',
      description: 'Разработка серверной части и API для системы анализа данных'
    },
    {
      title: 'Data Analyst',
      department: 'Аналитика',
      location: 'Москва',
      type: 'Полная занятость',
      description: 'Анализ данных компаний и создание отчетов для клиентов'
    },
    {
      title: 'Product Manager',
      department: 'Продукт',
      location: 'Москва',
      type: 'Полная занятость',
      description: 'Управление продуктом и развитие функциональности платформы'
    },
    {
      title: 'DevOps Engineer',
      department: 'Инфраструктура',
      location: 'Москва / Удаленно',
      type: 'Полная занятость',
      description: 'Настройка и поддержка инфраструктуры, CI/CD процессов'
    },
    {
      title: 'Sales Manager',
      department: 'Продажи',
      location: 'Москва',
      type: 'Полная занятость',
      description: 'Привлечение новых клиентов и развитие партнерских отношений'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Business Analysis</span>
            </Link>
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Назад
            </Link>
          </div>
        </div>
      </div>

      
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
            Присоединяйтесь к нашей команде
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы создаем будущее бизнес-аналитики. Станьте частью команды, которая меняет 
            способ принятия бизнес-решений
          </p>
        </div>

        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Конкурентная зарплата</h3>
            <p className="text-gray-600">
              Высокая зарплата и бонусы за результат
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Удаленная работа</h3>
            <p className="text-gray-600">
              Гибкий график и возможность работать из любой точки мира
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Обучение и развитие</h3>
            <p className="text-gray-600">
              Курсы, конференции и возможность профессионального роста
            </p>
          </div>
        </div>

        
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Открытые вакансии
          </h2>
          <div className="grid gap-6">
            {positions.map((position, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {position.department}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {position.location}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {position.type}
                      </span>
                    </div>
                    <p className="text-gray-600">{position.description}</p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/25">
                      Откликнуться
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Не нашли подходящую вакансию?</h2>
          <p className="text-xl mb-8 opacity-90">
            Отправьте нам резюме, и мы свяжемся с вами при появлении подходящей позиции
          </p>
          <button className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors">
            Отправить резюме
          </button>
        </div>
      </div>
    </div>
  );
}
