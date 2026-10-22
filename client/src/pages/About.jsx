import { useEffect, useState } from 'react';
import { Shield, Landmark } from 'lucide-react';
import { request } from '../api';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';

export default function About() {
  const [leaders, setLeaders] = useState([]);
  const { t, pick, lang } = useLanguage();
  const dual=(en,ml)=>lang==='ml'?ml:en;
  useEffect(() => { request('/public/bootstrap').then(d => setLeaders(d.leaders || [])); }, []);
  return <>
    <PageHero title={t('aboutTitle')} subtitle={t('aboutSub')} />
    <section className="section page-shell split-story">
      <div><span className="eyebrow burgundy">{dual('OUR STORY','നമ്മുടെ കഥ')}</span><h2>{t('journey')}</h2><p>{dual('The history of St. George Orthodox Church, Nellikunnam, is a testimony to enduring faith and dedication. Established to serve the spiritual needs of the local Orthodox faithful, the parish has grown from a humble gathering into a vibrant center of worship and community life.','നെല്ലിക്കുന്നം സെന്റ് ജോർജ് ഓർത്തഡോക്സ് ചർച്ചിന്റെ ചരിത്രം സ്ഥിരതയുള്ള വിശ്വാസത്തിന്റെയും സമർപ്പണത്തിന്റെയും സാക്ഷ്യമാണ്. പ്രാദേശിക ഓർത്തഡോക്സ് വിശ്വാസികളുടെ ആത്മീയ ആവശ്യങ്ങൾ നിറവേറ്റാൻ ആരംഭിച്ച ഇടവക ഇന്ന് സജീവമായ ആരാധനാ-സമൂഹ കേന്ദ്രമായി വളർന്നു.')}</p><p>{dual('Through decades of trials and triumphs, the church has preserved rich liturgical traditions, sacraments and teachings inherited from the Apostles.','കാലഘട്ടങ്ങളിലൂടെ നിരവധി പരീക്ഷണങ്ങളും നേട്ടങ്ങളും മറികടന്ന് സഭ അപ്പസ്തോലന്മാരിൽ നിന്ന് ലഭിച്ച സമ്പന്നമായ ആരാധനാപാരമ്പര്യവും കൂദാശകളും ഉപദേശങ്ങളും സംരക്ഷിച്ചു വരുന്നു.')}</p></div>
      <div className="heritage-art"><Landmark size={62}/><span>{dual('Historic Church Photograph','ചരിത്രപ്രസിദ്ധമായ പള്ളി ചിത്രം')}</span></div>
    </section>
    <section className="section muted-section"><div className="page-shell patron-card"><div className="patron-art"></div><div><span className="eyebrow burgundy">{t('patron')}</span><h2>{dual('St. George (Geevarghese Sahada)','വിശുദ്ധ ഗീവർഗീസ് സഹദാ')}</h2><p>{dual('St. George, known affectionately as Geevarghese Sahada, is venerated as a Great Martyr and wonderworker. His unwavering faith in Christ and courage remain an inspiration for our parish.','ഗീവർഗീസ് സഹദാ എന്നറിയപ്പെടുന്ന വിശുദ്ധ ഗീവർഗീസ് മഹാസഹദായും അത്ഭുതപ്രവർത്തകനുമായാണ് ആദരിക്കപ്പെടുന്നത്. ക്രിസ്തുവിലുള്ള അദ്ദേഹത്തിന്റെ അചഞ്ചല വിശ്വാസവും ധൈര്യവും നമ്മുടെ ഇടവകയ്ക്ക് പ്രചോദനമാണ്.')}</p></div></div></section>
    <section className="section page-shell"><div className="section-heading"><h2>{t('leadership')}</h2><span/></div><div className="card-grid three">{leaders.map(l => <article className="leader-card" key={l.id}><div className="avatar"><Shield/></div><h3>{pick(l,'name')}</h3><p>{pick(l,'role')}</p></article>)}</div></section>
    <section className="section muted-section"><div className="page-shell"><div className="section-heading"><h2>{t('milestones')}</h2><span/></div><div className="timeline">{(lang==='ml'?['ഇടവകയുടെ സ്ഥാപനം','ആദ്യ പള്ളിയുടെ കൂദാശ','ഭദ്രാസനത്തിൽ ഉൾപ്പെടുത്തൽ']:['Founding of the Parish','Consecration of the First Church','Diocesan Incorporation']).map((x,i)=><div className="timeline-item" key={x}><b>{i===0?'19XX':i===1?'19XX':'20XX'}</b><div><h3>{x}</h3><p>{dual('A meaningful milestone in the spiritual journey and growth of the parish community.','ഇടവക സമൂഹത്തിന്റെ ആത്മീയ യാത്രയിലും വളർച്ചയിലും ഒരു പ്രധാന നാഴികക്കല്ല്.')}</p></div></div>)}</div></div></section>
  </>;
}
