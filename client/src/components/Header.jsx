import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Globe2, Menu, X, UserRound } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const nav = [
    ['/', t('home')], ['/about', t('about')], ['/worship', t('worship')], ['/organizations', t('organizations')], ['/notice-board', t('notice')], ['/gallery', t('gallery')], ['/contact', t('contact')]
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>St. George Orthodox Church</Link>
        <nav className={`main-nav ${open ? 'open' : ''}`}>
          {nav.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}
          {user && <NavLink to="/directory" onClick={() => setOpen(false)}>{t('directory')}</NavLink>}
        </nav>
        <div className="header-actions">
          <button className="lang-toggle" onClick={() => setLang(lang === 'en' ? 'ml' : 'en')} aria-label="Change language">
            <Globe2 size={16} /> {lang === 'en' ? 'മലയാളം' : 'English'}
          </button>
          {user ? (
            <div className="account-actions">
              <Link className="btn btn-burgundy btn-small" to={user.role === 'admin' ? '/admin' : '/member'}><UserRound size={15}/>{user.role === 'admin' ? t('admin') : t('memberArea')}</Link>
              <button className="text-button" onClick={logout}>{t('logout')}</button>
            </div>
          ) : <Link className="btn btn-burgundy btn-small" to="/login">{t('login')}</Link>}
          <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Open menu">{open ? <X/> : <Menu/>}</button>
        </div>
      </div>
    </header>
  );
}
