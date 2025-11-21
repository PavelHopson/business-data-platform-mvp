'use client'
import Link from 'next/link'

export default function CTASection() {
  return (
    <section id="section-cta" className="cta-section py-24 bg-gray-50">
      <div className="container max-w-[1420px] mx-auto px-4 lg:px-25">
        <h2 className="section-heading mb-8">
          <span className="section-heading-primary">Будьте в курсе</span>{' '}
          <span className="section-heading-dark">изменений</span>
        </h2>
        
        <div className="cta-card bg-white rounded-2xl w-[1420px] h-[277px] mx-auto flex flex-col justify-center items-center self-stretch cta-card-content" style={{ marginLeft: '250px' }}>
          <div className="cta-text-container">
            <h3 className="cta-heading cta-heading-spaced">
              Получайте уведомления<br />о важных событиях в компаниях:
            </h3>
            
            <p className="cta-description max-w-[372px] cta-description-spaced">
              Смена руководства, новые судебные дела, банкротство.<br />Вся история обновлений хранится в личном кабинете.
            </p>
          </div>
          
          <Link 
            href="#" 
            className="cta-button"
          >
            Попробовать бесплатно
          </Link>
          
          <p className="disclaimer-text max-w-[377px]">
            Нажимая на кнопку Попробовать бесплатно,<br />я даю своё согласие на обработку персональных данных
          </p>
        </div>
      </div>
    </section>
  )
}
