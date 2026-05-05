import React, { useState, useEffect, useRef } from 'react';
import './Routes.css';

const routeTranslations = {
  RU: {
    title: "География и маршруты",
    badge: "Направления",
    desc: "Наши специалисты глубоко знают специфику кросс-граничной логистики и нормативные требования стран-партнёров.",
    routes: [
      { id: 'r1', icon: "🌍", title: "Китай ↔️ Казахстан ↔️ ЕАЭС", text: "Ключевое направление импорта и экспорта.", color: "green" },
      { id: 'r2', icon: "🛤️", title: "Европа и Центральная Азия", text: "Транзитные коридоры через территорию РК.", color: "purple" },
      { id: 'r3', icon: "🇰🇿", title: "Внутренние перевозки", text: "Магистральные маршруты по всей территории Казахстана.", color: "aqua" }
    ]
  },
  EN: {
    title: "Geography and Routes",
    badge: "Directions",
    desc: "Our specialists have deep knowledge of cross-border logistics and regulatory requirements of partner countries.",
    routes: [
      { id: 'r1', icon: "🌍", title: "China ↔️ Kazakhstan ↔️ EAEU", text: "Key direction for import and export operations.", color: "green" },
      { id: 'r2', icon: "🛤️", title: "Europe & Central Asia", text: "Transit corridors passing through Kazakhstan.", color: "purple" },
      { id: 'r3', icon: "🇰🇿", title: "Internal Transport", text: "Mainline routes across the territory of Kazakhstan.", color: "aqua" }
    ]
  }
};

const colorHexMap = {
  green: '#10b981',
  purple: '#8b5cf6',
  aqua: '#06b6d4',
  gray: '#e5e7eb'
};

export default function Routes({ language }) {
  const t = routeTranslations[language] || routeTranslations.RU;
  
  const [activeId, setActiveId] = useState('r1');
  const observer = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', 
      threshold: 0 
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Only update if it's currently intersecting that middle zone
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    setTimeout(() => {
      const cards = document.querySelectorAll('.scroll-card');
      cards.forEach(card => observer.current.observe(card));
    }, 100);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [language]);

  const activeIndex = t.routes.findIndex(r => r.id === activeId);
  const progressPercent = Math.max(0, (activeIndex / (t.routes.length - 1)) * 100); 
  const activeColorTheme = activeIndex >= 0 ? t.routes[activeIndex].color : 'gray';
  const activeHex = colorHexMap[activeColorTheme];

  return (
    <section className="routes-section" id="company-location">
      <div className="routes-container">
        
        {/* CENTERED HEADER */}
        <div className="routes-header">
          <span className="routes-badge">{t.badge}</span>
          <h2 className="routes-title">{t.title}</h2>
          <p className="routes-desc-top">{t.desc}</p>
        </div>

        <div className="routes-layout">
          <div className="scroll-content-wrapper">
            
            {/* VERY LONG TIMELINE (Stays fixed on screen) */}
            <div className="timeline-sticky">
              <div className="timeline-track">
                <div 
                  className="timeline-progress" 
                  style={{ height: `${progressPercent}%`, backgroundColor: activeHex }}
                ></div>
                <div 
                  className="timeline-dot" 
                  style={{ 
                    top: `${progressPercent}%`, 
                    borderColor: activeHex,
                    boxShadow: `0 0 20px ${activeHex}` /* Bright Glow */
                  }}
                ></div>
              </div>
            </div>

            {/* SCROLLING CARDS */}
            <div className="scroll-cards-container">
              {t.routes.map((route) => (
                <div 
                  key={route.id} 
                  id={route.id} 
                  className={`scroll-card ${activeId === route.id ? `active color-${route.color}` : ''}`}
                >
                  <div className="route-icon-box">{route.icon}</div>
                  <h4>{route.title}</h4>
                  <p>{route.text}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}