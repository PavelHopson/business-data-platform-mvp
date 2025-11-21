'use client'
import Image from 'next/image'

export default function StatsSection() {
  const stats = [
    {
      number: '10+',
      description: 'лет опыта\nв бизнес-аналитике'
    },
    {
      number: '700 000',
      description: 'человек принимают решения на основе данных Rusprofile ежедневно'
    },
    {
      number: '200 000',
      description: 'организаций используют сервис для проверки партнёров'
    },
    {
      number: '38',
      description: 'официальных\nисточников данных'
    }
  ]

  return (
    <section id="section-stats" className="stats-section py-24 bg-gray-50">
      <div className="container max-w-[1420px] mx-auto px-4 lg:px-25">
        <h2 className="section-heading mb-24">
          <span className="section-heading-dark">Цифры, которым можно </span>
          <span className="section-heading-primary">доверять</span>
        </h2>
        
        <div className="stats-image-container">
          <Image
            src="/images/business-meeting.png"
            alt="Business people in a meeting"
            width={1470}
            height={480}
            className="rounded-2xl"
            style={{ marginLeft: '250px', marginRight: '250px' }}
          />
        </div>
        
        <div className="stats-card-container" style={{ width: '1470px', marginLeft: '250px' }}>
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">
                {stat.number}
              </div>
              <p className="stats-description whitespace-pre-line">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
