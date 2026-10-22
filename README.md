# St. George Orthodox Church — React + Node Dynamic Website

A full-stack JavaScript starter built from the supplied screen structure and visual direction.

## Stack
- React + Vite (JS / JSX)
- Node.js + Express
- JSON file persistence for easy local development (`server/data/db.json` is auto-created)
- JWT authentication
- English + Malayalam UI/content switching
- Responsive desktop, tablet and mobile layout

## Included public pages
- Home
- About Us
- Worship & Services
- Spiritual Organizations
- Notice Board
- Contact
- Secure Parish Directory (login required)

## Member portal
Members can:
- Login securely
- View and edit their profile
- Maintain English and Malayalam name fields
- Add/delete family members
- Store relation, phone and date of birth
- Access the protected parish directory

## Admin dashboard
Administrators can:
- View dashboard statistics
- Create/edit/delete announcements
- Create/edit/delete service timings
- Create/edit/delete organizations
- Add member accounts
- Activate/deactivate member accounts
- Maintain English and Malayalam content fields

## Demo logins
### Member
- Email: `member@stgeorge.org`
- Password: `Member@123`

### Admin
- Email: `admin@stgeorge.org`
- Password: `Admin@123`

Change these before production use.

## Run locally
From the project root:

```bash
npm install
npm run install:all
npm run dev
```

Frontend: `http://localhost:5173`
API: `http://localhost:5000`

## Production build
```bash
npm run build
npm start
```

After the client is built, the Express server automatically serves `client/dist`.

## Production notes
Before going live:
1. Set a strong `JWT_SECRET` environment variable.
2. Replace demo credentials.
3. Replace placeholder contact details, leadership names and visual assets.
4. For a larger membership database, replace the JSON data layer with PostgreSQL/MySQL while keeping the current REST API contract.
5. Add file/image upload storage (S3, Cloudinary, Azure Blob, etc.) if admins need to upload photos/PDF notices.
6. Add password reset/email verification and audit logging.
7. Configure HTTPS and a reverse proxy in production.
