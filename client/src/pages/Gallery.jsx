import PageHero from '../components/PageHero';
import { useLanguage } from '../context/LanguageContext';

const photos = [
  'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1548625361-58a9b86aa83b?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1514896856000-91cb6de818e0?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1000&q=80'
];

export default function Gallery(){
  const {lang}=useLanguage();
  const title=lang==='ml'?'ഇടവക ഗാലറി':'Parish Gallery';
  const subtitle=lang==='ml'?'ആരാധന, പെരുന്നാൾ, ശുശ്രൂഷ, ഇടവക കൂട്ടായ്മകളുടെ ഓർമ്മകൾ.':'Moments from worship, feasts, ministries and parish fellowship.';
  return <><PageHero title={title} subtitle={subtitle}/><section className="section page-shell"><div className="gallery-grid">{photos.map((src,i)=><figure className="gallery-item" key={src}><img src={src} alt={`Church gallery ${i+1}`} loading="lazy"/><figcaption>{lang==='ml'?`ഇടവക ഓർമ്മ ${i+1}`:`Parish Moment ${i+1}`}</figcaption></figure>)}</div></section></>;
}
