import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ensureDb, readDb, writeDb, nextId } from './db.js';
import prisma
 from './config/prisma.js';
await ensureDb();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

const publicUser = (user) => {
  const { password, ...safe } = user;
  return safe;
};

const auth = (roles = []) => async(req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const db = readDb();
    console.log("payload id",payload.id);
    let user = db.users.find((u) => u.id === payload.id && u.active !== false);
    if(!user){
      user= await prisma.User.findUnique({
        where:{
          id:payload.id
        }
      });
      if(user){
        user.role='member';
      }
    }
    if (!user) return res.status(401).json({ message: 'Account not available' });
    if (roles.length && !roles.includes(user.role)) return res.status(403).json({ message: 'Access denied' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
};

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  let account=null;
  let role='member';
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  const db = readDb();
  const admin = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if(admin){
    account=admin;
    role=admin.role||'admin';
  }
  else{
     const user= await prisma.User.findUnique({
      where:{
        email:String(email).toLowerCase(),
      }
    });
    if(user){
      account=user;
      role='member';
    }
  }

  if (!account||account.active===false) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const isPassworsdValid= await bcrypt.compare(password,account.password);
  if(!isPassworsdValid){
    return res.status(401).json({ message: 'password' });
  }
  const token = jwt.sign({ id: account.id, role: role }, JWT_SECRET, { expiresIn: '12h' });
  const userToReturn = { ...account, role };
  res.json({ token, user: publicUser(userToReturn) });
});


app.post('/api/add-members', async (req, res) => {
  try {
    const { email, password, name, name_ml, phone, ward, roll_no, house, family } = req.body;
    
    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 2. Hash the password (CRITICAL)
    // Never store plain text passwords in the database
    const hashedPassword = await bcrypt.hash(password, 10);

   

    // 4. Database Creation 
    const newMember = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Store the hashed password
        name: name || '',
        name_ml: name_ml || '',
        phone: phone || '',
        roll_no: roll_no || '',
        ward: ward || '', 
        house: house || '',
        family: family ||[]
      }
    });

    // 5. Success Response
    // (Omit the password from the response data for security)
    const { password: _, ...memberWithoutPassword } = newMember;
    return res.status(201).json(memberWithoutPassword);

  } catch (error) {
    console.error("FULL PRISMA ERROR:\n", error);    
    
    // Catch Prisma's Unique Constraint error (e.g., Email already exists)
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'A user with this email already exists' });
    }

    // Send a 500 error back to the client
    return res.status(500).json({ 
      message: 'Failed to add member', 
      error: error.message 
    });
  }
});


app.get('/api/get-members',async(req,res)=>{
  try{
    const members= await prisma.user.findMany({
      orderBy:{
        roll_no:'asc'
      },
      select:{
        id:true,
        name:true,
        name_ml:true,
        email:true,
        phone:true,
        roll_no:true,
        ward:true,
        house:true,
        family:true
      }
    })
    return res.status(201).json(members);
  }
  catch(error){
    res.status(500).json({error:error.meessage})
  }
})

app.get('/api/auth/me', auth(), (req, res) => res.json({ user: publicUser(req.user) }));

app.post('/api/admin/notice',async(req,res)=>{
  try{
  const {category, category_ml,date, title,title_ml,description,description_ml,featured}= req.body;
  if(!category||!date||!title||!description){
    return res.status(400).json({message:"Please fill out the nessacary fields"});
  }
  else{
    const formatedDate = new Date(date);
    const add_notice= await prisma.notice.create({
      data:{
        category,
        category_ml,
        date : formatedDate,
        title,
        title_ml,
        description,
        description_ml,
        featured
      }
    });
    if(add_notice){
      return res.status(201).json({message:"Annoucment is created",notice:add_notice})
    }
  }
}
catch(error){
   res.status(500).json(error);
}
})

