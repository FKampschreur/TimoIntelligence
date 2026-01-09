# Environment Variables Overzicht

## 🔐 Verplicht voor Admin Login

Deze variabelen zijn **verplicht** om in te kunnen loggen:

```env
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD_HASH=240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
```

**Belangrijk:**
- Moeten beginnen met `VITE_` (anders worden ze niet geladen door Vite)
- Geen quotes rondom de waarden
- Geen spaties rondom de `=`

## 📡 Optioneel: Backend API (voor Supabase/Backend Server)

Als je een backend server gebruikt voor content opslag:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

**Wanneer nodig:**
- Als je Supabase backend server gebruikt
- Als je een eigen API server hebt
- Als je content op de server wilt opslaan (niet alleen in browser)

**Als niet ingesteld:**
- Applicatie gebruikt automatisch localStorage (browser opslag)
- Content wordt alleen lokaal opgeslagen

## 🗄️ Optioneel: Supabase Backend Server

Als je de Supabase backend server draait (`supabase/backend-server.js`):

```env
SUPABASE_URL=https://jouw-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Waar:**
- Deze staan in `.env.local` (backend server leest deze)
- `SUPABASE_SERVICE_ROLE_KEY` is **geheim** - deel nooit!
- Alleen nodig als je Supabase backend server gebruikt

## ❌ NIET nodig voor Admin Login

Deze zijn **NIET** nodig voor admin login:

- `GEMINI_API_KEY` - Wordt niet gebruikt (verwijderd voor veiligheid)
- `API_KEY` - Wordt niet gebruikt
- Andere API keys - Admin login gebruikt geen externe API's

## ✅ Checklist voor Admin Login

- [ ] `.env.local` bestaat in root directory
- [ ] `VITE_ADMIN_USERNAME` is ingesteld
- [ ] `VITE_ADMIN_PASSWORD_HASH` is ingesteld (64 karakters)
- [ ] Variabelen beginnen met `VITE_`
- [ ] Geen quotes rondom waarden
- [ ] Development server is herstart na wijzigingen
- [ ] Browser cache is geleegd (Ctrl+Shift+R)

## 🔍 Testen

Voer diagnose uit:
```bash
node scripts/check-admin-config.js
```

Test met wachtwoord:
```bash
node scripts/check-admin-config.js admin123
```

Genereer nieuwe hash:
```bash
node scripts/generate-password-hash.js jouw_wachtwoord
```

## 📝 Voorbeeld .env.local

```env
# Admin Authenticatie (VERPLICHT)
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD_HASH=240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9

# Backend API (OPTIONEEL - alleen als je backend server gebruikt)
# VITE_API_BASE_URL=http://localhost:3001/api

# Supabase Backend Server (OPTIONEEL - alleen als je backend server gebruikt)
# SUPABASE_URL=https://xxxxx.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# PORT=3001
# FRONTEND_URL=http://localhost:3000
```
