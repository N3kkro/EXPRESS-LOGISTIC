import { useState, useEffect } from 'react'
import Hero from "./assets/hero.mp4"
import './App.css'
import ProcessFlow from './processFlow';
import TransportMap from './TransportMap';

// Translation Dictionary for the App component
const translations = {
  RU: {
    aboutTab: "О КОМПАНИИ",
    locationTab: "РАСПОЛОЖЕНИЕ",
    heroTitle: "Ваш стратегический партнер в международной логистике",
    heroDesc: "Бесперебойные и безопасные ж/д грузоперевозки по Казахстану, Китаю и странам ЕАЭС. Полный цикл доставки «от двери до двери».",
    catalogBtn: "Смотреть каталог",
    learnBtn: "Узнать больше",
    footerDesc: "Профессиональные решения в сфере международной железнодорожной логистики."
  },
  EN: {
    aboutTab: "ABOUT COMPANY",
    locationTab: "COMPANY LOCATION",
    heroTitle: "Your strategic partner in international logistics",
    heroDesc: "Uninterrupted and safe rail freight across Kazakhstan, China, and the EAEU. Full-cycle «door-to-door» delivery.",
    catalogBtn: "Check catalog",
    learnBtn: "Learn more",
    footerDesc: "Professional solutions in international railway logistics."
  }
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // NEW: State to control the current language (Defaults to RU)
  const [language, setLanguage] = useState('RU');

  // Helper variable so we don't have to type translations[language] every time
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  // Language Switcher Component to avoid repeating code
  const LanguageSwitcher = () => (
    <div style={{ display: 'flex', gap: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
      <span 
        className={language === 'RU' ? 'active-lang' : 'inactive-lang'} 
        onClick={() => setLanguage('RU')}
      >RU</span>
      <span className="inactive-lang">/</span>
      <span 
        className={language === 'EN' ? 'active-lang' : 'inactive-lang'} 
        onClick={() => setLanguage('EN')}
      >EN</span>
    </div>
  );

  return (
    <div className="app-wrapper">
      
      <section className="hero-section">
        <video autoPlay loop muted playsInline className="bg-video">
          <source src={Hero} type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
        
        <header className={`hero-header ${isScrolled ? 'sticky-header' : ''}`}>
          <div className="header-container">
            <div className="logo" style={{ cursor: 'pointer' }} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              EXPRESS-LOGISTIC
            </div>
            
            <button className="burger-btn" onClick={() => setIsMenuOpen(true)}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <ul className="nav-tabs desktop-only">
              <li className="nav-tab" onClick={() => scrollToSection('about-company')}>
                <span className="tab-text">{t.aboutTab}</span>
                <span className="tab-underline"></span>
              </li>
              <li className="nav-tab" onClick={() => scrollToSection('company-location')}>
                <span className="tab-text">{t.locationTab}</span>
                <span className="tab-underline"></span>
              </li>
            </ul>
            
            <div className="header-actions desktop-only">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* MOBILE MENU */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <ul className="mobile-nav-tabs">
            <li className="mobile-nav-tab" onClick={() => scrollToSection('about-company')}>{t.aboutTab}</li>
            <li className="mobile-nav-tab" onClick={() => scrollToSection('company-location')}>{t.locationTab}</li>
          </ul>

          <div className="mobile-actions">
            <LanguageSwitcher />
          </div>
        </div>

        {/* HERO CONTENT */}
        <div className="hero-content-container">
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="hero-description">{t.heroDesc}</p>
          <div className="hero-buttons">
            <button className="btn-primary btn-large">{t.catalogBtn}</button>
            <button className="btn-outline btn-large" onClick={() => scrollToSection('about-company')}>{t.learnBtn}</button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT (Passing the language state down as a prop) */}
      <main className="main-content">
        <div id="about-company">
          <ProcessFlow language={language} />
        </div>
        <div id="company-location">
          <TransportMap language={language} />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-left">
            <h2 className="footer-logo">EXPRESS-LOGISTIC</h2>
            <p className="footer-subtitle">{t.footerDesc}</p>
          </div>
          <div className="footer-right">
            <span className="footer-link" onClick={() => scrollToSection('about-company')}>{t.aboutTab}</span>
            <span className="footer-link" onClick={() => scrollToSection('company-location')}>{t.locationTab}</span>
          </div>
        </div>
      </footer> 
      
    </div>
  )
} 

export default App