# Vercel Deployment Guide - Backend Server Setup

## Probleem: "NOT_FOUND" Error op Vercel

Als je frontend op Vercel draait en je krijgt een "NOT_FOUND" error, betekent dit dat de backend Express server niet bereikbaar is. Vercel kan alleen statische sites en serverless functions hosten, niet een continue draaiende Express server.

## Oplossing: Backend Server Apart Deployen

Je hebt twee opties:

### Optie 1: Backend op Aparte Server (Aanbevolen)

Deploy de backend server (`server/index.js`) naar een platform dat Node.js servers ondersteunt:

#### Railway (Aanbevolen - Eenvoudig)
1. Ga naar [Railway.app](https://railway.app)
2. Maak een nieuw project
3. Connect je GitHub repository
4. Selecteer "Deploy from GitHub repo"
5. Kies je repository
6. Railway detecteert automatisch dat het een Node.js project is
7. Stel environment variables in:
   ```
   GEMINI_API_KEY=your_google_api_key_here
   PORT=3001
   VITE_PRODUCTION_URL=https://www.timointelligence.nl
   ```
8. Railway geeft je een URL zoals: `https://your-app.railway.app`
9. Update je Vercel environment variables:
   ```
   VITE_CHAT_API_URL=https://your-app.railway.app/api/chat
   ```
10. Rebuild je Vercel deployment

#### Render (Alternatief)
1. Ga naar [Render.com](https://render.com)
2. Maak een nieuwe "Web Service"
3. Connect je GitHub repository
4. Instellingen:
   - **Build Command:** `npm install`
   - **Start Command:** `node server/index.js`
   - **Environment:** Node
5. Stel environment variables in (zelfde als Railway)
6. Render geeft je een URL zoals: `https://your-app.onrender.com`
7. Update Vercel environment variables met deze URL

#### VPS (Virtual Private Server)
Als je een eigen VPS hebt:
1. SSH naar je server
2. Clone je repository
3. Installeer Node.js en npm
4. Stel environment variables in
5. Start de server met PM2:
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name timo-chat-api
   pm2 save
   pm2 startup
   ```
6. Configureer nginx als reverse proxy (optioneel)

### Optie 2: Vercel Serverless Functions (Geavanceerd)

Je kunt de backend omzetten naar Vercel serverless functions, maar dit vereist code aanpassingen.

## Stappen voor Vercel Frontend

### 1. Stel Environment Variables in Vercel

1. Ga naar je Vercel project dashboard
2. Ga naar **Settings** → **Environment Variables**
3. Voeg toe:
   ```
   VITE_CHAT_API_URL=https://your-backend-url.com/api/chat
   ```
   **BELANGRIJK:** Gebruik `VITE_` prefix zodat Vite deze variable in de build kan gebruiken

### 2. Rebuild je Deployment

Na het instellen van environment variables:
1. Ga naar **Deployments** tab
2. Klik op de drie puntjes van de laatste deployment
3. Kies **Redeploy**
4. Of push een nieuwe commit naar GitHub (Vercel deployt automatisch)

### 3. Verificatie

Test of alles werkt:
1. Open je website: `https://www.timointelligence.nl`
2. Open browser console (F12)
3. Je zou moeten zien: `🔗 Using VITE_CHAT_API_URL: https://your-backend-url.com/api/chat`
4. Test de chat widget

## Troubleshooting

### Error: "NOT_FOUND" of "404"
- **Oorzaak:** Backend server is niet bereikbaar op de ingestelde URL
- **Oplossing:** 
  - Controleer of de backend server draait
  - Test de backend URL direct: `https://your-backend-url.com/health`
  - Controleer of `VITE_CHAT_API_URL` correct is ingesteld in Vercel
  - Rebuild de Vercel deployment na het instellen van environment variables

### Error: "Failed to fetch" of "NetworkError"
- **Oorzaak:** CORS probleem of backend server niet bereikbaar
- **Oplossing:**
  - Controleer of `VITE_PRODUCTION_URL` is ingesteld op de backend server
  - Controleer backend logs voor CORS errors
  - Test of de backend URL bereikbaar is vanaf je browser

### Error: "API key is missing"
- **Oorzaak:** `GEMINI_API_KEY` niet ingesteld op backend server
- **Oplossing:**
  - Stel `GEMINI_API_KEY` in op je backend hosting platform
  - Herstart de backend server
  - Controleer backend logs

## Belangrijke Punten

1. **Environment Variables:** 
   - Frontend (Vercel): `VITE_CHAT_API_URL` (build-time)
   - Backend (Railway/Render/VPS): `GEMINI_API_KEY`, `PORT`, `VITE_PRODUCTION_URL` (runtime)

2. **Build-time vs Runtime:**
   - `VITE_*` variables worden ingebouwd in de frontend build
   - Je moet de frontend rebuilden na het wijzigen van `VITE_CHAT_API_URL`
   - Backend environment variables worden gelezen bij server start

3. **CORS:**
   - De backend server staat automatisch `https://www.timointelligence.nl` toe
   - Als je een andere frontend URL gebruikt, voeg deze toe aan `VITE_PRODUCTION_URL`

4. **HTTPS:**
   - Zorg dat zowel frontend als backend HTTPS gebruiken in productie
   - Railway en Render bieden automatisch HTTPS

## Quick Start Checklist

- [ ] Backend server gedeployed naar Railway/Render/VPS
- [ ] Backend environment variables ingesteld (`GEMINI_API_KEY`, `PORT`, `VITE_PRODUCTION_URL`)
- [ ] Backend URL getest (bijvoorbeeld: `https://your-backend.railway.app/health`)
- [ ] `VITE_CHAT_API_URL` ingesteld in Vercel environment variables
- [ ] Vercel deployment gerebuild
- [ ] Chat widget getest op productie website
