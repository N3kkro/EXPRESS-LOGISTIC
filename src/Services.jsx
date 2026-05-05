import React from 'react';
import './Services.css';
import Rail_IMAGE from"./assets/rail_transport.webp"//
import Container_IMAGE from"./assets/container_way.jpg"
import Multi_WAY_IMAGE from"./assets/multi_way.webp"
import Vehicle_IMAGE from"./assets/vehicle_way.jpg"
import Tamozh_IMAGE from"./assets/tamozh.jpg"
import Plane_IMAGE from"./assets/plane_way.webp" //
// 1. Translation Map (Dictionary)
const translations = {
  RU: {
    sectionTitle: "Наши Услуги",
    railTitle: "Железнодорожные перевозки",
    containerTitle: "Контейнерные перевозки",
    multimodalTitle: "Мультимодальные перевозки",
    automotiveTitle: "Автомобильные перевозки",
    customsTitle: "Таможенные услуги",
    airTitle: "Авиаперевозки",
  },
  EN: {
    sectionTitle: "Our Services",
    railTitle: "Rail Transportation",
    containerTitle: "Container Shipping",
    multimodalTitle: "Multimodal Freight",
    automotiveTitle: "Road Transportation",
    customsTitle: "Customs Services",
    airTitle: "Air Freight",
  },
};

// 2. Service Data Array with placeholders
const servicesData = [
  { key: 'rail', imageUrl: Rail_IMAGE },
  { key: 'container', imageUrl: Container_IMAGE },
  { key: 'multimodal', imageUrl: Multi_WAY_IMAGE },
  { key: 'automotive', imageUrl: Vehicle_IMAGE },
  { key: 'customs', imageUrl: Tamozh_IMAGE },
  { key: 'air', imageUrl: Plane_IMAGE },
];

export default function Services({ language }) {
  // Use the dictionary based on the language prop, or default to RU
  const t = translations[language] || translations.RU;

  return (
    <section className="services-section section-padding">
      <div className="content-container">
        
        
        <div className="services-header">
          <h2 className="section-title">{t.sectionTitle}</h2>
        </div>

        {/* --- Grid Container --- */}
        <div className="services-grid">
          
          {/* --- Map over service data to render cards --- */}
          {servicesData.map((service, index) => (
            
            // Replaced button with a clickable div
            <div 
              key={index} 
              className="service-card" 
              onClick={() => console.log(`Clicked on: ${t[`${service.key}Title`]}`)}
              style={{ cursor: 'pointer' }}
            >
              
              {/* Image Container */}
              <div className="card-image-container">
                <img 
                  src={service.imageUrl} 
                  alt={t[`${service.key}Title`]} 
                  className="card-image"
                />
              </div>

              {/* Text and Icon Container */}
              <div className="card-content">
                <h3 className="card-title">
                  {t[`${service.key}Title`]}
                </h3>
                
                {/* Standard Arrow-Out Icon */}
                <div className="card-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}