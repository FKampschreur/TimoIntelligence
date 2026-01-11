# Productie Deployment Guide - Chat Widget

## Probleem: CORS en API URL in Productie

Wanneer je website online draait op `https://www.timointelligence.nl`, moet de chat widget verbinden met een publiek bereikbare API server, niet met `localhost`.

## Oplossing

### Optie 1: Backend opzelfde server (Aanbevolen)

Als je backend server op dezelfde server draait als je frontend:

1. **Frontend Build Environment Variables:**
   ```env
   VITE_CHAT_API_URL=https://www.timointelligence.nl:3001/api/chat
   ```

2. **Backend Server Environment Variables:**
   ```env
   GEMINI_API_KEY=your_google_api_key_here
   PORT=3001
   VITE_PRODUCTION_URL=https://www.timointelligence.nl
   ```

3. **CORS is automatisch geconfigureerd** om `https://www.timointelligence.nl` toe te staan

### Optie 2: Backend op aparte subdomain

Als je backend op een aparte subdomain draait (bijvoorbeeld `api.timointelligence.nl`):

1. **Frontend Build Environment Variables:**
   ```env
   VITE_CHAT_API_URL=https://api.timointelligence.nl/api/chat
   ```

2. **Backend Server Environment Variables:**
   ```env
   GEMINI_API_KEY=your_google_api_key_here
   PORT=3001
   VITE_PRODUCTION_URL=https://www.timointelligence.nl
   ```

3. **DNS Configuratie:** Zorg dat `api.timointelligence.nl` naar je backend server wijst

### Optie 3: Reverse Proxy (Nginx)

Als je een reverse proxy gebruikt om de backend te bereiken:

**Nginx Configuratie:**
```nginx
# Frontend (poort 80/443)
server {
    listen 443 ssl;
    server_name www.timointelligence.nl;
    
    # Frontend files
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend API (via reverse proxy)
server {
    listen 443 ssl;
    server_name www.timointelligence.nl;
    
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Frontend Build Environment Variables:**
```env
VITE_CHAT_API_URL=https://www.timointelligence.nl/api/chat
```

## Stappen voor Productie Deployment

### 1. Frontend Build

```bash
# Stel environment variables in voor build
export VITE_CHAT_API_URL=https://www.timointelligence.nl:3001/api/chat

# Build de frontend
npm run build

# De dist folder bevat je productie build
```

### 2. Backend Server Starten

```bash
# Stel environment variables in
export GEMINI_API_KEY=your_google_api_key_here
export PORT=3001
export VITE_PRODUCTION_URL=https://www.timointelligence.nl

# Start de server
npm run server

# Of gebruik PM2 voor process management:
pm2 start server/index.js --name timo-chat-api
```

### 3. Verificatie

Test of alles werkt:
- Frontend: `https://www.timointelligence.nl`
- Backend Health: `https://www.timointelligence.nl:3001/health`
- Chat Widget: Open de chat widget op de website en stuur een test bericht

## Belangrijke Punten

1. **HTTPS Vereist:** In productie moet alles via HTTPS gaan
2. **CORS:** De server staat nu automatisch zowel localhost als productie URLs toe
3. **API Key:** Zorg dat `GEMINI_API_KEY` veilig is ingesteld (niet in git!)
4. **Poort:** Backend draait standaard op poort 3001, maar kan worden aangepast via `PORT` environment variable

## Troubleshooting

### CORS Errors
- Controleer of `VITE_PRODUCTION_URL` correct is ingesteld op de backend
- Controleer of de frontend URL overeenkomt met wat in CORS staat
- Check server logs voor CORS warnings

### 404 Errors
- Controleer of de backend server draait
- Controleer of de API URL correct is in `VITE_CHAT_API_URL`
- Test de health endpoint: `https://www.timointelligence.nl:3001/health`

### API Key Errors
- Controleer of `GEMINI_API_KEY` is ingesteld op de backend server
- Controleer of de API key geldig is en niet is beperkt tot specifieke IP's
- Check server logs voor API key errors
