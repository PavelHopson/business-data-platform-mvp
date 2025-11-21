import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import ConvenienceSection from '@/components/ConvenienceSection'
import CapabilitiesSection from '@/components/CapabilitiesSection'
import WhyUsSection from '@/components/WhyUsSection'
import StatsSection from '@/components/StatsSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="page-wrapper" style={{ overflowX: 'hidden', maxWidth: '100vw', paddingRight: '250px', position: 'relative', zIndex: 1 }}>
      <Header />
      <HeroSection />
      <ConvenienceSection />
      <CapabilitiesSection />
      <WhyUsSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
