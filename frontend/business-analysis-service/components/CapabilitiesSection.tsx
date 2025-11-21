'use client'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

export default function CapabilitiesSection() {
  return (
    <section id="section-capabilities" className="capabilities-section py-32 bg-gray-50">
      <div className="container max-w-[1420px] mx-auto px-4 lg:px-25">
        <h2 className="section-heading mb-24">
          <span className="section-heading-primary">Возможности</span>{' '}
          <span className="section-heading-dark">сервиса</span>
        </h2>
        
        <div className="capabilities-grid flex gap-6 flex-col lg:flex-row">
          <div className="capability-card large-card bg-white rounded-2xl p-8 shadow-lg flex flex-col gap-6 w-[697px] h-[480px]" style={{
            display: 'flex',
            width: '600px',
            height: '480px',
            padding: '25px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '25px',
            flex: '1 0 0',
            marginLeft: '250px'
          }}>
            <div className="flex-1">
              <h3 className="capability-card-title mb-4">
                Финансовая аналитика и риски
              </h3>
              <p className="capability-card-description" style={{ marginTop: '-15px' }}>
                Карточки KPI по выручке, прибыли, активам. Графики динамики<br />
                за 5 лет. Автоматическая оценка рисков и признаков банкротства.
              </p>
              <Link 
                href="#" 
                className="btn btn-primary bg-blue-600 text-white px-8 py-3 rounded self-start hover:opacity-90 transition-opacity"
              >
                Подробнее
              </Link>
            </div>
            <div className="w-32 h-32 flex items-center justify-center self-end">
              <Image
                src="/images/img1.png"
                alt="Financial Analytics"
                width={360}
                height={360}
                className="object-contain"
              />
            </div>
          </div>
          
          <div className="capabilities-column flex-1 flex flex-col gap-6">
            <div className="capability-card small-card bg-white rounded-2xl p-8 shadow-lg flex gap-4 h-[227px]">
              <Image
                src="/images/sudi.svg"
                alt="Courts and Contracts"
                width={557}
                height={227}
                className="object-contain"
                style={{ 
                  marginLeft: '25px', 
                  marginRight: '150px',
                  width: '697px',
                  height: '227px',
                  flexShrink: 0,
                  maxWidth: '697px',
                  maxHeight: '227px',
                  minWidth: '697px',
                  minHeight: '227px'
                }}
              />
            </div>
            
            <div className="capability-card small-card bg-white rounded-2xl p-8 shadow-lg flex gap-4 h-[227px]">
              <Image
                src="/images/mon.svg"
                alt="Connections and Monitoring"
                width={557}
                height={227}
                className="object-contain"
                style={{ 
                  marginLeft: '25px', 
                  marginRight: '100px',
                  width: '697px',
                  height: '227px',
                  flexShrink: 0,
                  maxWidth: '697px',
                  maxHeight: '227px',
                  minWidth: '697px',
                  minHeight: '227px'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