app.post('/api/admin/services',async(req,res)=>{
  try{
  const {day, day_ml, name,name_ml,note,note_ml,time}= req.body;
  if(!day||!name||!note||!time){
    return res.status(400).json({message:"Please fill out the nessacary fields"});
  }
  else{
    const add_service= await prisma.services.create({
      data:{
        day,
        day_ml,
        note,
        note_ml,
        name,
        name_ml,
        time
      }
    });
    if(add_service){
      return res.status(201).json({message:"Service is created",service:add_service})
    }
  }
}
catch(error){
   res.status(500).json(error);
}
})


app.post('/api/admin/organizations',async(req,res)=>{
  try{
  const {title,title_ml,description,description_ml}= req.body;
  if(!title||!description){
    return res.status(400).json({message:"Please fill out the nessacary fields"});
  }
  else{
    const add_organization= await prisma.organizations.create({
      data:{
        title,
        title_ml,
        description,
        description_ml
      }
    });
    if(add_organization){
      return res.status(201).json({message:"Organization is created",organization:add_organization})
    }
  }
}
catch(error){
   res.status(500).json(error);
}
})



app.get('/api/public/notice',async(req,res)=>{
  try{
    const data= await prisma.notice.findMany({
      select:{
        id:true,
        category:true,
        category_ml:true,
        date:true,
        title:true,
        title_ml:true,
        description:true,
        description_ml:true,
        featured:true
      }
    });
    if(data){
      return res.status(201).json({message:"here is the notices",notice:data})
    }
  }
  catch(error){
    res.status(500).json(error);
  }
})

app.get('/api/public/service',async(req,res)=>{
  try{
    const data= await prisma.services.findMany({
      select:{
        day:true,
        day_ml:true,
        name:true,
        name_ml:true,
        note:true,
        note_ml:true,
        time:true
      }
    });
    if(data){
      return res.status(201).json({message:"here is the service",service:data})
    }
  }
  catch(error){
    res.status(500).json(error);
  }
})


app.get('/api/public/organization',async(req,res)=>{
  try{
    const data= await prisma.organizations.findMany({
      select:{
         title:true,
        title_ml:true,
        description:true,
        description_ml:true,
      }
    });
    if(data){
      return res.status(201).json({message:"here is the organization",organization:data})
    }
  }
  catch(error){
    res.status(500).json(error);
  }
})





app.get('/api/public/bootstrap', (_req, res) => {
  const db = readDb();
  res.json({
    announcements: db.announcements,
    services: db.services,
    organizations: db.organizations,
    leaders: db.leaders
  });
});

app.get('/api/member/profile', auth(['member', 'admin']), (req, res) => {
  res.json({ profile: publicUser(req.user) });
});

app.put('/api/member/profile', auth(['member', 'admin']), (req, res) => {
  const db = readDb();
  const idx = db.users.findIndex((u) => u.id === req.user.id);
  const allowed = ['name', 'name_ml', 'phone', 'ward', 'house', 'address'];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) db.users[idx][key] = req.body[key];
  });
  writeDb(db);
  res.json({ profile: publicUser(db.users[idx]) });
});

app.get('/api/member/family', auth(['member', 'admin']), (req, res) => {
  const db = readDb();
  res.json({ family: db.familyMembers.filter((m) => m.userId === req.user.id) });
});

app.post('/api/member/family', auth(['member', 'admin']), (req, res) => {
  const db = readDb();
  const item = { id: nextId(db.familyMembers), userId: req.user.id, ...req.body };
  db.familyMembers.push(item);
  writeDb(db);
  res.status(201).json({ member: item });
});

app.put('/api/member/family/:id', auth(['member', 'admin']), (req, res) => {
  const db = readDb();
  const id = Number(req.params.id);
  const idx = db.familyMembers.findIndex((m) => m.id === id && m.userId === req.user.id);
  if (idx < 0) return res.status(404).json({ message: 'Family member not found' });
  db.familyMembers[idx] = { ...db.familyMembers[idx], ...req.body, id, userId: req.user.id };
  writeDb(db);
  res.json({ member: db.familyMembers[idx] });
});

