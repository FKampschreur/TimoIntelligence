# Reverse Proxy Setup - Geen URL Configuratie Nodig

Als je een reverse proxy (nginx) hebt die `/api/chat` naar je backend proxyt, hoef je **geen** `VITE_CHAT_API_URL` in te stellen. De chat widget gebruikt automatisch `https://www.timointelligence.nl/api/chat`.

## Vereisten

Voor deze setup moet je hebben:

1. **Backend server draait** op `localhost:3001` (of een andere poort)
2. **Nginx reverse proxy** geconfigureerd die `/api/chat` naar de backend proxyt
3. **Backend server is bereikbaar** via de reverse proxy

## Nginx Configuratie

Hier is een voorbeeld nginx configuratie:

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.timointelligence.nl timointelligence.nl;
    
    # SSL certificaten (gebruik Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/timointelligence.nl/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/timointelligence.nl/privkey.pem;
    
    # Frontend files (Vercel of statische files)
    root /var/www/timointelligence;
    index index.html;
    
    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API - Reverse proxy naar Express server
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        
        # Headers voor WebSocket support (als nodig)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # Standaard headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

## Backend Server Starten

Zorg dat je backend server draait:

```bash
# Op je server
cd /path/to/TimoIntelligence
npm install
export GEMINI_API_KEY=your_api_key_here
export PORT=3001
export VITE_PRODUCTION_URL=https://www.timointelligence.nl
node server/index.js
```

Of gebruik PM2 voor process management:

```bash
npm install -g pm2
pm2 start server/index.js --name timo-chat-api
pm2 save
pm2 startup  # Volg instructies voor auto-start bij reboot
```

## Verificatie

Test of alles werkt:

1. **Backend health check:**
   ```bash
   curl https://www.timointelligence.nl/api/health
   ```
   Verwacht: `{"status":"ok"}`

2. **Backend root:**
   ```bash
   curl https://www.timointelligence.nl/api/
   ```
   Verwacht: JSON met server info

3. **Chat endpoint (test):**
   ```bash
   curl -X POST https://www.timointelligence.nl/api/chat/test \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

4. **Frontend:** Open `https://www.timointelligence.nl` en test de chat widget

## Troubleshooting

### 404 Error op /api/chat

**Probleem:** Backend server niet bereikbaar via reverse proxy

**Oplossing:**
1. Controleer of backend server draait: `curl http://localhost:3001/health`
2. Controleer nginx config: `sudo nginx -t`
3. Herlaad nginx: `sudo systemctl reload nginx`
4. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
5. Check of poort 3001 open is: `netstat -tulpn | grep 3001`

### CORS Errors

**Probleem:** Backend staat frontend origin niet toe

**Oplossing:**
- Zorg dat `VITE_PRODUCTION_URL=https://www.timointelligence.nl` is ingesteld op de backend server
- Herstart de backend server na het instellen van environment variables

### Backend Server Start Niet

**Probleem:** Backend server crasht of start niet

**Oplossing:**
1. Check logs: `pm2 logs timo-chat-api` of `node server/index.js` (direct)
2. Controleer of `GEMINI_API_KEY` is ingesteld
3. Controleer of poort 3001 niet al in gebruik is: `lsof -i :3001`

### Nginx Proxy Pass Werkt Niet

**Probleem:** Nginx kan niet verbinden met backend

**Oplossing:**
1. Controleer of backend luistert op `localhost:3001` (niet `127.0.0.1` of externe IP)
2. Controleer firewall: `sudo ufw status`
3. Test direct: `curl http://localhost:3001/health` (vanaf server)

## Belangrijke Punten

1. **Geen VITE_CHAT_API_URL nodig:** De chat widget gebruikt automatisch `/api/chat` op hetzelfde domain
2. **Backend moet draaien:** Zorg dat de backend server altijd draait (gebruik PM2 of systemd)
3. **Nginx configuratie:** Zorg dat `/api/` correct naar de backend proxyt
4. **SSL:** Gebruik HTTPS in productie (Let's Encrypt is gratis)
5. **Environment variables:** Backend heeft `GEMINI_API_KEY` en `VITE_PRODUCTION_URL` nodig

## Alternatief: Vercel Serverless Functions

Als je geen eigen server hebt, kun je ook Vercel serverless functions gebruiken. Dit vereist wel code aanpassingen. Zie `VERCEL_DEPLOYMENT.md` voor alternatieve oplossingen.
