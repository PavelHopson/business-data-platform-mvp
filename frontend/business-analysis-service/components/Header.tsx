'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import AuthModal from './AuthModal'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const pathname = usePathname()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="site-header bg-white">
      <div className="header-container mx-auto relative">
        <Link href="/" className="logo no-underline">
          <Image 
            src="/images/logo.svg" 
            alt="George's Analysis Logo"
            width={75}
            height={28}
            className="block"
          />
        </Link>
        
        <nav className="header-nav">
          <Link href="/" className={`text-sm nav-link-black ${isActive('/') ? 'active' : ''}`}>
            Главная
          </Link>
          <Link href="/capabilities" className={`text-sm nav-link-black ${isActive('/capabilities') ? 'active' : ''}`}>
            Возможности
          </Link>
          <Link href="/tariffs" className={`text-sm nav-link-black ${isActive('/tariffs') ? 'active' : ''}`}>
            Тарифы
          </Link>
          <Link href="/person-check" className={`text-sm nav-link-black ${isActive('/person-check') ? 'active' : ''}`}>
            Проверка физлиц
          </Link>
          <Link href="/vacancies" className={`text-sm nav-link-black ${isActive('/vacancies') ? 'active' : ''}`}>
            Вакансии
          </Link>
          <Link href="/contacts" className={`text-sm nav-link-black ${isActive('/contacts') ? 'active' : ''}`}>
            О компании
          </Link>
        </nav>

        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Открыть меню"
        >
          <div className={`hamburger-icon ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
        </button>

        {pathname === '/dashboard' ? (
          <div className="header-profile-button">
            <div className="header-profile-icon"></div>
            <div className="header-profile-text">Профиль</div>
          </div>
        ) : (
          <button 
            className="header-login-button"
            onClick={() => {
              setAuthMode('login')
              setIsAuthModalOpen(true)
            }}
          >
            Вход / Регистрация
          </button>
        )}
      </div>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}></div>
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-links">
          <Link href="/" className={`mobile-menu-item ${isActive('/') ? 'active' : ''}`} onClick={toggleMobileMenu}>
            Главная
          </Link>
          <Link href="/capabilities" className={`mobile-menu-item ${isActive('/capabilities') ? 'active' : ''}`} onClick={toggleMobileMenu}>
            Возможности
          </Link>
          <Link href="/tariffs" className={`mobile-menu-item ${isActive('/tariffs') ? 'active' : ''}`} onClick={toggleMobileMenu}>
            Тарифы
          </Link>
          <Link href="/person-check" className={`mobile-menu-item ${isActive('/person-check') ? 'active' : ''}`} onClick={toggleMobileMenu}>
            Проверка физлиц
          </Link>
          <Link href="/vacancies" className={`mobile-menu-item ${isActive('/vacancies') ? 'active' : ''}`} onClick={toggleMobileMenu}>
            Вакансии
          </Link>
          <Link href="/contacts" className={`mobile-menu-item ${isActive('/contacts') ? 'active' : ''}`} onClick={toggleMobileMenu}>
            О компании
          </Link>
          <button 
            className="mobile-menu-register"
            onClick={() => {
              setAuthMode('login')
              setIsAuthModalOpen(true)
              toggleMobileMenu()
            }}
          >
            Вход / Регистрация
          </button>
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </header>
  )
}
