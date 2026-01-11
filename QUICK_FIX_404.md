# Quick Fix: 404 Error op /api/chat

## Het Probleem

Je krijgt een 404 error omdat de backend server niet bereikbaar is op `https://www.timointelligence.nl/api/chat`.

## Snelle Diagnose

Test eerst of de backend bereikbaar is:

```bash
# Test direct vanaf je browser of terminal
curl https://www.timointelligence.nl/api/health
```

**Als dit een 404 geeft:** De backend server draait niet of nginx is niet geconfigureerd.

## Oplossingen

### Oplossing 1: Backend Server Starten (Als je een eigen server hebt)

Als je een VPS of eigen server hebt waar je backend kan draaien:

1. **SSH naar je server**
2. **Start de backend server:**
   ```bash
   cd /path/to/TimoIntelligence
   export GEMINI_API_KEY=your_api_key_here
   export PORT=3001
   export VITE_PRODUCTION_URL=https://www.timointelligence.nl
   node server/index.js
   ```

3. **Of gebruik PM2 voor permanente draai:**
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name timo-chat-api
   pm2 save
   pm2 startup  # Volg instructies
   ```

4. **Configureer nginx** (zie `REVERSE_PROXY_SETUP.md`)

5. **Test:**
   ```bash
   curl https://www.timointelligence.nl/api/health
   ```

### Oplossing 2: Deploy naar Railway (Aanbevolen - Eenvoudigst)

Als je geen eigen server hebt:

1. **Ga naar [Railway.app](https://railway.app)**
2. **Maak een nieuw project**
3. **Connect je GitHub repository**
4. **Railway detecteert automatisch Node.js**
5. **Stel environment variables in:**
   ```
   GEMINI_API_KEY=your_google_api_key_here
   PORT=3001
   VITE_PRODUCTION_URL=https://www.timointelligence.nl
   ```
6. **Railway geeft je een URL zoals:** `https://your-app.railway.app`
7. **Stel in Vercel → Settings → Environment Variables:**
   ```
   VITE_CHAT_API_URL=https://your-app.railway.app/api/chat
   ```
8. **Rebuild Vercel deployment**

### Oplossing 3: Deploy naar Render

Alternatief voor Railway:

1. **Ga naar [Render.com](https://render.com)**
2. **Maak een nieuwe "Web Service"**
3. **Connect GitHub repository**
4. **Instellingen:**
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
   - Environment: Node
5. **Stel environment variables in** (zelfde als Railway)
6. **Render geeft je een URL**
7. **Stel VITE_CHAT_API_URL in Vercel** met die URL
8. **Rebuild Vercel deployment**

## Verificatie

Na het deployen van de backend:

1. **Test backend health:**
   ```bash
   curl https://your-backend-url/health
   ```
   Verwacht: `{"status":"ok"}`

2. **Test chat endpoint:**
   ```bash
   curl https://your-backend-url/api/chat/test \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

3. **Test frontend:**
   - Open `https://www.timointelligence.nl`
   - Open browser console (F12)
   - Test de chat widget

## Belangrijk

- **Backend moet altijd draaien** voor de chat widget om te werken
- **CORS moet correct zijn** - backend moet `https://www.timointelligence.nl` toestaan
- **Environment variables** moeten correct zijn ingesteld op beide (frontend en backend)

## Nog Steeds Problemen?

1. Check backend logs: `pm2 logs timo-chat-api` of check Railway/Render logs
2. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Test backend direct: `curl http://localhost:3001/health` (vanaf server)
4. Check CORS: Backend moet `VITE_PRODUCTION_URL=https://www.timointelligence.nl` hebben
