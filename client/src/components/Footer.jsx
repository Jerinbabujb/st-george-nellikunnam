import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="footer-grid page-shell">
        <div>
          <h3>St. George Orthodox Church</h3>
          <p>Nellikunnam, Kollam, Kerala - 691527</p>
          <p>© 2026 St. George Orthodox Church, Nellikunnam.</p>
        </div>
        <div>
          <h4>{t('home')}</h4>
          <Link to="/about">{t('about')}</Link>
          <Link to="/worship">{t('worship')}</Link>
          <Link to="/organizations">{t('organizations')}</Link>
        </div>
        <div>
          <h4>{t('contact')}</h4>
          <Link to="/notice-board">{t('notice')}</Link>
          <Link to="/contact">{t('contact')}</Link>
          <Link to="/login">{t('login')}</Link>
        </div>
        <div>
          <h4>{t('worshipSchedule')}</h4>
          <p>Sunday Holy Qurbana: 8:30 AM</p>
          <p>Evening Prayer: 6:00 PM</p>
        </div>
      </div>
    </footer>
  );
}
