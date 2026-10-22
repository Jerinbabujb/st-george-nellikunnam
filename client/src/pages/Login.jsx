import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  // Context & Hooks
  const { login } = useAuth();
  const { t } = useLanguage();
  const nav = useNavigate();

  // State
  const [form, setForm] = useState({
    email: 'member@stgeorge.org',
    password: 'Member@123'
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Handlers
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    
    try {
      const user = await login(form.email, form.password);
      nav(user.role === 'admin' ? '/admin' : '/member');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  // Render
  return (
    <section className="auth-section">
      <div className="auth-card">
        
        <div className="auth-icon">
          <LockKeyhole />
        </div>
        
        <h1>{t('loginTitle')}</h1>
        <p>{t('loginSub')}</p>
        
        <form onSubmit={submit}>
          <label>
            {t('email')}
            <input 
              type="email" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              required 
            />
          </label>
          
          <label>
            {t('password')}
            <input 
              type="password" 
              value={form.password} 
              onChange={(e) => setForm({ ...form, password: e.target.value })} 
              required 
            />
          </label>
          
          {error && <p className="error">{error}</p>}
          
          <button className="btn btn-burgundy full" disabled={busy}>
            {busy ? 'Signing in...' : t('login')}
          </button>
        </form>
        
        <div className="demo-box">
          <strong>Demo credentials</strong>
          <span>Member: member@stgeorge.org / Member@123</span>
          <span>Admin: admin@stgeorge.org / Admin@123</span>
        </div>
        
        <small>{t('noAccount')}</small>
      </div>
    </section>
  );
}