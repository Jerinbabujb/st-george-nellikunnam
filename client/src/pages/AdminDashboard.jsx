import { useEffect, useState, useContext } from 'react';
import { Bell, Church, LayoutDashboard, Pencil, Plus, Save, Trash2, UserPlus, Users } from 'lucide-react';
import { request } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { ServicesContext } from '../context/ServicesContext';

const empty = {
  announcements: { category: 'General Announcements', category_ml: 'General Announcements', date: '', title: '', title_ml: '', description: '', description_ml: '', featured: false },
  services: { day: '', day_ml: '', name: '', name_ml: '', note: '', note_ml: '', time: '' },
  organizations: { title: '', title_ml: '', description: '', description_ml: '' }
};

export default function AdminDashboard() {
  const { add_members, get_members } = useContext(AuthContext);
  const { add_notice,add_services, add_organizations ,get_notices, get_services, get_organizations, get_Counts} = useContext(ServicesContext);
  const { t } = useLanguage();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty.announcements);
  const [editId, setEditId] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberForm, setMemberForm] = useState({ name: '', name_ml: '', email: '', phone: '', ward: '', house: '',image_url:'', password: 'Member@123', roll_no: '', family: [] });
  const [message, setMessage] = useState('');

  // const loadStats = () => request('/admin/stats').then(setStats);
  // const loadMembers = () => request('/admin/members').then(d => setMembers(d.members || []));
  // const loadCollection = async collection => { const d = await request(`/admin/${collection}`); setItems(d.items || []); setForm({ ...empty[collection] }); setEditId(null); };

  useEffect(()=>{
 const fetchCount=async()=>{
  const countData= await get_Counts();
  setStats(countData);
 }
 fetchCount();
  },[])
  const add_notices = async (e) => {
    e.preventDefault();
    await add_notice(form);
    setMessage(editId ? 'Announcement updated.' : 'Announcement added.');
    loadCollection(tab);
    loadStats();
  };

  const add_service=async(e)=>{
    e.preventDefault();
    await add_services(form);
    loadCollection(tab);
  }

  const add_organization=async(e)=>{
    e.preventDefault();
    console.log(form);
    await add_organizations(form);
    loadCollection(tab);
  }

  const loadTabItems=async(currentTab)=>{
  try{
    if(currentTab==='announcements'){
      const notices = await get_notices();
      setItems(notices.notice);
    }
    else if(currentTab==='services'){
      const services = await get_services();
      setItems(services.service);
    }
    else if(currentTab==='organizations'){
      const organizations= await get_organizations();
      setItems(organizations.organization);
    }
  }
  catch(error){
    console.log(error);
    setItems([]);
  }
  }

  useEffect(()=>{
    console.log(tab);
    if(['announcements', 'services', 'organizations'].includes(tab)){
      loadTabItems(tab);
    }
  },[tab])


  useEffect(() => {
    const fetchMembers = async () => {
      const data = await get_members();
      setMembers(data || []);
    }
    fetchMembers();
  }, []);

  // useEffect(() => { loadStats(); loadMembers(); }, []);
  // useEffect(() => { if (['announcements', 'services', 'organizations'].includes(tab)) loadCollection(tab); }, [tab]);

  // const selectEdit = item => { setEditId(item.id); setForm({ ...item }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const saveItem = async e => { e.preventDefault(); const method = editId ? 'PUT' : 'POST'; const path = editId ? `/admin/${tab}/${editId}` : `/admin/${tab}`; await request(path, { method, body: JSON.stringify(form) }); setMessage(editId ? 'Item updated.' : 'Item added.'); await loadCollection(tab); loadStats(); };
  const removeItem = async id => { if (!window.confirm('Delete this item?')) return; await request(`/admin/${tab}/${id}`, { method: 'DELETE' }); loadCollection(tab); loadStats(); };
  
  const createMember = async e => {
    e.preventDefault();
    await add_members(memberForm);
    setMemberForm({ name: '', name_ml: '', email: '', phone: '', ward: '', house: '', password: 'Member@123', roll_no: '', family: [] });
    setMessage('Member account created.'); loadStats();
  };

  const handleFamilyChange = (index, field, value) => {
    const updatedFamily = [...(memberForm.family || [])];
    updatedFamily[index][field] = value;
    setMemberForm({ ...memberForm, family: updatedFamily });
  };

  const addFamilyMember = () => {
    setMemberForm({
      ...memberForm,
      family: [...(memberForm.family || []), { name: '', relation: '' }]
    });
  };

  const removeFamilyMember = (index) => {
    const updatedFamily = memberForm.family.filter((_, i) => i !== index);
    setMemberForm({ ...memberForm, family: updatedFamily });
  };

  const toggleMember = async m => { await request(`/admin/members/${m.id}`, { method: 'PUT', body: JSON.stringify({ active: m.active === false ? true : false }) }); loadMembers(); };

  return (
    <section className="dashboard admin-dashboard page-shell">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow burgundy">CONTENT & MEMBERSHIP</span>
          <h1>{t('adminDashboard')}</h1>
          <p>Manage parish content, service timings, organizations and member access.</p>
        </div>
      </div>
      
      <div className="admin-tabs">
        <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}><LayoutDashboard />Overview</button>
        <button className={tab === 'announcements' ? 'active' : ''} onClick={() => setTab('announcements')}><Bell />Announcements</button>
        <button className={tab === 'services' ? 'active' : ''} onClick={() => setTab('services')}><Church />Services</button>
        <button className={tab === 'organizations' ? 'active' : ''} onClick={() => setTab('organizations')}><Users />Organizations</button>
        <button className={tab === 'members' ? 'active' : ''} onClick={() => setTab('members')}><UserPlus />Members</button>
      </div>

      {message && <div className="success banner">{message}</div>}

      {tab === 'overview' && (
        <div className="stats-grid">
          {[['Members', stats.members || 0],  ['Announcements', stats.notices || 0], ['Service Timings', stats.services || 0], ['Organizations', stats.organization || 0]].map(([k, v]) => (
            <div className="stat-card" key={k}><span>{k}</span><strong>{v}</strong></div>
          ))}
        </div>
      )}

      {['announcements', 'services', 'organizations'].includes(tab) && (
        <div className="admin-content-grid">
          
          {/* SECTION: ANNOUNCEMENTS */}
          {tab === 'announcements' && (
            <form className="dashboard-card form-stack sticky-form" onSubmit={add_notices}>
              <h2>{editId ? <><Pencil /> Edit Item</> : <><Plus /> {t('addNew')}</>}</h2>
              <div className="form-grid">
                <label>{t('category')}<select value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })}><option>General Announcements</option><option>Feasts</option><option>Obituaries</option><option>Charity</option></select></label>
                <label>{t('category (Malayalam)')}<select value={form.category_ml || ''} onChange={e => setForm({ ...form, category_ml: e.target.value })}><option>General Announcements</option><option>Feasts</option><option>Obituaries</option><option>Charity</option></select></label>
                <label>{t('date')}<input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} /></label>
              </div>
              <div className="form-grid">
                <label>{t('titleEnglish')}<input required value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
                <label>{t('titleMalayalam')}<input value={form.title_ml || ''} onChange={e => setForm({ ...form, title_ml: e.target.value })} /></label>
              </div>
              <div className="form-grid">
                <label>{t('descriptionEnglish')}<textarea required value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
                <label>{t('descriptionMalayalam')}<textarea value={form.description_ml || ''} onChange={e => setForm({ ...form, description_ml: e.target.value })} /></label>
              </div>
              <label className="check-label"><input type="checkbox" checked={!!form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> Featured announcement</label>
              
              <div className="button-row">
                <button type='submit' className="btn btn-burgundy"><Save size={16} />{editId ? 'Update' : 'Save'}</button>
                {editId && <button type="button" className="btn btn-ghost" onClick={() => { setEditId(null); setForm({ ...empty[tab] }) }}>Cancel</button>}
              </div>
            </form>
          )}

          {/* SECTION: SERVICES */}
          {tab === 'services' && (
            <form className="dashboard-card form-stack sticky-form" onSubmit={add_service}>
              <h2>{editId ? <><Pencil /> Edit Item</> : <><Plus /> {t('addNew')}</>}</h2>
              <div className="form-grid">
                <label>{t('dayEnglish')}<input required value={form.day || ''} onChange={e => setForm({ ...form, day: e.target.value })} /></label>
                <label>{t('dayMalayalam')}<input value={form.day_ml || ''} onChange={e => setForm({ ...form, day_ml: e.target.value })} /></label>
              </div>
              <div className="form-grid">
                <label>Service Name (English)<input required value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
                <label>Service Name (Malayalam)<input value={form.name_ml || ''} onChange={e => setForm({ ...form, name_ml: e.target.value })} /></label>
              </div>
              <div className="form-grid">
                <label>Note (English)<input value={form.note || ''} onChange={e => setForm({ ...form, note: e.target.value })} /></label>
                <label>Note (Malayalam)<input value={form.note_ml || ''} onChange={e => setForm({ ...form, note_ml: e.target.value })} /></label>
              </div>
              <label>{t('time')}<input required value={form.time || ''} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="8:30 AM" /></label>
              
              <div className="button-row">
                <button type="submit" className="btn btn-burgundy"><Save size={16} />{editId ? 'Update' : 'Save'}</button>
                {editId && <button type="button" className="btn btn-ghost" onClick={() => { setEditId(null); setForm({ ...empty[tab] }) }}>Cancel</button>}
              </div>
            </form>
          )}

          {/* SECTION: ORGANIZATIONS */}
          {tab === 'organizations' && (
            <form className="dashboard-card form-stack sticky-form" onSubmit={add_organization}>
              <h2>{editId ? <><Pencil /> Edit Item</> : <><Plus /> {t('addNew')}</>}</h2>
              <div className="form-grid">
                <label>{t('titleEnglish')}<input required value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
                <label>{t('titleMalayalam')}<input value={form.title_ml || ''} onChange={e => setForm({ ...form, title_ml: e.target.value })} /></label>
              </div>
              <div className="form-grid">
                <label>{t('descriptionEnglish')}<textarea required value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
                <label>{t('descriptionMalayalam')}<textarea value={form.description_ml || ''} onChange={e => setForm({ ...form, description_ml: e.target.value })} /></label>
              </div>
              
              <div className="button-row">
                <button type="submit" className="btn btn-burgundy"><Save size={16} />{editId ? 'Update' : 'Save'}</button>
                {editId && <button type="button" className="btn btn-ghost" onClick={() => { setEditId(null); setForm({ ...empty[tab] }) }}>Cancel</button>}
              </div>
            </form>
          )}

          {/* SHARED LIST RENDERER FOR ITEMS */}
          <div className="dashboard-card">
            <h2>Current {tab}</h2>
            <div className="admin-list">
              {items.map(item => (
                <div className="admin-list-row" key={item.id}>
                  <div>
                    <strong>{item.title_en || item.name || item.title || `${item.day_en} — ${item.time}`}</strong>
                    <span>{item.title_ml || item.name_ml || item.note_en || ''}</span>
                  </div>
                  <div className="row-actions">
                    <button onClick={() => selectEdit(item)}><Pencil /></button>
                    <button className="danger" onClick={() => removeItem(item.id)}><Trash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: MEMBERS */}
      {tab === 'members' && (
        <div className="admin-content-grid">
          <form className="dashboard-card form-stack sticky-form" onSubmit={createMember}>
            <h2><UserPlus /> {t('createMember')}</h2>

            <div className="form-grid">
              <label>{t('Roll Number')}<input value={memberForm.roll_no || ''} onChange={e => setMemberForm({ ...memberForm, roll_no: e.target.value })} /></label>
              <label>{t('fullName')}<input required value={memberForm.name || ''} onChange={e => setMemberForm({ ...memberForm, name: e.target.value })} /></label>
              <label>{t('nameMalayalam')}<input value={memberForm.name_ml || ''} onChange={e => setMemberForm({ ...memberForm, name_ml: e.target.value })} /></label>
            </div>

            <label>{t('email')}<input type="email" required value={memberForm.email || ''} onChange={e => setMemberForm({ ...memberForm, email: e.target.value })} /></label>

            <div className="form-grid">
              <label>{t('phone')}<input value={memberForm.phone || ''} onChange={e => setMemberForm({ ...memberForm, phone: e.target.value })} /></label>
              <label>{t('ward')}<input value={memberForm.ward || ''} onChange={e => setMemberForm({ ...memberForm, ward: e.target.value })} /></label>
            </div>

            <label>{t('house')}<input value={memberForm.house || ''} onChange={e => setMemberForm({ ...memberForm, house: e.target.value })} /></label>
            <label>{t('image')}<input type='file' accept='image/*' onChange={e=>{const file=e.target.files[0]
              if(file){
                const reader= new FileReader();
                reader.onloadend=()=>{
                  setMemberForm({...memberForm,image_url:reader.result});
                }
                reader.readAsDataURL(file);
                  
              } }}/></label>
              {memberForm.image_url && (
  <img 
    src={memberForm.image_url} 
    alt="Preview" 
    style={{ width: '120px', height: '120px', objectFit: 'cover', marginTop: '10px' }} 
  />
)}
            <label>{t('password')}<input value={memberForm.password || ''} onChange={e => setMemberForm({ ...memberForm, password: e.target.value })} /></label>

            {/* --- DYNAMIC FAMILY SECTION --- */}
            <div className="family-section" style={{ borderTop: '1px solid #ccc', paddingTop: '10px', marginTop: '10px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>{t('familyMembers')}</h3>

              {(memberForm.family || []).map((member, index) => (
                <div key={index} className="form-grid" style={{ alignItems: 'end', marginBottom: '10px' }}>
                  <label>
                    {t('memberName')}
                    <input
                      value={member.name}
                      onChange={e => handleFamilyChange(index, 'name', e.target.value)}
                      placeholder="Name"
                    />
                  </label>
                  <label>
                    {t('relation')}
                    <input
                      value={member.relation}
                      onChange={e => handleFamilyChange(index, 'relation', e.target.value)}
                      placeholder="Relation (e.g., Son, Wife)"
                    />
                  </label>
                  <button
                    type="button"
                    className="btn"
                    style={{ padding: '8px', backgroundColor: '#ff4d4f', color: 'white' }}
                    onClick={() => removeFamilyMember(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button type="button" className="btn" onClick={addFamilyMember} style={{ marginBottom: '15px' }}>
                <Plus size={16} /> {t('addFamilyMember')}
              </button>
            </div>
            {/* ------------------------------ */}

            <button type="submit" className="btn btn-burgundy"><Plus size={16} />Create Member</button>
          </form>
          
          <div className="dashboard-card">
            <h2>Member Accounts</h2>
            <div className="admin-list">
              {members.map(m => (
                <div className="admin-list-row" key={m.id}>
                  <div>
                    <strong>{m.name}</strong>
                    <span>{m.email} - {m.ward || 'No ward'}</span>
                  </div>
                  <button className={`status-pill ${m.active === false ? 'off' : ''}`} onClick={() => toggleMember(m)}>
                    {m.active === false ? 'Inactive' : 'Active'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}