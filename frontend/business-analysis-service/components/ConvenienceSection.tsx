'use client'
import Image from 'next/image'
import Link from 'next/link'

export default function ConvenienceSection() {
  const features = [
    '• Контактные данные и реквизиты',
    '• Все сведения на одной странице',
    '• Рейтинг надёжности компании',
    '• 38 официальных источников',
    '• Ежедневное обновление данных',
    '• Маркеры рисков ФНС',
    '• Признаки банкротства (ЕФРСБ)',
    '• Финансовые показатели и динамика',
    '• История изменений'
  ]

  return (
    <section id="section-convenience" className="convenience-section py-32 bg-gray-50">
      <div className="container max-w-[1420px] mx-auto px-4 lg:px-25">
        <h2 className="section-heading mb-24">
          <span className="section-heading-primary">Удобства</span>{' '}
          <span className="section-heading-dark">сервиса</span>
        </h2>
        
        <div className="convenience-content flex items-start gap-8 flex-row">
          <div className="convenience-screenshots flex gap-6 w-full lg:w-1/2">
            <Image
              src="/images/screenshot-1.png"
              alt="Screenshot of a company profile"
              width={557}
              height={451}
              className="rounded-2xl shadow-lg"
              style={{ marginLeft: '250px' }}
            />
          
          </div>
          
           <div className="convenience-features-card bg-white rounded-2xl p-8 shadow-lg  lg:w-1/2" style={{
             display: 'flex',
             padding: '25px',
             flexDirection: 'column',
             justifyContent: 'center',
             alignItems: 'flex-start',
             gap: '20px',
             flexShrink: 0,
             overflow: 'hidden',
             marginRight: '250px'
           }}>
            <h3 className="convenience-title" style={{ marginBottom: '10px' }}>
              Удобная оценка <br /> контрагентов
            </h3>
            
            <ul className="list-none p-0 flex flex-col" style={{ gap: '8px', marginLeft: '-40px', marginBottom: '10px' }}>
              {features.map((feature, index) => (
                <li key={index} className="convenience-list-item flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></span>
                  {feature}
                </li>
              ))}
            </ul>
            
            <Link 
              href="#section-capabilities" 
              className="capabilities-button"
            >
              Все возможности сервиса
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
