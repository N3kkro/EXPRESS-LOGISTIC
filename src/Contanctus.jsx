import React, { useRef, useState } from 'react';
import './Contactus.css';

const contactTranslations = {
  RU: {
    brandName: "EXPRESS-LOGISTICS",
    quote: "\"Соединяем рынки. Выполняем обещания. Ваш надежный партнер в международной логистике и транзите.\"",
    heading: "ВЫ ГОТОВЫ К СОТРУДНИЧЕСТВУ?",
    description: "Оставьте ваши данные, и наш специалист свяжется с вами в течение рабочего часа для подготовки индивидуального предложения.",
    typeLabel: "Тип номера",
    typePlaceholder: "Выберите тип...",
    typeMobile: "Мобильный (WhatsApp/Telegram)",
    typeWork: "Рабочий",
    typeHome: "Домашний",
    phoneLabel: "Номер телефона",
    btnIdle: "Отправить заявку",
    btnSending: "Отправка...",
    btnSuccess: "Успешно отправлено!",
    btnError: "Ошибка. Попробуйте еще раз."
  },
  EN: {
    brandName: "EXPRESS-LOGISTICS",
    quote: "\"Connecting markets. Delivering promises. Your reliable partner in international logistics and transit.\"",
    heading: "ARE YOU READY FOR COOPERATION?",
    description: "Leave your details, and our specialist will contact you within a working hour to prepare an individual offer.",
    typeLabel: "Type of Number",
    typePlaceholder: "Select type...",
    typeMobile: "Mobile (WhatsApp/Telegram)",
    typeWork: "Work",
    typeHome: "Home",
    phoneLabel: "Phone Number",
    btnIdle: "Send Request",
    btnSending: "Sending...",
    btnSuccess: "Sent Successfully!",
    btnError: "Error. Try Again."
  }
};

export default function ContactUs({ language }) {
  const form = useRef();
  const [status, setStatus] = useState('idle');

  const t = contactTranslations[language] || contactTranslations.RU;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // Create a FormData object from the form ref
    const formData = new FormData(form.current);
    
    const endpoint = "https://formsubmit.co/ajax/elogistics135@gmail.com";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
        form.current.reset();
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("FormSubmit Error:", error);
      setStatus('error');
    }
  };

  return (
    <div className="cooperation-wrapper">
      <div className="cooperation-container">
        
        <div className="cooperation-left">
          <div className="glow-effect"></div>
          <div className="left-content">
            <h2 className="brand-name">{t.brandName}</h2>
            <p className="brand-quote">{t.quote}</p>
          </div>
        </div>

        <div className="cooperation-right">
          <div className="form-header">
            <h3>{t.heading}</h3>
            <p>{t.description}</p>
          </div>

          {/* Form setup for FormSubmit */}
          <form ref={form} onSubmit={handleSubmit} className="coop-form">
            {/* Optional: Disables FormSubmit's default captcha page for AJAX */}
            <input type="hidden" name="_captcha" value="false" />
            
            <div className="input-group">
              <label>{t.typeLabel}</label>
              <select name="Number Type" required defaultValue="">
                <option value="" disabled>{t.typePlaceholder}</option>
                <option value="Mobile">{t.typeMobile}</option>
                <option value="Work">{t.typeWork}</option>
                <option value="Home">{t.typeHome}</option>
              </select>
            </div>

            <div className="input-group">
              <label>{t.phoneLabel}</label>
              <input 
                type="tel" 
                name="Phone Number" 
                placeholder="+7 (___) ___-__-__" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={status === 'sending'}
              className={`submit-btn ${status === 'success' ? 'success' : ''}`}
            >
              {status === 'idle' && t.btnIdle}
              {status === 'sending' && t.btnSending}
              {status === 'success' && t.btnSuccess}
              {status === 'error' && t.btnError}
            </button>
          </form>

          <div className="contact-email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <a href="mailto:elogistics135@gmail.com">elogistics135@gmail.com</a>
          </div>

        </div>
      </div>
    </div>
  );
}