# Supabase Setup Handleiding

Complete handleiding voor het opzetten van Supabase als backend voor Timo Intelligence.

## 📋 Inhoudsopgave

1. [Supabase Account Aanmaken](#1-supabase-account-aanmaken)
2. [Database Schema Installeren](#2-database-schema-installeren)
3. [API Keys Ophalen](#3-api-keys-ophalen)
4. [Backend Server Opzetten](#4-backend-server-opzetten)
5. [Frontend Configureren](#5-frontend-configureren)
6. [Testen](#6-testen)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Supabase Account Aanmaken

1. Ga naar https://supabase.com
2. Klik op **"Start your project"** of **"Sign Up"**
3. Log in met GitHub, Google, of maak een nieuw account
4. Klik op **"New Project"**
5. Vul project details in:
   - **Name**: `timo-intelligence` (of je eigen naam)
   - **Database Password**: Kies een sterk wachtwoord (bewaar dit!)
   - **Region**: Kies dichtstbijzijnde regio (bijv. `West EU` voor Nederland)
   - **Pricing Plan**: Free tier is voldoende voor start
6. Klik **"Create new project"**
7. Wacht 2-3 minuten tot project is aangemaakt

---

## 2. Database Schema Installeren

### Optie A: Via Supabase Dashboard (Aanbevolen)

1. Ga naar je Supabase project dashboard
2. Klik op **"SQL Editor"** in het linker menu
3. Klik op **"New query"**
4. Open het bestand `supabase/schema.sql` uit dit project
5. Kopieer **alle** SQL code uit dat bestand
6. Plak in de SQL Editor
7. Klik op **"Run"** (of druk `Ctrl+Enter`)
8. Je zou moeten zien: "Success. No rows returned"

### Optie B: Via Supabase CLI

```bash
# Installeer Supabase CLI (als je dat nog niet hebt)
npm install -g supabase

# Login
supabase login

# Link naar je project
supabase link --project-ref jouw-project-ref

# Deploy schema
supabase db push
```

---

## 3. API Keys Ophalen

1. In je Supabase dashboard, ga naar **"Settings"** (tandwiel icoon)
2. Klik op **"API"** in het linker menu
3. Je ziet twee belangrijke keys:

   **a) Project URL:**
   ```
   https://xxxxx.supabase.co
   ```
   Kopieer deze - dit is je `SUPABASE_URL`

   **b) Service Role Key (anon key is niet genoeg voor backend):**
   - Scroll naar beneden naar **"Project API keys"**
   - Zoek **"service_role"** key (⚠️ Deze is geheim, deel niet!)
   - Klik op het oog icoon om te tonen
   - Kopieer deze - dit is je `SUPABASE_SERVICE_ROLE_KEY`

4. **Belangrijk**: De `service_role` key heeft volledige toegang. Gebruik deze alleen in je backend server, nooit in de frontend!

---

## 4. Backend Server Opzetten

### Stap 1: Installeer Dependencies

In de root van je project:

```bash
npm install express cors @supabase/supabase-js dotenv
```

### Stap 2: Maak Backend Directory (optioneel)

```bash
mkdir backend
cp supabase/backend-server.js backend/server.js
```

Of gebruik het bestand direct uit `supabase/backend-server.js`

### Stap 3: Configureer Environment Variables

Voeg toe aan je `.env.local` bestand:

```env
# Supabase Configuratie
SUPABASE_URL=https://jouw-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend Server Configuratie
PORT=3001
FRONTEND_URL=http://localhost:5173

# Admin Credentials (bestaand)
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD_HASH=je_wachtwoord_hash
```

### Stap 4: Start Backend Server

**Development:**
```bash
node supabase/backend-server.js
```

**Of met nodemon (voor auto-reload):**
```bash
npm install -g nodemon
nodemon supabase/backend-server.js
```

**Production (met PM2):**
```bash
npm install -g pm2
pm2 start supabase/backend-server.js --name timo-api
pm2 save
pm2 startup
```

Je zou moeten zien:
```
🚀 Timo Intelligence API Server running on port 3001
📡 Supabase URL: https://xxxxx.supabase.co
```

---

## 5. Frontend Configureren

Voeg toe aan je `.env.local`:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3001/api

# Voor productie:
# VITE_API_BASE_URL=https://api.jouwdomein.nl/api
```

**Herstart je development server:**
```bash
npm run dev
```

---

## 6. Testen

### Test 1: Health Check

```bash
curl http://localhost:3001/api/health
```

Verwacht antwoord:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "service": "Timo Intelligence API"
}
```

### Test 2: Content Ophalen

```bash
curl http://localhost:3001/api/content
```

Verwacht: Content JSON of 404 als nog geen content bestaat.

### Test 3: Via Website

1. Open http://localhost:5173
2. Klik op ⚙️ rechtsonder
3. Log in met admin credentials
4. Maak een kleine wijziging
5. Controleer status indicator onderaan:
   - ✅ "Opgeslagen op de server" = Werkt!
   - ⚠️ "Opgeslagen in browser" = API niet bereikbaar

### Test 4: Database Verificatie

1. Ga naar Supabase Dashboard
2. Klik op **"Table Editor"**
3. Je zou de `content` tabel moeten zien
4. Klik erop - je zou je opgeslagen content moeten zien

---

## 7. Troubleshooting

### Probleem: "SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY moeten zijn ingesteld"

**Oplossing:**
- Controleer of `.env.local` bestaat
- Controleer of variabelen correct zijn gespeld
- Herstart backend server na het toevoegen van variabelen

### Probleem: "Failed to fetch content" of CORS errors

**Oplossing:**
1. Controleer of backend server draait (`http://localhost:3001/api/health`)
2. Controleer `FRONTEND_URL` in `.env.local`
3. Controleer CORS configuratie in `backend-server.js`

### Probleem: "Content not found" bij eerste gebruik

**Oplossing:**
- Dit is normaal! De database is leeg bij eerste setup
- Maak een wijziging via admin panel - dit maakt automatisch content aan
- Of voer handmatig uit in SQL Editor:
  ```sql
  INSERT INTO content (id, data) VALUES ('main', '{}'::JSONB);
  ```

### Probleem: "Row Level Security policy violation"

**Oplossing:**
- Controleer of je `service_role` key gebruikt (niet `anon` key)
- Of pas RLS policies aan in Supabase Dashboard:
  1. Ga naar **"Authentication"** → **"Policies"**
  2. Selecteer `content` tabel
  3. Controleer policies zijn correct ingesteld

### Probleem: Backend werkt lokaal maar niet in productie

**Oplossing:**
1. Zorg dat backend server draait op productie server
2. Update `VITE_API_BASE_URL` naar productie URL
3. Controleer firewall/security groups staan poort 3001 toe
4. Overweeg HTTPS/SSL certificaat

---

## 8. Productie Deployment

### Optie A: Vercel/Netlify Functions

Deploy backend als serverless function. Zie `supabase/functions/` voor voorbeeld.

### Optie B: Railway/Render

1. Maak account op Railway.app of Render.com
2. Connect GitHub repository
3. Set environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PORT` (Railway/Render stelt dit automatisch in)
4. Deploy!

### Optie C: Eigen VPS

1. Setup Node.js op je server
2. Clone repository
3. Installeer dependencies
4. Configureer `.env.local`
5. Start met PM2 (zie stap 4 hierboven)

---

## 9. Veiligheid Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` staat alleen in backend `.env.local`, niet in frontend
- [ ] RLS policies zijn ingesteld (al gedaan in schema.sql)
- [ ] Backend draait achter HTTPS in productie
- [ ] Admin credentials zijn sterk en veilig bewaard
- [ ] Database password is sterk en veilig bewaard
- [ ] Regular backups zijn ingesteld (Supabase doet dit automatisch op Pro plan)

---

## 10. Handige Links

- **Supabase Dashboard**: https://app.supabase.com
- **Supabase Docs**: https://supabase.com/docs
- **SQL Editor**: In dashboard → SQL Editor
- **Table Editor**: In dashboard → Table Editor
- **API Docs**: In dashboard → Settings → API

---

## ✅ Klaar!

Je Supabase backend is nu volledig geconfigureerd. Je kunt nu:

- ✅ Content beheren via admin panel
- ✅ Wijzigingen worden opgeslagen in Supabase database
- ✅ Versiegeschiedenis bekijken (optioneel)
- ✅ Meerdere beheerders tegelijk laten werken

**Succes met je website! 🚀**
