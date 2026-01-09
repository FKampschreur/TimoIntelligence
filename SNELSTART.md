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

3. **Start de website**
   ```bash
   npm run dev
   ```

4. **Open website en begin met bewerken**
   - Ga naar http://localhost:3000 (of de poort die Vite aangeeft)
   - Klik op ⚙️ rechtsonder
   - Begin direct met bewerken!

**✅ Klaar!** Wijzigingen worden opgeslagen in je browser.

---

### Productie Setup (Met Backend - 30-60 minuten)

**Voor live website met persistentie:**

#### Optie 1: Firebase (Aanbevolen - Eenvoudigst)

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
- Met Firebase: Gratis voor kleine sites
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
- [ ] `npm run dev` gestart
- [ ] Admin panel geopend (⚙️ rechtsonder)
- [ ] Test wijziging gemaakt
- [ ] (Optioneel) Backend API geconfigureerd

**Klaar om te beginnen! 🎉**
