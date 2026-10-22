import { useContext, useEffect, useState } from 'react';
import { Clock3, Sparkles, Droplets, Heart, Church } from 'lucide-react';
import { request } from '../api';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import { ServicesContext } from '../context/ServicesContext';

export default function Worship() {
    const { get_services} = useContext(ServicesContext);
  const [services, setServices] = useState([]);
  const { t, pick, lang } = useLanguage();

  const dual = (en, ml) => (lang === 'ml' ? ml : en);

  useEffect(() => {
    const fetchServices=async()=>{
      const services= await get_services();
      setServices(services.service);
    }
    fetchServices();
  }, []);

  return (
    <>
      <PageHero title={t('worshipTitle')} subtitle={t('worshipSub')} />
      
      <section className="section page-shell worship-grid">
        <div className="service-panel">
          <h2>
            <Clock3 size={22} />
            {t('regular')}
          </h2>
          {services.map((s) => (
            <div className="service-line" key={s.id}>
              <div>
                <small>{pick(s, 'day')}</small>
                <strong>
                  {pick(s, 'name')} <em>({pick(s, 'note')})</em>
                </strong>
              </div>
              <span>{s.time}</span>
            </div>
          ))}
        </div>

        <aside className="festival-panel">
          <h2>
            <Sparkles size={20} />
            {t('festivals')}
          </h2>
          <div className="festival-card">
            <small>{dual('May 6th - 8th', 'മേയ് 6 - 8')}</small>
            <strong>
              {dual('Feast of St. George (Perunnal)', 'വിശുദ്ധ ഗീവർഗീസിന്റെ പെരുന്നാൾ')}
            </strong>
            <p>
              {dual(
                "Our patron saint's feast with special masses, processions and parish fellowship.",
                'പ്രത്യേക കുർബാന, റാസ, ഇടവക കൂട്ടായ്മ എന്നിവയോടെയുള്ള മദ്ധ്യസ്ഥന്റെ പെരുന്നാൾ.'
              )}
            </p>
          </div>
          <div className="festival-card">
            <small>{dual('March / April', 'മാർച്ച് / ഏപ്രിൽ')}</small>
            <strong>
              {dual('Holy Week & Easter', 'വിശുദ്ധ വാരവും ഈസ്റ്ററും')}
            </strong>
          </div>
        </aside>
      </section>

      <section className="section muted-section">
        <div className="page-shell narrow">
          <div className="section-heading">
            <h2>{t('specialServices')}</h2>
            <span />
          </div>
          {[
            [
              Droplets,
              dual('Holy Baptism', 'വിശുദ്ധ മാമോദീസ'),
              dual(
                'The Sacrament of Holy Baptism is the foundation of Christian life. Please contact the parish office in advance.',
                'വിശുദ്ധ മാമോദീസ ക്രിസ്തീയ ജീവിതത്തിന്റെ അടിസ്ഥാനം ആണ്. മുൻകൂട്ടി ഇടവക ഓഫീസുമായി ബന്ധപ്പെടുക.'
              ),
            ],
            [
              Heart,
              dual('Holy Matrimony', 'വിശുദ്ധ വിവാഹം'),
              dual(
                'Marriage preparation and sacramental arrangements are coordinated through the parish office.',
                'വിവാഹത്തിനുള്ള തയ്യാറെടുപ്പുകളും കൂദാശാ ക്രമീകരണങ്ങളും ഇടവക ഓഫീസ് മുഖേന ഏകോപിപ്പിക്കുന്നു.'
              ),
            ],
            [
              Church,
              dual('Memorial Services', 'ഓർമ്മ ശുശ്രൂഷകൾ'),
              dual(
                'Memorial prayers and services are available for parish families upon request.',
                'ഇടവക കുടുംബങ്ങൾക്ക് ആവശ്യാനുസരണം ഓർമ്മപ്രാർത്ഥനകളും ശുശ്രൂഷകളും ലഭ്യമാണ്.'
              ),
            ],
          ].map(([Icon, name, note], i) => (
            <details className="accordion" key={name} open={i === 0}>
              <summary>
                <Icon size={18} />
                {name}
              </summary>
              <p>{note}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}