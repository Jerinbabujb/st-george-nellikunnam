import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Clock3, MapPin } from 'lucide-react';
import { request } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { ServicesContext } from '../context/ServicesContext';

export default function Home() {
    const {  get_notices, get_services} = useContext(ServicesContext);
  const [data, setData] = useState({ announcements: [], services: [] });
  const { t, pick, lang } = useLanguage();
 useEffect(()=>{
  const fetchNotices=async()=>{
    const response = await get_notices();
    const service_response= await get_services();
    setData(prevData=>({
      ...prevData,
      announcements:response.notice,
    services:service_response.service }));
      console.log("notices",response.notice);
  }
  
  fetchNotices();
 },[])
  return <>
    <section className="home-hero">
      <div className="hero-overlay" />
      <div className="hero-content page-shell">
        <p className="eyebrow">St. George Orthodox Church • Nellikunnam</p>
        <h1>{t('heroTitle')}</h1>
        <Link className="btn btn-gold" to="/worship">{t('heroButton')} <ArrowRight size={17}/></Link>
      </div>
    </section>

    <section className="section page-shell">
      <div className="vicar-card">
        <div className="vicar-photo"><span>☦</span></div>
        <div>
          <span className="eyebrow burgundy">{lang==='ml'?'ഇടവക സന്ദേശം':'PARISH MESSAGE'}</span>
          <h2>{t('vicarsMessage')}</h2>
          <p className="quote">“{t('welcomeQuote')}”</p>
          <strong>Rev. Fr. [Name]</strong><small>Vicar</small>
        </div>
      </div>
    </section>

    <section className="section muted-section">
      <div className="page-shell">
        <div className="section-heading"><h2>{t('announcements')}</h2><span/></div>
        <div className="card-grid three">
          {data.announcements.slice(0,3).map((item) => <article className="notice-card" key={item.id}>
            <div className="notice-meta"><span>{item.category}</span><time>{new Date(item.date).toLocaleDateString()}</time></div>
            <h3>{pick(item, 'title')}</h3><p>{pick(item, 'description')}</p>
            <Link to="/notice-board" className="read-link">{t('readMore')} <ArrowRight size={15}/></Link>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section page-shell">
      <div className="schedule-banner">
        <div>
          <span className="eyebrow light">{lang==='ml'?'ഞായറാഴ്ച ആരാധന':'SUNDAY LITURGY'}</span>
          <h2>{t('worshipSchedule')}</h2>
          {data.services.slice(0,3).map((service) => <div className="schedule-row" key={service.id}><Clock3 size={18}/><div><strong>{pick(service,'name')}</strong><span>{pick(service,'day')} • {service.time}</span></div></div>)}
          <div className="schedule-row"><MapPin size={18}/><div><strong>{t('location')}</strong><span>Nellikunnam, Kollam, Kerala</span></div></div>
        </div>
        <div className="cross-art">☦</div>
      </div>
    </section>
  </>;
}
