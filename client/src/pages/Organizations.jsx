import { useContext, useEffect, useState } from 'react';
import { GraduationCap, Users, HandHeart, Home as HomeIcon, ArrowRight } from 'lucide-react';
import { request } from '../api';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import { ServicesContext } from '../context/ServicesContext';

const icons = [GraduationCap, Users, HandHeart, HomeIcon];

export default function Organizations() {
    const { get_organizations} = useContext(ServicesContext);
  const [items, setItems] = useState([]);
  const { t, pick } = useLanguage();

  useEffect(() => {
    const fetchOrganizations=async()=>{
      const organizations = await get_organizations();
      setItems(organizations.organization);
    }
    fetchOrganizations();
  }, []);

  return (
    <>
      <PageHero title={t('orgTitle')} subtitle={t('orgSub')} />
      <section className="section page-shell">
        <div className="card-grid two">
          {items.map((o, i) => {
            const Icon = icons[i % icons.length];
            return (
              <article className="org-card" key={o.id}>
                <div className="circle-icon">
                  <Icon />
                </div>
                <h2>{pick(o, 'title')}</h2>
                <p>{pick(o, 'description')}</p>
                <button className="btn btn-burgundy btn-small">
                  {t('learnMore')} <ArrowRight size={15} />
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}