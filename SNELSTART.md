# 🚀 Snelstart Handleiding

## Wat heb je nodig om content te beheren?

### Minimale Setup (5 minuten)

**Voor development/testen:**

1. **Installeer Node.js** (als je dat nog niet hebt)
   - Download van: https://nodejs.org
   - Versie 18 of hoger

2. **Installeer dependencies**
   ```bash
   npm install
   ```

3. **Maak admin credentials**
   
   Maak een `.env.local` bestand in de root:
   ```env
   VITE_ADMIN_USERNAME=admin
   VITE_ADMIN_PASSWORD_HASH=je_wachtwoord_hash_hier
   ```
   
   **Wachtwoord hash genereren:**
   ```bash
   node scripts/generate-password-hash.js jouw_wachtwoord
   ```
   
   Of gebruik online tool: https://emn178.github.io/online-tools/sha256.html
   - Typ je wachtwoord
   - Kopieer de SHA-256 hash
   - Plak in `.env.local`

4. **Start de website**
   ```bash
   npm run dev
   ```

5. **Open website en log in**
   - Ga naar http://localhost:5173
   - Klik op ⚙️ rechtsonder
   - Log in met je credentials
   - Begin met bewerken!

**✅ Klaar!** Wijzigingen worden opgeslagen in je browser.

---

### Productie Setup (Met Backend - 30-60 minuten)

**Voor live website met persistentie:**

#### Optie 1: Supabase (Aanbevolen - Eenvoudigst)

1. **Maak Supabase account** (gratis)
   - Ga naar: https://supabase.com
   - Maak nieuw project

2. **Maak database tabel**
   - Ga naar SQL Editor
   - Voer dit uit:
   ```sql
   CREATE TABLE content (
     id TEXT PRIMARY KEY DEFAULT 'main',
     data JSONB NOT NULL,
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Deploy backend** (zie `API_SETUP.md` voor code)

4. **Configureer frontend**
   ```env
   VITE_API_BASE_URL=https://jouw-project.supabase.co/rest/v1
   ```

#### Optie 2: Firebase (Ook eenvoudig)

1. **Maak Firebase account** (gratis)
   - Ga naar: https://firebase.google.com
   - Maak nieuw project
   - Activeer Firestore

2. **Deploy backend** (zie `API_SETUP.md`)

3. **Configureer frontend**
   ```env
   VITE_API_BASE_URL=https://jouw-api-url.com/api
   ```

#### Optie 3: Eigen Server

Zie `API_SETUP.md` voor volledige instructies.

---

## 📖 Volledige Documentatie

- **`BEHEER_HANDLEIDING.md`** - Uitgebreide handleiding met alle opties
- **`API_SETUP.md`** - Technische details voor backend setup

---

## ❓ Veelgestelde Vragen

**Q: Moet ik een backend hebben?**
A: Nee! Voor development/testen werkt het zonder backend. Voor productie is het aanbevolen.

**Q: Hoeveel kost het?**
A: 
- Zonder backend: Gratis
- Met Supabase/Firebase: Gratis voor kleine sites
- Met eigen server: $5-20/maand

**Q: Kan ik meerdere beheerders hebben?**
A: Ja, met een backend API kunnen meerdere mensen tegelijk werken.

**Q: Gaan mijn wijzigingen verloren?**
A: 
- Met backend: Nee, alles op server
- Zonder backend: Alleen als je browserdata wist

---

## 🎯 Checklist

- [ ] Node.js geïnstalleerd
- [ ] `npm install` uitgevoerd
- [ ] `.env.local` aangemaakt met credentials
- [ ] `npm run dev` gestart
- [ ] Ingelogd in admin panel
- [ ] Test wijziging gemaakt
- [ ] (Optioneel) Backend API geconfigureerd

**Klaar om te beginnen! 🎉**
