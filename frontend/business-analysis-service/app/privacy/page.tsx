'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
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

      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Политика конфиденциальности
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Общие положения
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Настоящая Политика конфиденциальности определяет порядок обработки персональных данных 
                пользователей сервиса Business Analysis. Мы серьезно относимся к защите ваших данных 
                и соблюдаем все требования законодательства РФ.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Какие данные мы собираем
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Имя и контактная информация (email, телефон)</li>
                <li>Данные для входа в систему</li>
                <li>Информация о поисковых запросах</li>
                <li>Технические данные (IP-адрес, браузер, устройство)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Как мы используем данные
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Предоставление услуг поиска и анализа компаний</li>
                <li>Улучшение качества сервиса</li>
                <li>Обеспечение безопасности</li>
                <li>Связь с пользователями</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Защита данных
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Мы используем современные методы шифрования и защиты данных. 
                Ваша информация хранится на защищенных серверах и не передается третьим лицам 
                без вашего согласия.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Ваши права
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Вы имеете право:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Получать информацию о ваших данных</li>
                <li>Требовать исправления неточных данных</li>
                <li>Требовать удаления ваших данных</li>
                <li>Отозвать согласие на обработку</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Контакты
              </h2>
              <p className="text-gray-700 leading-relaxed">
                По вопросам обработки персональных данных обращайтесь:
                <br />
                Email: privacy@business-analysis.ru
                <br />
                Телефон: +7 (800) 123-45-67
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