app.delete('/api/member/family/:id', auth(['member', 'admin']), (req, res) => {
  const db = readDb();
  const id = Number(req.params.id);
  const before = db.familyMembers.length;
  db.familyMembers = db.familyMembers.filter((m) => !(m.id === id && m.userId === req.user.id));
  if (db.familyMembers.length === before) return res.status(404).json({ message: 'Family member not found' });
  writeDb(db);
  res.status(204).end();
});

app.get('/api/directory', auth(['member', 'admin']), (_req, res) => {
  const db = readDb();
  const members = db.users.filter((u) => u.role === 'member' && u.active !== false).map((u) => ({
    ...publicUser(u),
    familyCount: db.familyMembers.filter((f) => f.userId === u.id).length
  }));
  res.json({ members });
});

app.get('/api/admin/stats', auth(['admin']), (_req, res) => {
  const db = readDb();
  res.json({
    members: db.users.filter((u) => u.role === 'member').length,
    families: db.familyMembers.length,
    announcements: db.announcements.length,
    services: db.services.length,
    organizations: db.organizations.length
  });
});

app.get('/api/admin/members', auth(['admin']), (_req, res) => {
  const db = readDb();
  res.json({ members: db.users.filter((u) => u.role === 'member').map(publicUser) });
});

app.post('/api/admin/members', auth(['admin']), async (req, res) => {
  const db = readDb();
  const { email, password = 'Member@123', ...rest } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return res.status(409).json({ message: 'Email already exists' });
  const user = {
    id: nextId(db.users), role: 'member', email, password: await bcrypt.hash(password, 10), active: true, ...rest
  };
  db.users.push(user);
  writeDb(db);
  res.status(201).json({ member: publicUser(user) });
});

app.put('/api/admin/members/:id', auth(['admin']), (req, res) => {
  const db = readDb();
  const id = Number(req.params.id);
  const idx = db.users.findIndex((u) => u.id === id && u.role === 'member');
  if (idx < 0) return res.status(404).json({ message: 'Member not found' });
  const { password, role, id: ignored, ...rest } = req.body;
  db.users[idx] = { ...db.users[idx], ...rest, id, role: 'member' };
  writeDb(db);
  res.json({ member: publicUser(db.users[idx]) });
});

const adminCrud = (collection) => {
  app.get(`/api/admin/${collection}`, auth(['admin']), (_req, res) => {
    const db = readDb();
    res.json({ items: db[collection] });
  });
  app.post(`/api/admin/${collection}`, auth(['admin']), (req, res) => {
    const db = readDb();
    const item = { id: nextId(db[collection]), ...req.body };
    db[collection].push(item);
    writeDb(db);
    res.status(201).json({ item });
  });
  app.put(`/api/admin/${collection}/:id`, auth(['admin']), (req, res) => {
    const db = readDb();
    const id = Number(req.params.id);
    const idx = db[collection].findIndex((item) => item.id === id);
    if (idx < 0) return res.status(404).json({ message: 'Item not found' });
    db[collection][idx] = { ...db[collection][idx], ...req.body, id };
    writeDb(db);
    res.json({ item: db[collection][idx] });
  });
  app.delete(`/api/admin/${collection}/:id`, auth(['admin']), (req, res) => {
    const db = readDb();
    const id = Number(req.params.id);
    const before = db[collection].length;
    db[collection] = db[collection].filter((item) => item.id !== id);
    if (db[collection].length === before) return res.status(404).json({ message: 'Item not found' });
    writeDb(db);
    res.status(204).end();
  });
};

['announcements', 'services', 'organizations'].forEach(adminCrud);

const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

app.listen(PORT, () => console.log(`St. George API running on http://localhost:${PORT}`));
