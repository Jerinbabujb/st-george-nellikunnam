import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';

export default function Contact(){
  const {t,lang}=useLanguage(); const dual=(en,ml)=>lang==='ml'?ml:en; const [sent,setSent]=useState(false);
  const submit=e=>{e.preventDefault();setSent(true);e.currentTarget.reset();};
  return <><PageHero title={t('contactTitle')} subtitle={t('contactSub')}/><section className="section page-shell contact-layout"><div className="contact-stack"><div className="info-card"><h2><MapPin size={21}/>{t('location')}</h2><p>St. George Orthodox Church<br/>Sadanandapuram - Plappally - Nellikunnam Road,<br/>Nellikunnam, Kollam, Kerala - 691527</p></div><div className="info-card"><h2><Phone size={21}/>{t('contact')}</h2><p>Vicar: +91 XXXXX XXXXX</p><p><Mail size={15}/> info@stgeorgenellikunnam.org</p></div></div><form className="message-card" onSubmit={submit}><h2>{t('sendMessage')}</h2><div className="form-grid"><label>{t('fullName')}<input required/></label><label>{t('phone')}<input required/></label></div><label>{t('email')}<input type="email" required/></label><label>{t('message')}<textarea rows="6" required/></label><button className="btn btn-burgundy">{t('send')} <Send size={16}/></button>{sent&&<p className="success">{dual('Thank you. Your message has been recorded in this demo.','നന്ദി. നിങ്ങളുടെ സന്ദേശം ഈ ഡെമോയിൽ രേഖപ്പെടുത്തി.')}</p>}</form></section><section className="section page-shell"><div className="map-placeholder"><MapPin size={46}/><h2>{dual('Find Us on Google Maps','ഗൂഗിൾ മാപ്പിൽ കണ്ടെത്തുക')}</h2><p>{dual("Replace this placeholder with the church's final Google Maps embed or coordinates.",'പള്ളിയുടെ അന്തിമ Google Maps ലിങ്ക് അല്ലെങ്കിൽ കോർഡിനേറ്റുകൾ ഇവിടെ ചേർക്കുക.')}</p></div></section></>;
}
