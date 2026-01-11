# Deploy Backend Server - Stap voor Stap

## Het Probleem

Je frontend draait op Vercel en probeert te verbinden met `https://www.timointelligence.nl/api/chat`, maar krijgt een 404 omdat de backend server niet bestaat.

## Oplossing: Deploy Backend naar Railway (5 minuten)

Railway is de snelste en eenvoudigste manier om je backend te deployen.

### Stap 1: Maak Railway Account

1. Ga naar [railway.app](https://railway.app)
2. Klik op **"Start a New Project"**
3. Log in met GitHub (aanbevolen) of email

### Stap 2: Deploy vanuit GitHub

1. Klik op **"Deploy from GitHub repo"**
2. Selecteer je `TimoIntelligence` repository
3. Railway detecteert automatisch dat het een Node.js project is
4. Klik op **"Deploy Now"**

### Stap 3: Configureer de Backend

Railway start automatisch, maar je moet de juiste instellingen configureren:

1. **Klik op je nieuwe service** (bijvoorbeeld "timo-intelligence")
2. Klik op het **Settings** tabblad
3. Scroll naar **"Start Command"**
4. Verander naar: `node server/index.js`
5. Klik op **"Save"**

### Stap 4: Stel Environment Variables In

1. Klik op het **Variables** tabblad
2. Klik op **"New Variable"**
3. Voeg deze variables toe:

```
GEMINI_API_KEY=je_google_api_key_hier
PORT=3001
VITE_PRODUCTION_URL=https://www.timointelligence.nl
```

**BELANGRIJK:** 
- Vervang `je_google_api_key_hier` met je echte Google API key
- Je kunt je API key vinden op [Google AI Studio](https://aistudio.google.com/apikey)

### Stap 5: Krijg je Backend URL

1. Na het deployen geeft Railway je een URL zoals:
   ```
   https://timo-intelligence-production.up.railway.app
   ```
2. **Kopieer deze URL** - je hebt hem nodig voor de volgende stap

### Stap 6: Configureer Vercel

1. Ga naar je Vercel project dashboard
2. Klik op **Settings** → **Environment Variables**
3. Klik op **"Add New"**
4. Vul in:
   - **Key:** `VITE_CHAT_API_URL`
   - **Value:** `https://jouw-railway-url.up.railway.app/api/chat`
     (Vervang `jouw-railway-url` met je echte Railway URL)
   - **Environment:** Selecteer alle (Production, Preview, Development)
5. Klik op **"Save"**

### Stap 7: Rebuild Vercel

1. Ga naar **Deployments** tab
2. Klik op de drie puntjes (⋯) van je laatste deployment
3. Klik op **"Redeploy"**
4. Wacht tot de deployment klaar is (1-2 minuten)

### Stap 8: Test

1. Open `https://www.timointelligence.nl`
2. Open browser console (F12)
3. Je zou moeten zien: `🔗 Using VITE_CHAT_API_URL: https://jouw-railway-url/api/chat`
4. Test de chat widget

## Verificatie

Test of de backend werkt:

```bash
# Test backend health endpoint
curl https://jouw-railway-url.up.railway.app/health

# Test chat endpoint
curl https://jouw-railway-url.up.railway.app/api/chat/test \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## Troubleshooting

### Backend start niet op Railway

**Probleem:** Railway kan de server niet starten

**Oplossing:**
1. Check Railway logs: Klik op je service → **"Deployments"** → Klik op de laatste deployment → **"View Logs"**
2. Controleer of `Start Command` is ingesteld op `node server/index.js`
3. Controleer of alle dependencies zijn geïnstalleerd (Railway doet dit automatisch)

### API Key Error

**Probleem:** Backend geeft "API key is missing" error

**Oplossing:**
1. Controleer of `GEMINI_API_KEY` correct is ingesteld in Railway Variables
2. Controleer of je de juiste API key hebt (van Google AI Studio)
3. Herstart de deployment na het instellen van variables

### CORS Error

**Probleem:** Frontend kan niet verbinden vanwege CORS

**Oplossing:**
1. Controleer of `VITE_PRODUCTION_URL=https://www.timointelligence.nl` is ingesteld in Railway
2. Herstart de Railway deployment
3. Controleer Railway logs voor CORS errors

### Vercel gebruikt nog oude URL

**Probleem:** Vercel gebruikt nog steeds `https://www.timointelligence.nl/api/chat`

**Oplossing:**
1. Controleer of `VITE_CHAT_API_URL` correct is ingesteld in Vercel
2. Controleer of je de deployment hebt gerebuild na het instellen van de variable
3. Hard refresh je browser (Ctrl+Shift+R of Cmd+Shift+R)

## Kosten

- **Railway:** Gratis tier met $5 gratis credits per maand (genoeg voor kleine projecten)
- **Vercel:** Gratis voor statische sites
- **Totaal:** Gratis voor kleine/medium projecten

## Alternatief: Render

Als Railway niet werkt, kun je ook Render gebruiken:

1. Ga naar [render.com](https://render.com)
2. Maak een nieuwe **"Web Service"**
3. Connect GitHub repository
4. Instellingen:
   - **Build Command:** `npm install`
   - **Start Command:** `node server/index.js`
   - **Environment:** Node
5. Stel dezelfde environment variables in
6. Render geeft je een URL zoals: `https://timo-intelligence.onrender.com`
7. Gebruik deze URL in Vercel `VITE_CHAT_API_URL`

## Hulp Nodig?

Als je vastloopt:
1. Check Railway logs voor errors
2. Check Vercel deployment logs
3. Test de backend URL direct in je browser
4. Controleer of alle environment variables correct zijn ingesteld
