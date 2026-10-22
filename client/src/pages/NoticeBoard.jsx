import { useContext, useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { request } from '../api';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import { ServicesContext } from '../context/ServicesContext';

export default function NoticeBoard() {
    const { get_notices} = useContext(ServicesContext);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const { t, pick } = useLanguage();

  useEffect(() => {
    const fetchNotices=async()=>{
      const notices= await get_notices();
      setItems(notices.notice);
    }
    fetchNotices();
  }, []);

  const cats = useMemo(
    () => ['All', ...new Set(items.map((x) => x.category))],
    [items]
  );

  const shown = filter === 'All' ? items : items.filter((x) => x.category === filter);

  return (
    <>
      <PageHero title={t('noticeTitle')} subtitle={t('noticeSub')} />
      <section className="section page-shell">
        <div className="filter-row">
          {cats.map((c) => (
            <button
              className={filter === c ? 'active' : ''}
              onClick={() => setFilter(c)}
              key={c}
            >
              {c === 'All' ? t('all') : c}
            </button>
          ))}
        </div>
        <div className="card-grid three">
          {shown.map((item) => (
            <article
              className={`notice-card ${item.featured ? 'featured' : ''}`}
              key={item.id}
            >
              <div className="notice-meta">
                <span>{item.category}</span>
                <time>{new Date(item.date).toLocaleDateString()}</time>
              </div>
              <h2>{pick(item, 'title')}</h2>
              <p>{pick(item, 'description')}</p>
              <button className="read-link">
                {t('readMore')} <ArrowRight size={15} />
              </button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}