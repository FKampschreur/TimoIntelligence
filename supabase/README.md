# Supabase Backend voor Timo Intelligence

Complete Supabase setup met alle benodigde bestanden en instructies.

## 📁 Bestanden

- **`schema.sql`** - Complete database schema met alle tabellen, functies en triggers
- **`backend-server.js`** - Express.js server die als proxy fungeert tussen frontend en Supabase
- **`SUPABASE_SETUP.md`** - Uitgebreide stap-voor-stap handleiding
- **`package.json`** - Dependencies voor backend server
- **`test-api.js`** - Test script om API te verifiëren

## 🚀 Quick Start

### 1. Installeer SQL Schema

1. Open Supabase Dashboard → SQL Editor
2. Kopieer **alle** code uit `schema.sql`
3. Plak en voer uit (Run)

### 2. Installeer Backend Dependencies

```bash
cd supabase
npm install
```

### 3. Configureer Environment Variables

Voeg toe aan `.env.local` (in project root):

```env
# Supabase
SUPABASE_URL=https://jouw-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend
PORT=3001
FRONTEND_URL=http://localhost:5173

# Frontend API URL
VITE_API_BASE_URL=http://localhost:3001/api
```

### 4. Start Backend Server

```bash
node supabase/backend-server.js
```

### 5. Test API

```bash
node supabase/test-api.js
```

## 📖 Volledige Instructies

Zie **`SUPABASE_SETUP.md`** voor complete handleiding met:
- Account aanmaken
- Database setup
- API keys ophalen
- Deployment opties
- Troubleshooting

## ✅ Wat krijg je?

Na het uitvoeren van `schema.sql`:

- ✅ **content** tabel - Hoofdopslag voor website content
- ✅ **content_history** tabel - Versiegeschiedenis (backup/restore)
- ✅ **admin_users** tabel - Meerdere admin gebruikers (optioneel)
- ✅ **audit_log** tabel - Tracking van alle wijzigingen
- ✅ Helper functies voor content beheer
- ✅ Automatische versiegeschiedenis
- ✅ Row Level Security policies

## 🔧 API Endpoints

Na het starten van backend server:

- `GET /api/health` - Health check
- `GET /api/content` - Haal content op
- `PUT /api/content` - Sla content op
- `GET /api/content/history` - Versiegeschiedenis
- `POST /api/content/restore/:versionId` - Herstel versie

## 📝 Belangrijk

- **Service Role Key** is geheim - gebruik alleen in backend, nooit in frontend!
- **RLS Policies** zijn ingesteld - pas aan naar je eigen authenticatie systeem
- **Backups** worden automatisch gemaakt door Supabase (Pro plan)

## 🆘 Hulp Nodig?

Zie `SUPABASE_SETUP.md` sectie "Troubleshooting" voor veelvoorkomende problemen.
