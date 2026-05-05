import React from 'react';
import "./AboutCompany.css";

// Translation dictionary
const translations = {
  RU: {
    aboutTitle: "О нашей компании",
    companyName: "ТОО «EXPRESS-LOGISTICS 2023»",
    desc1: " — казахстанская логистическая компания, специализирующаяся на железнодорожных перевозках грузов для импорта и экспорта. Основанная в 2023 году, компания быстро сформировала репутацию надёжного и технологичного партнёра.",
    desc2: "Наша миссия — обеспечивать бесперебойные, безопасные и экономически эффективные логистические цепочки, помогая бизнесам уверенно развивать внешнеторговые операции.",
    btnText: "Узнать больше",
    whatWeDo: "Что мы предлагаем",
    srv1Title: "Полный цикл ж/д перевозок",
    srv1Desc: "От планирования маршрута и бронирования подвижного состава до контроля доставки «от двери до двери».",
    srv2Title: "Оформление документов",
    srv2Desc: "Работа с товаросопроводительными документами, взаимодействие с АО «ҚТЖ» и таможней.",
    srv3Title: "Оптимизация схем",
    srv3Desc: "Разработка лучших логистических маршрутов для снижения сроков и стоимости транспортировки.",
    srv4Title: "Мониторинг груза",
    srv4Desc: "Отслеживание в реальном времени и оперативная коммуникация на всех этапах перевозки."
  },
  EN: {
    aboutTitle: "About Our Company",
    companyName: "LLP «EXPRESS-LOGISTICS 2023»",
    desc1: " is a Kazakhstani logistics company specializing in railway freight transportation for import and export. Founded in 2023, the company has quickly built a reputation as a reliable and technologically advanced partner.",
    desc2: "Our mission is to provide uninterrupted, safe, and cost-effective supply chains, helping businesses confidently develop foreign trade operations.",
    btnText: "Learn More",
    whatWeDo: "What We Do",
    srv1Title: "Full-Cycle Rail Freight",
    srv1Desc: "From route planning and rolling stock booking to door-to-door delivery control.",
    srv2Title: "Document Processing",
    srv2Desc: "Handling shipping documents, interacting with JSC «KTZ» and customs authorities.",
    srv3Title: "Route Optimization",
    srv3Desc: "Developing the best logistics routes to reduce transportation time and costs.",
    srv4Title: "Cargo Monitoring",
    srv4Desc: "Real-time tracking and prompt communication at all stages of transportation."
  }
};


export default function AboutCompany({ language }) {

  const t = translations[language] || translations.RU;

  return (
    <section className="about-company-section" id="about-company">
      <div className="about-content-container">
    
        <div className="about-left-column">
          <div className="about-title-wrapper">
            <h2 className="about-main-title">{t.aboutTitle}</h2>
          </div>
          <p className="about-description">
            <strong>{t.companyName}</strong>{t.desc1}
          </p>
          <p className="about-description">
            {t.desc2}
          </p>
          <button className="btn-forest">{t.btnText}</button>
        </div>

        <div className="about-right-column">
          <h3 className="what-we-do-title">{t.whatWeDo}</h3>
          
          <div className="services-list">
            
            <div className="service-item">
              <div className="service-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <div className="service-text">
                <h4>{t.srv1Title}</h4>
                <p>{t.srv1Desc}</p>
              </div>
            </div>

            <div className="service-item">
              <div className="service-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div className="service-text">
                <h4>{t.srv2Title}</h4>
                <p>{t.srv2Desc}</p>
              </div>
            </div>

            <div className="service-item">
              <div className="service-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="3"></circle>
                  <line x1="12" y1="22" x2="12" y2="8"></line>
                  <path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
                </svg>
              </div>
              <div className="service-text">
                <h4>{t.srv3Title}</h4>
                <p>{t.srv3Desc}</p>
              </div>
            </div>

            <div className="service-item">
              <div className="service-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="service-text">
                <h4>{t.srv4Title}</h4>
                <p>{t.srv4Desc}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}