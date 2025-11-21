'use client'

export default function WhyUsSection() {
  return (
    <section id="section-why-us" className="why-us-section py-24 bg-gray-50">
      <div style={{width: 1920, paddingLeft: 250, paddingRight: 250, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 25, display: 'inline-flex'}}>
        <div style={{alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 25, display: 'inline-flex'}}>
          <div style={{width: 796, height: 250, padding: 25, background: 'white', overflow: 'hidden', borderRadius: 5, backgroundImage: 'url(/images/complex.svg)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', display: 'inline-flex'}}>
          </div>
          <div style={{width: 553, height: 250, padding: 25, background: 'white', overflow: 'hidden', borderRadius: 5, backgroundImage: 'url(/images/off.svg)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', display: 'inline-flex'}}>
          </div>
        </div>
        <div style={{alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 25, display: 'inline-flex'}}>
          <div style={{width: 553, height: 250, padding: 25, background: 'white', overflow: 'hidden', borderRadius: 5, backgroundImage: 'url(/images/everyday.svg)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', display: 'inline-flex'}}>
          </div>
          <div style={{width: 796, height: 250, padding: 25, background: 'white', overflow: 'hidden', borderRadius: 5, backgroundImage: 'url(/images/full.svg)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', display: 'inline-flex'}}>
          </div>
        </div>
      </div>
    </section>
  )
}
