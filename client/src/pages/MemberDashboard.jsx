import { useEffect, useState } from 'react';
import { Plus, Save, Trash2, UserRound, Users } from 'lucide-react';
import { request } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const emptyFamily = { name: '', name_ml: '', relation: '', relation_ml: '', phone: '', dob: '' };

export default function MemberDashboard() {
  const { user, setUser } = useAuth();
  const { t } = useLanguage();
  useEffect(()=>{
    console.log("user",user);
  },[]);
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState(user || {});
  const [family, setFamily] = useState([]);
  const [newMember, setNewMember] = useState(emptyFamily);
  const [message, setMessage] = useState('');

  const loadFamily = () => request('/member/family').then(d => setFamily(d.family || []));

  useEffect(() => {
    request('/member/profile').then(d => setProfile(d.profile));
    loadFamily();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    const d = await request('/member/profile', { method: 'PUT', body: JSON.stringify(profile) });
    setProfile(d.profile);
    setUser(d.profile);
    setMessage('Profile saved successfully.');
  };

  const addFamily = async (e) => {
    e.preventDefault();
    await request('/member/family', { method: 'POST', body: JSON.stringify(newMember) });
    setNewMember(emptyFamily);
    loadFamily();
    setMessage('Family member added.');
  };

  const deleteFamily = async (id) => {
    if (!confirm('Remove this family member?')) return;
    await request(`/member/family/${id}`, { method: 'DELETE' });
    loadFamily();
  };

  return (
    <section className="dashboard page-shell">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow burgundy">PARISH MEMBER</span>
          <h1>{t('memberArea')}</h1>
          <p>{profile.name} {profile.ward}</p>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>
          <UserRound />
          {t('profile')}
        </button>
        <button className={tab === 'family' ? 'active' : ''} onClick={() => setTab('family')}>
          <Users />
          {t('family')}
        </button>
      </div>

      {message && <div className="success banner">{message}</div>}

      {tab === 'profile' ? (
        <form className="dashboard-card form-stack" onSubmit={saveProfile}>
          <div className="form-grid">
            <label>
              {t('fullName')}
              <input value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            </label>
            <label>
              {t('nameMalayalam')}
              <input value={profile.name_ml || ''} onChange={e => setProfile({ ...profile, name_ml: e.target.value })} />
            </label>
          </div>
          
          <div className="form-grid">
            <label>
              {t('phone')}
              <input value={profile.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
            </label>
            <label>
              {t('ward')}
              <input value={profile.ward || ''} onChange={e => setProfile({ ...profile, ward: e.target.value })} />
            </label>
          </div>
          
          <label>
            {t('house')}
            <input value={profile.house || ''} onChange={e => setProfile({ ...profile, house: e.target.value })} />
          </label>
          <label>
            {t('address')}
            <textarea value={profile.address || ''} onChange={e => setProfile({ ...profile, address: e.target.value })} />
          </label>
          
          <button className="btn btn-burgundy">
            <Save size={16} />
            {t('save')}
          </button>
        </form>
      ) : (
        <div className="member-family-layout">
          <div className="dashboard-card">
            <h2>{t('familyMembers')}</h2>
            {user.family.length === 0 && <p>No family members added yet.</p>}
            
            {user.family.map(f => (
              <div className="family-row" key={f.id}>
                <div>
                  <strong>{f.name}</strong>
                  <span>{f.name_ml}</span>
                  <small>
                    {f.relation} {f.phone || 'No phone'} {f.dob || 'DOB not set'}
                  </small>
                </div>
                <button className="icon-danger" onClick={() => deleteFamily(f.id)}>
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>

          <form className="dashboard-card form-stack" onSubmit={addFamily}>
            <h2>
              <Plus size={20} />
              {t('addFamily')}
            </h2>
            
            <label>
              {t('fullName')}
              <input required value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} />
            </label>
            <label>
              {t('nameMalayalam')}
              <input value={newMember.name_ml} onChange={e => setNewMember({ ...newMember, name_ml: e.target.value })} />
            </label>
            
            <div className="form-grid">
              <label>
                {t('relation')}
                <input required value={newMember.relation} onChange={e => setNewMember({ ...newMember, relation: e.target.value })} />
              </label>
              <label>
                Relation (Malayalam)
                <input value={newMember.relation_ml} onChange={e => setNewMember({ ...newMember, relation_ml: e.target.value })} />
              </label>
            </div>
            
            <div className="form-grid">
              <label>
                {t('phone')}
                <input value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} />
              </label>
              <label>
                {t('dob')}
                <input type="date" value={newMember.dob} onChange={e => setNewMember({ ...newMember, dob: e.target.value })} />
              </label>
            </div>
            
            <button className="btn btn-burgundy">
              <Plus size={16} />
              {t('addFamily')}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}