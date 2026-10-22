import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'db.json');

const seedData = async () => ({
  users: [
    {
      id: 1,
      role: 'admin',
      email: 'admin@stgeorge.org',
      password: await bcrypt.hash('Admin@123', 10),
      name: 'Church Administrator',
      phone: '+91 90000 00001',
      ward: 'Parish Office',
      house: 'Parish Office',
      active: true
    },
    {
      id: 2,
      role: 'member',
      email: 'member@stgeorge.org',
      password: await bcrypt.hash('Member@123', 10),
      name: 'Mathew Varghese',
      name_ml: 'മാത്യു വർഗീസ്',
      phone: '+91 90000 00002',
      ward: "St. Mary's Ward",
      house: 'Kizhakkevila House, Nellikunnam',
      address: 'Nellikunnam, Kollam, Kerala',
      active: true
    }
  ],
  familyMembers: [
    { id: 1, userId: 2, name: 'Annamma Mathew', name_ml: 'അന്നമ്മ മാത്യു', relation: 'Spouse', relation_ml: 'ഭാര്യ', phone: '+91 90000 00003', dob: '1985-05-18' },
    { id: 2, userId: 2, name: 'George Mathew', name_ml: 'ജോർജ് മാത്യു', relation: 'Son', relation_ml: 'മകൻ', phone: '', dob: '2010-11-06' }
  ],
  announcements: [
    {
      id: 1,
      category: 'Feasts',
      date: '2026-05-15',
      title_en: 'Feast of St. George (Perunnal)',
      title_ml: 'വിശുദ്ധ ഗീവർഗീസ് സഹദായുടെ പെരുന്നാൾ',
      body_en: 'Join us for the grand celebration of our patron saint. Holy Qurbana will begin at 8:30 AM followed by the Rasa.',
      body_ml: 'പരിശുദ്ധ ഗീവർഗീസ് സഹദായുടെ മഹാപെരുന്നാൾ ആഘോഷത്തിലേക്ക് എല്ലാവരെയും സ്വാഗതം ചെയ്യുന്നു. രാവിലെ 8:30-ന് വിശുദ്ധ കുർബാനയും തുടർന്ന് റാസയും ഉണ്ടായിരിക്കും.',
      featured: true
    },
    {
      id: 2,
      category: 'General Announcements',
      date: '2026-05-10',
      title_en: "Diocesan Metropolitan's Circular",
      title_ml: 'ഭദ്രാസന മെത്രാപ്പോലീത്തായുടെ കല്പന',
      body_en: 'A new circular regarding the upcoming Sunday School centralized examinations has been issued by the Diocesan center.',
      body_ml: 'വരാനിരിക്കുന്ന സൺഡേ സ്കൂൾ കേന്ദ്രീകൃത പരീക്ഷകളുമായി ബന്ധപ്പെട്ട പുതിയ കല്പന ഭദ്രാസന കേന്ദ്രത്തിൽ നിന്ന് പ്രസിദ്ധീകരിച്ചു.',
      featured: false
    },
    {
      id: 3,
      category: 'Charity',
      date: '2026-05-05',
      title_en: 'Educational Assistance Fund',
      title_ml: 'വിദ്യാഭ്യാസ സഹായ നിധി',
      body_en: 'Applications are now open for the annual parish educational assistance fund for deserving students.',
      body_ml: 'അർഹരായ വിദ്യാർത്ഥികൾക്കുള്ള വാർഷിക ഇടവക വിദ്യാഭ്യാസ സഹായ നിധിയിലേക്ക് അപേക്ഷകൾ ക്ഷണിക്കുന്നു.',
      featured: false
    }
  ],
  services: [
    { id: 1, day_en: 'Saturday', day_ml: 'ശനി', name_en: 'Sandhya Namaskaram', name_ml: 'സന്ധ്യാ നമസ്കാരം', note_en: 'Evening Prayer', note_ml: 'സായാഹ്ന പ്രാർത്ഥന', time: '6:00 PM' },
    { id: 2, day_en: 'Sunday', day_ml: 'ഞായർ', name_en: 'Prabhatha Namaskaram', name_ml: 'പ്രഭാത നമസ്കാരം', note_en: 'Morning Prayer', note_ml: 'പ്രഭാത പ്രാർത്ഥന', time: '7:30 AM' },
    { id: 3, day_en: 'Sunday', day_ml: 'ഞായർ', name_en: 'Holy Qurbana', name_ml: 'വിശുദ്ധ കുർബാന', note_en: 'Divine Liturgy', note_ml: 'ദിവ്യബലി', time: '8:30 AM' }
  ],
  organizations: [
    { id: 1, title_en: 'Sunday School', title_ml: 'സൺഡേ സ്കൂൾ', body_en: 'Nurturing the faith of children through Orthodox theology, scripture and tradition.', body_ml: 'ഓർത്തഡോക്സ് വിശ്വാസം, തിരുവെഴുത്ത്, പാരമ്പര്യം എന്നിവയിലൂടെ കുട്ടികളുടെ വിശ്വാസജീവിതം വളർത്തുന്നു.' },
    { id: 2, title_en: 'MGOCSM & Youth Movement', title_ml: 'എം.ജി.ഒ.സി.എസ്.എം & യുവജന പ്രസ്ഥാനം', body_en: 'A dynamic fellowship for worship, study, service and leadership among young adults.', body_ml: 'യുവജനങ്ങൾക്കായി ആരാധന, പഠനം, സേവനം, നേതൃത്വവളർച്ച എന്നിവയ്ക്കുള്ള സജീവ കൂട്ടായ്മ.' },
    { id: 3, title_en: 'Martha Mariam Samajam', title_ml: 'മാർത്ത മറിയം സമാജം', body_en: "The women's association of the church, dedicated to prayer, charity and parish ministry.", body_ml: 'പ്രാർത്ഥന, സേവനം, കാരുണ്യപ്രവർത്തനങ്ങൾ എന്നിവയിൽ സജീവമായ ഇടവക വനിതാ സംഘടന.' },
    { id: 4, title_en: 'Prayer Groups (Kudumba Yogangal)', title_ml: 'കുടുംബയോഗങ്ങൾ', body_en: 'Ward-wise prayer meetings strengthening family bonds and community spirit.', body_ml: 'വാർഡ് അടിസ്ഥാനത്തിലുള്ള പ്രാർത്ഥനാ സംഗമങ്ങൾ കുടുംബബന്ധവും ഇടവക ഐക്യവും ശക്തിപ്പെടുത്തുന്നു.' }
  ],
  leaders: [
    { id: 1, name_en: 'Rev. Fr. Name Here', name_ml: 'റവ. ഫാ. പേര്', role_en: 'Vicar', role_ml: 'വികാരി' },
    { id: 2, name_en: 'Name Here', name_ml: 'പേര്', role_en: 'Secretary', role_ml: 'സെക്രട്ടറി' },
    { id: 3, name_en: 'Name Here', name_ml: 'പേര്', role_en: 'Trustee', role_ml: 'ട്രസ്റ്റി' }
  ]
});

export async function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(await seedData(), null, 2));
  }
}

export function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

export function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function nextId(items) {
  return items.length ? Math.max(...items.map((item) => Number(item.id) || 0)) + 1 : 1;
}
