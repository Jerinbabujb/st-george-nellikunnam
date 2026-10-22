import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

const strings = {
  en: {
    home: 'Home', about: 'About Us', worship: 'Worship', organizations: 'Organizations', notice: 'Notice Board', contact: 'Contact', gallery: 'Gallery', directory: 'Directory', login: 'Secure Login', logout: 'Logout', memberArea: 'Member Area', admin: 'Admin', donate: 'Donate',
    heroTitle: 'Welcome to St. George Orthodox Church, Nellikunnam', heroButton: 'View Mass Timings',
    vicarsMessage: "Vicar's Message", welcomeQuote: 'Greetings in the name of the Lord. We welcome you to our parish family where faith meets tradition and community.',
    announcements: 'Latest Announcements', worshipSchedule: 'Worship Schedule', location: 'Location',
    aboutTitle: 'Our Heritage & Faith', aboutSub: 'Rooted in tradition, growing in faith. A legacy of devotion in Nellikunnam.', journey: 'The Journey of Faith', patron: 'Our Patron', leadership: 'Parish Leadership', milestones: 'Historical Milestones',
    worshipTitle: 'Worship & Services', worshipSub: 'Join us in our timeless liturgical traditions as we gather to celebrate faith, community, and the divine presence.', regular: 'Regular Service Timings', festivals: 'Major Festivals', specialServices: 'Special Services',
    orgTitle: 'Spiritual Organizations', orgSub: 'The vibrant community life of our parish is sustained through active ministries and fellowship.', learnMore: 'Learn More',
    noticeTitle: 'Notice Board & Announcements', noticeSub: 'Stay updated with the latest news, spiritual directives, and community events from our parish.', all: 'All', readMore: 'Read More',
    contactTitle: 'Get in Touch', contactSub: 'We welcome your inquiries, prayer requests, and visits. Reach out through the details below or send us a message directly.', sendMessage: 'Send us a Message', fullName: 'Full Name', phone: 'Phone Number', email: 'Email Address', message: 'Your Message', send: 'Send Message',
    directoryTitle: 'Parish Directory', directorySub: 'A secure and sacred space connecting our church family.', search: 'Search by Name, Phone, or House...', allWards: 'All Wards', familyMembers: 'Family Members',
    profile: 'My Profile', family: 'My Family', save: 'Save Changes', addFamily: 'Add Family Member', relation: 'Relation', dob: 'Date of Birth', house: 'House Name / Address', ward: 'Ward', address: 'Address', nameMalayalam: 'Name in Malayalam',
    adminDashboard: 'Admin Dashboard', members: 'Members', services: 'Services', content: 'Content Management', addNew: 'Add New', titleEnglish: 'Title (English)', titleMalayalam: 'Title (Malayalam)', descriptionEnglish: 'Description (English)', descriptionMalayalam: 'Description (Malayalam)', category: 'Category', date: 'Date', time: 'Time', dayEnglish: 'Day (English)', dayMalayalam: 'Day (Malayalam)', edit: 'Edit', delete: 'Delete', active: 'Active', createMember: 'Create Member', password: 'Password',
    loginTitle: 'Member & Admin Login', loginSub: 'Sign in to access the parish directory, your family profile, or the administration dashboard.', noAccount: 'For new parish access, please contact the church office.'
  },
  ml: {
    home: 'ഹോം', about: 'ഞങ്ങളേക്കുറിച്ച്', worship: 'ആരാധന', organizations: 'സംഘടനകൾ', notice: 'അറിയിപ്പുകൾ', contact: 'ബന്ധപ്പെടുക', gallery: 'ഗാലറി', directory: 'ഇടവക ഡയറക്ടറി', login: 'സുരക്ഷിത ലോഗിൻ', logout: 'ലോഗ് ഔട്ട്', memberArea: 'അംഗ മേഖല', admin: 'അഡ്മിൻ', donate: 'സംഭാവന',
    heroTitle: 'സെന്റ് ജോർജ് ഓർത്തഡോക്സ് ചർച്ച്, നെല്ലിക്കുന്നത്തിലേക്ക് സ്വാഗതം', heroButton: 'കുർബാന സമയം കാണുക',
    vicarsMessage: 'വികാരിയുടെ സന്ദേശം', welcomeQuote: 'കർത്താവിന്റെ നാമത്തിൽ ആശംസകൾ. വിശ്വാസവും പാരമ്പര്യവും സമൂഹവും കൈകോർക്കുന്ന നമ്മുടെ ഇടവക കുടുംബത്തിലേക്ക് സ്വാഗതം.',
    announcements: 'പുതിയ അറിയിപ്പുകൾ', worshipSchedule: 'ആരാധന സമയം', location: 'സ്ഥലം',
    aboutTitle: 'നമ്മുടെ പൈതൃകവും വിശ്വാസവും', aboutSub: 'പാരമ്പര്യത്തിൽ വേരൂന്നി, വിശ്വാസത്തിൽ വളരുന്ന നെല്ലിക്കുന്നത്തിന്റെ ആത്മീയ പൈതൃകം.', journey: 'വിശ്വാസയാത്ര', patron: 'നമ്മുടെ മദ്ധ്യസ്ഥൻ', leadership: 'ഇടവക നേതൃത്വം', milestones: 'ചരിത്ര നാഴികക്കല്ലുകൾ',
    worshipTitle: 'ആരാധനയും ശുശ്രൂഷകളും', worshipSub: 'വിശ്വാസവും സമൂഹവും ദൈവസാന്നിധ്യവും ആഘോഷിക്കുന്ന പാരമ്പര്യ ആരാധനകളിൽ ഞങ്ങളോടൊപ്പം ചേരുക.', regular: 'ക്രമമായ ശുശ്രൂഷാ സമയങ്ങൾ', festivals: 'പ്രധാന പെരുന്നാളുകൾ', specialServices: 'പ്രത്യേക ശുശ്രൂഷകൾ',
    orgTitle: 'ആത്മീയ സംഘടനകൾ', orgSub: 'സജീവമായ ശുശ്രൂഷകളും കൂട്ടായ്മകളും നമ്മുടെ ഇടവകയുടെ സമൂഹജീവിതത്തെ ശക്തിപ്പെടുത്തുന്നു.', learnMore: 'കൂടുതൽ അറിയുക',
    noticeTitle: 'അറിയിപ്പ് ബോർഡ്', noticeSub: 'ഇടവകയിലെ പുതിയ വാർത്തകൾ, ആത്മീയ നിർദ്ദേശങ്ങൾ, സമൂഹ പരിപാടികൾ എന്നിവ അറിയുക.', all: 'എല്ലാം', readMore: 'കൂടുതൽ വായിക്കുക',
    contactTitle: 'ബന്ധപ്പെടുക', contactSub: 'ചോദ്യങ്ങൾക്കും പ്രാർത്ഥനാ അഭ്യർത്ഥനകൾക്കും സന്ദർശനങ്ങൾക്കും ഞങ്ങളുമായി ബന്ധപ്പെടാം.', sendMessage: 'സന്ദേശം അയയ്ക്കുക', fullName: 'പൂർണ്ണ പേര്', phone: 'ഫോൺ നമ്പർ', email: 'ഇമെയിൽ', message: 'സന്ദേശം', send: 'അയയ്ക്കുക',
    directoryTitle: 'ഇടവക ഡയറക്ടറി', directorySub: 'നമ്മുടെ ഇടവക കുടുംബത്തെ ബന്ധിപ്പിക്കുന്ന സുരക്ഷിത ഇടം.', search: 'പേര്, ഫോൺ, വീട് എന്നിവ ഉപയോഗിച്ച് തിരയുക...', allWards: 'എല്ലാ വാർഡുകളും', familyMembers: 'കുടുംബാംഗങ്ങൾ',
    profile: 'എന്റെ പ്രൊഫൈൽ', family: 'എന്റെ കുടുംബം', save: 'മാറ്റങ്ങൾ സേവ് ചെയ്യുക', addFamily: 'കുടുംബാംഗത്തെ ചേർക്കുക', relation: 'ബന്ധം', dob: 'ജനന തീയതി', house: 'വീട്ടുപേര് / വിലാസം', ward: 'വാർഡ്', address: 'വിലാസം', nameMalayalam: 'മലയാളത്തിലുള്ള പേര്',
    adminDashboard: 'അഡ്മിൻ ഡാഷ്ബോർഡ്', members: 'അംഗങ്ങൾ', services: 'ശുശ്രൂഷകൾ', content: 'ഉള്ളടക്ക നിയന്ത്രണം', addNew: 'പുതിയത് ചേർക്കുക', titleEnglish: 'തലക്കെട്ട് (English)', titleMalayalam: 'തലക്കെട്ട് (മലയാളം)', descriptionEnglish: 'വിവരണം (English)', descriptionMalayalam: 'വിവരണം (മലയാളം)', category: 'വിഭാഗം', date: 'തീയതി', time: 'സമയം', dayEnglish: 'ദിവസം (English)', dayMalayalam: 'ദിവസം (മലയാളം)', edit: 'തിരുത്തുക', delete: 'നീക്കുക', active: 'സജീവം', createMember: 'അംഗത്തെ സൃഷ്ടിക്കുക', password: 'പാസ്‌വേഡ്',
    loginTitle: 'അംഗ / അഡ്മിൻ ലോഗിൻ', loginSub: 'ഇടവക ഡയറക്ടറി, കുടുംബ പ്രൊഫൈൽ അല്ലെങ്കിൽ അഡ്മിൻ ഡാഷ്ബോർഡ് ഉപയോഗിക്കാൻ സൈൻ ഇൻ ചെയ്യുക.', noAccount: 'പുതിയ ഇടവക പ്രവേശനത്തിനായി പള്ളി ഓഫീസുമായി ബന്ധപ്പെടുക.'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('church_lang') || 'en');
  useEffect(() => {
    localStorage.setItem('church_lang', lang);
    document.documentElement.lang = lang === 'ml' ? 'ml' : 'en';
  }, [lang]);
  const value = useMemo(() => ({ lang, setLang, t: (key) => strings[lang][key] || strings.en[key] || key, pick: (item, base) => item?.[`${base}_${lang}`] || item?.[`${base}_en`] || item?.[base] || '' }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
