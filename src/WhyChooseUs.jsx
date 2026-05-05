import React from 'react';
import './WhyChooseUs.css';

const translations = {
  RU: {
    eyebrow: "ПОЧЕМУ ВЫБИРАЮТ НАС",
    titleStart: "Почему ",
    highlight: "EXPRESS-LOGISTIC",
    titleEnd: " — ваш надежный партнер",
    cards: [
      {
        id: 'c1',
        type: 'small',
        title: "Прозрачные условия",
        text: "Прозрачное ценообразование и абсолютно гибкие условия сотрудничества для каждого клиента.",
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      },
      {
        id: 'c2',
        type: 'small',
        title: "Команда экспертов",
        text: "Сертифицированные логисты с многолетним практическим опытом в ж/д и мультимодальных перевозках.",
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
      },
      {
        id: 'c3',
        type: 'wide',
        title: "Цифровые инструменты",
        text: "Современные ИТ-решения для мониторинга и отслеживания грузов в реальном времени, а также полная автоматизация документооборота.",
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
      },
      {
        id: 'c4',
        type: 'tall',
        title: "Безопасность и надежность",
        text: "Строгое соблюдение сроков, сохранность груза и соответствие международным стандартам безопасности.",
        desc: "ТОО «EXPRESS-LOGISTICS 2023» — ваш стратегический партнёр в международной железнодорожной логистике. Мы открыты к долгосрочному сотрудничеству и готовы стать надёжным звеном в цепочке поставок вашего бизнеса.",
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      }
    ]
  },
  EN: {
    eyebrow: "WHY CHOOSE US",
    titleStart: "Why ",
    highlight: "EXPRESS-LOGISTIC",
    titleEnd: " is The Right Choice",
    cards: [
      {
        id: 'c1',
        type: 'small',
        title: "Transparent Terms",
        text: "Transparent pricing and highly flexible cooperation terms tailored to each client.",
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      },
      {
        id: 'c2',
        type: 'small',
        title: "Expert Team",
        text: "Certified logisticians with years of practical experience in railway and multimodal transportation.",
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
      },
      {
        id: 'c3',
        type: 'wide',
        title: "Digital Tools",
        text: "Modern IT solutions for real-time cargo monitoring and complete automation of document flow.",
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
      },
      {
        id: 'c4',
        type: 'tall',
        title: "Safety & Reliability",
        text: "Strict adherence to deadlines, cargo safety, and compliance with international security standards.",
        desc: "LLP «EXPRESS-LOGISTICS 2023» is your strategic partner in international railway logistics. We are open to long-term cooperation and ready to become a reliable link in your business supply chain.",
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      }
    ]
  }
};

export default function WhyChooseUs({ language }) {
  const t = translations[language] || translations.RU;

  return (
    <section className="wcu-section" id="why-choose-us">
      <div className="wcu-container">
        
        {/* HEADER */}
        <div className="wcu-header">
          <span className="wcu-eyebrow">{t.eyebrow}</span>
          <h2 className="wcu-title">
            {t.titleStart}
            <span className="wcu-highlight">{t.highlight}</span>
            {t.titleEnd}
          </h2>
        </div>

        {/* ASYMMETRICAL BENTO GRID */}
        <div className="wcu-grid">
          {t.cards.map((card) => (
            <div key={card.id} className={`wcu-card wcu-card-${card.type}`}>
              <div className="wcu-icon">
                {card.icon}
              </div>
              <h3 className="wcu-card-title">{card.title}</h3>
              <p className="wcu-card-text">{card.text}</p>
              {/* Only the tall card has this extra paragraph */}
              {card.desc && <p className="wcu-card-desc-extra">{card.desc}</p>}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}