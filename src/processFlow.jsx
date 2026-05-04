import React from 'react';
import './ProcessFlow.css';

const flowTranslations = {
  RU: {
    title: "Как мы работаем",
    card1Title: "Запрос",
    card1Text: "Отправляете нам запрос (сайт, email, WhatsApp, телефон);",
    card2Title: "Связь с клиентом",
    card2Text: "Специалист связывается с Вами для уточнения необходимой информации;",
    card3Title: "Маршрут и расчет",
    card3Text: "Подбираем оптимальный маршрут и просчитываем стоимость перевозки.",
    card4Title: "Договор",
    card4Text: "Заключаем договор и назначаем персонального менеджера.",
    card5Title: "Партнерство",
    card5Text: "Мы стремимся к построению крепких и надежных партнерских отношений."
  },
  EN: {
    title: "How We Work",
    card1Title: "Request",
    card1Text: "Send us a request (website, email, WhatsApp, phone);",
    card2Title: "Client Contact",
    card2Text: "A specialist will contact you to clarify the necessary information;",
    card3Title: "Route & Calculation",
    card3Text: "We select the optimal route and calculate the transportation cost.",
    card4Title: "Contract",
    card4Text: "We sign a contract and assign a personal manager.",
    card5Title: "Partnership",
    card5Text: "We strive to build strong and reliable partnerships."
  }
};

// Accept the language prop here
export default function ProcessFlow({ language }) {
  const t = flowTranslations[language] || flowTranslations.RU;

  return (
    <section className="process-section section-padding">
      <div className="content-container">
        <h2 className="section-title text-center">{t.title}</h2>
        <div className="process-grid">
          
          <div className="process-card">
            <div className="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line><path d="M14 14l2 2 4-4"></path></svg></div>
            <h3 className="card-title">{t.card1Title}</h3>
            <p className="card-text">{t.card1Text}</p>
          </div>

          <div className="process-card">
            <div className="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path><path d="M12 22v-3"></path><path d="M8 12c1.5-1.5 3-2 4-2s2.5.5 4 2"></path></svg></div>
            <h3 className="card-title">{t.card2Title}</h3>
            <p className="card-text">{t.card2Text}</p>
          </div>

          <div className="process-card">
            <div className="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"></circle><circle cx="5" cy="19" r="3"></circle><circle cx="19" cy="19" r="3"></circle><path d="M10.5 7.5l-4 8"></path><path d="M13.5 7.5l4 8"></path><path d="M7.5 19h9"></path></svg></div>
            <h3 className="card-title">{t.card3Title}</h3>
            <p className="card-text">{t.card3Text}</p>
          </div>

          <div className="process-card">
            <div className="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
            <h3 className="card-title">{t.card4Title}</h3>
            <p className="card-text">{t.card4Text}</p>
          </div>

          <div className="process-card">
            <div className="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"></path><path d="M13 19l6-6"></path><path d="M16 16l4 4"></path><path d="M19 21l2-2"></path><path d="M14.5 17.5L13 19c-1.5 1.5-3 1.5-4.5 0l-4-4c-1.5-1.5-1.5-3 0-4.5L6 9"></path><path d="M9.5 12.5L14 8"></path></svg></div>
            <h3 className="card-title">{t.card5Title}</h3>
            <p className="card-text">{t.card5Text}</p>
          </div>

        </div>
      </div>
    </section>
  );
}