import { useEffect, useMemo, useState, useContext } from 'react';
import { Mail, Phone, Search, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { request } from '../api';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import { AuthContext } from '../context/AuthContext';

export default function Directory() {
  // 1. State Management
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);
  // NEW: State to track which family cards are expanded
  const [expandedCards, setExpandedCards] = useState({}); 

  const { get_members } = useContext(AuthContext);
  const { t, lang } = useLanguage();

// 2. Data Fetching
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await get_members();
        
        console.log("Data received in component:", data); // Check your browser console!

        if (!data) return;

        // Check if the backend returned the array directly
        if (Array.isArray(data)) {
          setMembers(data);
        } 
        // Check if the backend wrapped it in an object { members: [...] }
        else if (Array.isArray(data.members)) {
          setMembers(data.members);
        }
        
      } catch (error) {
        console.error("Failed to fetch directory:", error.message);
      }
    };
    
    fetchMembers();
  }, []);

  // 3. Derived Data (Wards list & Filtering)
  const wards = useMemo(() => {
    const uniqueWards = new Set(members.map(m => m.ward).filter(Boolean));
    return ['All', ...uniqueWards];
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const searchString = `${member.name} ${member.name_ml || ''} ${member.phone || ''} ${member.house || ''}`.toLowerCase();
      const matchesSearch = searchString.includes(searchQuery.toLowerCase());
      const matchesWard = selectedWard === 'All' || member.ward === selectedWard;
      
      return matchesSearch && matchesWard;
    });
  }, [members, searchQuery, selectedWard]);

  // Helper function to handle Malayalam vs English naming logic
  const getDisplayName = (member) => {
    return lang === 'ml' && member.name_ml ? member.name_ml : member.name;
  };

  // NEW: Function to toggle family details open/closed
  const toggleFamilyDetails = (memberId) => {
    setExpandedCards(prev => ({
      ...prev,
      [memberId]: !prev[memberId] 
    }));
  };

  // 4. Render
  return (
    <>
      <PageHero title={t('directoryTitle')} subtitle={t('directorySub')} />
      
      <section className="section page-shell">
        <div className="directory-tools">
          <div className="searchbox">
            <Search size={20} />
            <input 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              placeholder={t('search')} 
            />
          </div>
          
          <select value={selectedWard} onChange={e => setSelectedWard(e.target.value)}>
            {wards.map(ward => (
              <option key={ward} value={ward}>
                {ward === 'All' ? t('allWards') : ward}
              </option>
            ))}
          </select>
        </div>
        
        <div className="directory-grid">
          {filteredMembers.map(member => {
            const displayName = getDisplayName(member);
            const totalFamilyMembers = member.family ? member.family.length : 0;
            const isExpanded = expandedCards[member.id]; // Check if this specific card is open

            return (
              <article className="family-card" key={member.id}>
                <div className="member-avatar">
                  {member.image_url?(
                <img src={member.image_url} onClick={()=>setLightboxImage(member.image_url)} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor:'pointer' }}/>  
          ):(
             displayName.charAt(0).toUpperCase()
          )
                }
                  
                </div>
                
                <div>
                  <h3>{member.roll_no}</h3>
                  <h3>{displayName}</h3>
                  
                  <p>{member.house}</p>
                  
                  {member.ward && (
                    <span className="ward-pill">{member.ward}</span>
                  )}
                  
                  <div className="icon-row">
                    {member.phone && (
                      <a href={`tel:${member.phone}`} title="Call">
                        <Phone size={18} />
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} title="Email">
                        <Mail size={18} />
                      </a>
                    )}
                  </div>
                </div>
                
             {/* UPDATE: Footer Toggle */}
                <div 
                  className="family-card-footer" 
                  onClick={() => totalFamilyMembers > 0 && toggleFamilyDetails(member.id)}
                  style={{ 
                    cursor: totalFamilyMembers > 0 ? 'pointer' : 'default',
                    borderBottom: isExpanded ? '1px solid var(--line)' : 'none'
                  }}
                >
                  <span>{t('familyMembers')}</span>
                  <b style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Users size={15} /> 
                    {totalFamilyMembers}
                    {totalFamilyMembers > 0 && (
                      isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </b>
                </div>

                {/* NEW: Expanded details section */}
                {isExpanded && totalFamilyMembers > 0 && (
                  <div className="family-details-dropdown">
                    <div className="family-details-header">
                      <span>{t('memberName') || 'Name'}</span>
                      <span>{t('relation') || 'Relation'}</span>
                    </div>

                    <div className="family-details-list">
                      {member.family.map((fam, index) => (
                        <div key={index} className="family-details-row">
                          <span className="family-name">{fam.name}</span>
                          <span className="relation-pill">{fam.relation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
        {/* --- LIGHTBOX OVERLAY --- */}
{lightboxImage && (
  <div 
    onClick={() => setLightboxImage(null)} // Close when clicking background
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999, // Ensures it stays on top of everything
      cursor: 'zoom-out'
    }}
  >
    <img 
      src={lightboxImage} 
      alt="Expanded view" 
      onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing it
      style={{
        maxWidth: '90%',
        maxHeight: '90%',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        cursor: 'default'
      }}
    />
    
    {/* Optional Close Button */}
    <button 
      onClick={() => setLightboxImage(null)}
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '2rem',
        cursor: 'pointer'
      }}
    >
      &times;
    </button>
  </div>
)}
      </section>
    </>
  );
}