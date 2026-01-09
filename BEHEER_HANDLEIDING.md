# Content Beheer Handleiding

Deze handleiding legt uit hoe je de content van je website kunt beheren en wat je nodig hebt om dit op te zetten.

## 📋 Inhoudsopgave

1. [Hoe werkt het beheer?](#hoe-werkt-het-beheer)
2. [Wat heb je nodig?](#wat-heb-je-nodig)
3. [Opties voor Backend API](#opties-voor-backend-api)
4. [Stap-voor-stap Setup](#stap-voor-stap-setup)
5. [Dagelijks Gebruik](#dagelijks-gebruik)
6. [Veelgestelde Vragen](#veelgestelde-vragen)

---

## Hoe werkt het beheer?

### Admin Panel Toegang

1. **Open je website** in de browser
2. **Klik op het instellingen-icoon** (⚙️) rechtsonder in beeld
3. **Log in** met je admin credentials
4. **Bewerk content** via de verschillende tabs:
   - Hero (hoofdbanner)
   - Oplossingen (producten/diensten)
   - Onze Kracht (over ons sectie)
   - Partners
   - Contact informatie

### Wat kun je bewerken?

- ✅ Teksten (titels, beschrijvingen, paragrafen)
- ✅ Afbeeldingen (via URL of direct upload)
- ✅ Knoppen en labels
- ✅ Contactgegevens
- ✅ Oplossingen toevoegen/verwijderen

### Automatisch Opslaan

- Wijzigingen worden **automatisch opgeslagen** na 500ms
- Je ziet altijd de **opslagstatus** onderaan het admin panel:
  - 🟢 "Opgeslagen X seconden geleden" = succesvol
  - 🟡 "API opslag mislukt..." = opgeslagen in browser
  - 🔵 "Opslaan..." = bezig met opslaan

---

## Wat heb je nodig?

### Minimale Setup (Zonder Backend)

**Voor development of kleine websites:**

- ✅ Alleen de website zelf
- ✅ Een browser
- ✅ Admin login credentials

**Hoe werkt het:**
- Content wordt opgeslagen in de **browser localStorage**
- Werkt alleen op dezelfde browser/computer
- Geschikt voor: development, testen, kleine websites

**Nadelen:**
- Wijzigingen zijn niet zichtbaar voor andere gebruikers
- Bij het wissen van browserdata gaan wijzigingen verloren
- Niet geschikt voor productie met meerdere beheerders

### Volledige Setup (Met Backend API)

**Voor productie websites:**

- ✅ Website (frontend)
- ✅ Backend API server
- ✅ Database of bestandssysteem voor opslag
- ✅ Admin login credentials
- ✅ Hosting voor backend (optioneel)

**Hoe werkt het:**
- Content wordt opgeslagen op een **server/database**
- Wijzigingen zijn direct zichtbaar voor alle bezoekers
- Meerdere beheerders kunnen tegelijk werken
- Geschikt voor: productie websites, teams

---

## Opties voor Backend API

### Optie 1: Serverless (Aanbevolen voor beginners)

**Firebase / Supabase / Vercel**

**Voordelen:**
- ✅ Geen server beheer nodig
- ✅ Gratis tier beschikbaar
- ✅ Automatische scaling
- ✅ Eenvoudige setup

**Wat je nodig hebt:**
- Account bij Firebase/Supabase/Vercel
- 15-30 minuten setup tijd

**Kosten:** Gratis voor kleine websites (~$0-10/maand voor grotere sites)

---

### Optie 2: Node.js Backend (Middelmatige complexiteit)

**Express.js + Database**

**Voordelen:**
- ✅ Volledige controle
- ✅ Flexibel en aanpasbaar
- ✅ Goede documentatie beschikbaar

**Wat je nodig hebt:**
- Node.js kennis (basis)
- Database (PostgreSQL, MongoDB, of SQLite)
- Server/hosting (Heroku, Railway, DigitalOcean, etc.)

**Kosten:** $5-20/maand voor hosting

---

### Optie 3: Python Backend (Middelmatige complexiteit)

**Flask/FastAPI + Database**

**Voordelen:**
- ✅ Eenvoudige syntax
- ✅ Goed voor beginners
- ✅ Veel libraries beschikbaar

**Wat je nodig hebt:**
- Python kennis (basis)
- Database (PostgreSQL, MongoDB, of SQLite)
- Server/hosting

**Kosten:** $5-20/maand voor hosting

---

### Optie 4: PHP Backend (Traditioneel)

**PHP + MySQL**

**Voordelen:**
- ✅ Veel hosting providers ondersteunen dit
- ✅ Geen extra server nodig bij shared hosting

**Wat je nodig hebt:**
- PHP kennis (basis)
- MySQL database
- Shared hosting of VPS

**Kosten:** $3-10/maand voor shared hosting

---

## Stap-voor-stap Setup

### Stap 1: Admin Credentials Instellen

Maak een `.env.local` bestand in de root van je project:

```env
# Admin Login Credentials
VITE_ADMIN_USERNAME=jouw_gebruikersnaam
VITE_ADMIN_PASSWORD_HASH=hash_van_je_wachtwoord
```

**Wachtwoord Hash Genereren:**

Gebruik deze online tool of Node.js script:

```javascript
// Genereer hash van je wachtwoord
const crypto = require('crypto');
const password = 'jouw_wachtwoord';
const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log(hash);
```

Of gebruik deze website: https://emn178.github.io/online-tools/sha256.html

**Voorbeeld:**
```env
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD_HASH=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

---

### Stap 2A: Setup Zonder Backend (Development)

**Alleen voor development/testen:**

1. ✅ Admin credentials instellen (zie Stap 1)
2. ✅ Start development server: `npm run dev`
3. ✅ Open website en log in
4. ✅ Bewerk content - wordt opgeslagen in browser

**Klaar!** Geen verdere configuratie nodig.

---

### Stap 2B: Setup Met Backend (Productie)

#### Optie A: Firebase Setup (Eenvoudigst)

1. **Maak Firebase account** op https://firebase.google.com
2. **Maak nieuw project**
3. **Activeer Firestore Database**
4. **Installeer Firebase SDK** in je backend
5. **Deploy backend code** (zie voorbeeld in `API_SETUP.md`)

**Backend Code Voorbeeld (Firebase):**

```javascript
const admin = require('firebase-admin');
const express = require('express');
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json'))
});

const db = admin.firestore();

app.get('/api/content', async (req, res) => {
  const doc = await db.collection('content').doc('main').get();
  if (!doc.exists) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(doc.data());
});

app.put('/api/content', async (req, res) => {
  await db.collection('content').doc('main').set(req.body);
  res.json({ success: true });
});

app.listen(3001);
```

#### Optie B: Supabase Setup (Aanbevolen)

1. **Maak Supabase account** op https://supabase.com
2. **Maak nieuw project**
3. **Maak tabel** in SQL Editor:
   ```sql
   CREATE TABLE content (
     id TEXT PRIMARY KEY DEFAULT 'main',
     data JSONB NOT NULL,
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```
4. **Deploy backend** (zie voorbeeld hieronder)

**Backend Code Voorbeeld (Supabase):**

```javascript
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get('/api/content', async (req, res) => {
  const { data, error } = await supabase
    .from('content')
    .select('data')
    .eq('id', 'main')
    .single();
  
  if (error || !data) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(data.data);
});

app.put('/api/content', async (req, res) => {
  const { error } = await supabase
    .from('content')
    .upsert({ id: 'main', data: req.body });
  
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ success: true });
});

app.listen(3001);
```

#### Optie C: Eigen Server Setup

1. **Kies hosting provider** (Heroku, Railway, DigitalOcean, etc.)
2. **Deploy backend code** (zie `API_SETUP.md` voor voorbeelden)
3. **Configureer database**
4. **Zet environment variables**

---

### Stap 3: Frontend Configureren

Voeg API URL toe aan `.env.local`:

```env
# Backend API URL
VITE_API_BASE_URL=https://jouw-api-url.com/api

# Voor development:
# VITE_API_BASE_URL=http://localhost:3001/api
```

**Herstart development server:**
```bash
npm run dev
```

---

### Stap 4: Testen

1. ✅ Open website
2. ✅ Klik op instellingen-icoon (⚙️)
3. ✅ Log in met admin credentials
4. ✅ Maak een kleine wijziging
5. ✅ Controleer status indicator onderaan:
   - Zie je "Opgeslagen op de server"? ✅ Werkt!
   - Zie je "Opgeslagen in browser"? ⚠️ API niet bereikbaar

---

## Dagelijks Gebruik

### Content Bewerken

1. **Open website** → Klik op ⚙️ rechtsonder
2. **Log in** met je credentials
3. **Selecteer tab** (Hero, Oplossingen, etc.)
4. **Bewerk velden** - wijzigingen worden automatisch opgeslagen
5. **Controleer status** - onderaan zie je of opslaan gelukt is

### Afbeeldingen Toevoegen

**Optie 1: Via URL**
- Klik op "URL" tab
- Plak afbeeldings-URL
- Preview verschijnt automatisch

**Optie 2: Direct Upload**
- Klik op "Upload" tab
- Sleep bestand of klik om te selecteren
- Maximaal 5MB per afbeelding

### Oplossingen Beheren

- **Toevoegen**: Klik "Nieuwe Oplossing Toevoegen"
- **Bewerken**: Klik op oplossing in lijst
- **Verwijderen**: Klik op verwijder-knop bij oplossing

---

## Veelgestelde Vragen

### Q: Moet ik een backend hebben?

**A:** Nee! Voor development/testen werkt het prima zonder backend. Voor productie met meerdere gebruikers is een backend aanbevolen.

### Q: Welke optie is het beste voor mij?

**A:** 
- **Beginner zonder technische kennis**: Firebase/Supabase (serverless)
- **Basis programmeerkennis**: Node.js/Python backend
- **Bestaande hosting**: PHP backend

### Q: Hoeveel kost het?

**A:**
- **Zonder backend**: Gratis (alleen hosting voor website)
- **Met serverless**: Gratis-$10/maand
- **Met eigen server**: $5-20/maand

### Q: Kan ik meerdere beheerders hebben?

**A:** Ja! Met een backend API kunnen meerdere mensen tegelijk inloggen en bewerken. Zonder backend werkt het alleen lokaal per browser.

### Q: Gaan mijn wijzigingen verloren?

**A:** 
- **Met backend**: Nee, alles wordt opgeslagen op de server
- **Zonder backend**: Alleen als je browserdata wist of een andere browser gebruikt

### Q: Hoe beveilig ik mijn admin panel?

**A:**
- Gebruik een sterk wachtwoord
- Deel credentials niet
- Overweeg IP whitelisting op backend (geavanceerd)
- Gebruik HTTPS in productie

### Q: Kan ik wijzigingen terugdraaien?

**A:** Momenteel niet automatisch. Je kunt:
- Handmatig terugzetten via admin panel
- Backend met versiegeschiedenis implementeren (geavanceerd)

### Q: Werkt het offline?

**A:** 
- **Met backend**: Wijzigingen worden opgeslagen in browser als backup, maar worden naar server gesynchroniseerd zodra online
- **Zonder backend**: Ja, volledig offline

---

## Hulp Nodig?

- 📖 Zie `API_SETUP.md` voor technische details
- 🔧 Check browser console voor foutmeldingen
- 💬 Controleer of API URL correct is ingesteld
- 🔍 Test API met: `curl https://jouw-api-url.com/api/health`

---

## Checklist voor Productie

- [ ] Admin credentials ingesteld en veilig bewaard
- [ ] Backend API geconfigureerd en getest
- [ ] API URL correct ingesteld in `.env.local`
- [ ] HTTPS ingeschakeld (voor veiligheid)
- [ ] Database backups ingesteld
- [ ] Test wijzigingen maken en controleren
- [ ] Status indicator toont "Opgeslagen op de server"

**Succes met je website beheer! 🚀**
