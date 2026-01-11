# Vercel Environment Variable Setup - Quick Guide

## Probleem: Chat Widget gebruikt verkeerde API URL

Als je ziet: `🔗 API URL being used: https://www.timointelligence.nl/api/chat`

Dit betekent dat `VITE_CHAT_API_URL` niet is ingesteld in Vercel.

## Oplossing: Stel VITE_CHAT_API_URL in

### Stap 1: Bepaal je Backend URL

Je hebt twee opties:

#### Optie A: Backend op aparte server (Railway/Render/VPS)
Als je backend op Railway, Render of een VPS draait:
```
VITE_CHAT_API_URL=https://your-backend.railway.app/api/chat
```
of
```
VITE_CHAT_API_URL=https://your-backend.onrender.com/api/chat
```

#### Optie B: Reverse Proxy (nginx)
Als je een nginx reverse proxy hebt die `/api/chat` naar je backend proxyt:
```
VITE_CHAT_API_URL=https://www.timointelligence.nl/api/chat
```
**Maar:** Je backend server moet dan wel draaien en de reverse proxy moet correct geconfigureerd zijn!

### Stap 2: Voeg Environment Variable toe in Vercel

1. Ga naar je Vercel project dashboard
2. Klik op **Settings** (instellingen)
3. Klik op **Environment Variables** (omgevingsvariabelen)
4. Klik op **Add New**
5. Vul in:
   - **Key:** `VITE_CHAT_API_URL`
   - **Value:** Je backend URL (bijvoorbeeld `https://your-backend.railway.app/api/chat`)
   - **Environment:** Selecteer alle omgevingen (Production, Preview, Development)
6. Klik op **Save**

### Stap 3: Rebuild Deployment

Na het instellen van de environment variable:

1. Ga naar **Deployments** tab
2. Klik op de drie puntjes (⋯) van je laatste deployment
3. Klik op **Redeploy**
4. Wacht tot de deployment klaar is

**OF** push een nieuwe commit naar GitHub (Vercel deployt automatisch)

### Stap 4: Verificatie

Na de rebuild:

1. Open je website: `https://www.timointelligence.nl`
2. Open browser console (F12)
3. Je zou moeten zien: `🔗 Using VITE_CHAT_API_URL: https://your-backend-url/api/chat`
4. Test de chat widget

## Belangrijke Punten

1. **VITE_ prefix:** Gebruik altijd `VITE_` prefix voor environment variables die in de frontend build moeten komen
2. **Build-time:** `VITE_CHAT_API_URL` wordt ingebouwd tijdens de build, niet runtime
3. **Rebuild vereist:** Je moet de deployment rebuilden na het instellen van environment variables
4. **Backend moet draaien:** Zorg dat je backend server draait voordat je test

## Troubleshooting

### Nog steeds verkeerde URL?
- Controleer of je de deployment hebt gerebuild na het instellen van de variable
- Controleer of de variable naam exact is: `VITE_CHAT_API_URL` (hoofdletters!)
- Controleer of je de variable hebt ingesteld voor de juiste environment (Production)

### Backend niet bereikbaar?
- Test de backend URL direct in je browser: `https://your-backend-url/health`
- Controleer of de backend server draait
- Controleer CORS configuratie op de backend

### 404 Error?
- Controleer of de backend URL eindigt met `/api/chat`
- Controleer of de backend server de `/api/chat` route heeft
- Test de backend endpoint met een tool zoals Postman of curl
