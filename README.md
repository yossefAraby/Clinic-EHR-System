# Clinic EHR System — Lightning

A static JAMstack Electronic Health Record (EHR) system for multi-section clinics, rebuilt from [BelalAhmed2214/health](https://github.com/BelalAhmed2214/health) as a modern SPA.

Originally a Laravel + Blade application, this version ports the full UI pixel-perfectly to **Vite + Alpine.js + Bootstrap 5.3** with **Supabase** (database & auth) and **Cloudinary** (image uploads), deployed to **Cloudflare Pages**.

## Features

- **Patient Registry** — create, read, update, delete patient records with visit history, symptoms, diagnosis, and internal notes
- **Price Tracking** — section and source breakdowns for clinic revenue
- **User Management** — admin/staff roles with section-based access via Supabase Edge Functions
- **Dashboard** — stats cards (total, completed, pending, per-section, per-source) and recent patient table
- **Bilingual** — full English/Arabic translations with RTL support
- **Excel Import** — bulk import patients from `.xlsx` files via SheetJS
- **Image Uploads** — patient profile photos uploaded to Cloudinary with auto-optimization

## Tech Stack

| Layer | Technology |
|---|---|
| Build | Vite 5.4 |
| UI | Alpine.js 3.14 + Bootstrap 5.3.3 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Images | Cloudinary (unsigned upload) |
| Hosting | Cloudflare Pages |
| Excel | SheetJS (xlsx) |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Cloudinary](https://cloudinary.com) account
- A Cloudflare Pages project (optional, for deployment)

### 1. Clone & Install

```bash
git clone https://github.com/yossefAraby/Clinic-EHR-System.git
cd Clinic-EHR-System
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=clinic_ehr_uploads
```

### 3. Database Schema

Run the SQL in `supabase/schema.sql` in your Supabase SQL Editor. This creates all tables, RLS policies, triggers, and indexes.

### 4. Deploy Edge Function

The user management endpoints (create/update/delete) use a Supabase Edge Function with the service role key:

```bash
supabase functions deploy manage-user
```

Set the `SUPABASE_SERVICE_ROLE_KEY` secret in your Supabase project.

### 5. Development

```bash
npm run dev
```

### 6. Build & Deploy

```bash
npm run build
```

Output goes to `dist/`. Deploy to Cloudflare Pages with:

- **Build command:** `npm run build`
- **Output directory:** `dist`

## Project Structure

```
├── index.html                  # SPA entry point (all pages)
├── src/
│   ├── main.js                 # Alpine.js app controller
│   ├── services/
│   │   ├── i18n.js             # Locale system (en/ar)
│   │   ├── supabase.js         # Auth & client init
│   │   ├── cloudinary.js       # Image uploads
│   │   ├── patients.js         # Patient CRUD
│   │   ├── prices.js           # Price statistics
│   │   ├── users.js            # User management (Edge Function)
│   │   ├── dashboard.js        # Dashboard stats
│   │   └── excel.js            # Excel import
│   ├── locales/
│   │   ├── en.json             # English translations
│   │   └── ar.json             # Arabic translations
│   └── styles/
│       └── main.css            # Custom styles + RTL
├── supabase/
│   ├── schema.sql              # Full DB schema + RLS
│   ├── seed.sql                # Seed notes
│   └── functions/
│       └── manage-user/
│           └── index.ts        # Edge Function for admin user CRUD
├── package.json
├── vite.config.js
└── .env.example
```

## License

MIT
