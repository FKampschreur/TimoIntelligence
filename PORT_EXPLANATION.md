# Poort Uitleg - Belangrijk!

## ⚠️ Dit is GEEN Next.js Project

Dit project gebruikt **Vite + React + Express**, niet Next.js.

## Poorten Overzicht

### Poort 3000 - Frontend (Vite Dev Server)
- **Wat:** Je React website/frontend
- **URL:** `http://localhost:3000`
- **Start:** `npm run dev`
- **Dit is waar je website draait!**

### Poort 3001 - Backend API (Express Server)
- **Wat:** Chat API server alleen
- **URL:** `http://localhost:3001`
- **Start:** `npm run server`
- **Dit is alleen voor API calls, NIET voor je website**

## Het Probleem

Als je naar `http://localhost:3001/` gaat, zie je een JSON response omdat:
- Poort 3001 is alleen voor API endpoints
- De Express server heeft geen frontend routes
- Dit is normaal gedrag!

## Oplossing

**Gebruik altijd poort 3000 voor je website:**
- ✅ `http://localhost:3000` → Je website
- ❌ `http://localhost:3001` → Alleen API (geen website)

## Beide Servers Starten

```bash
npm run dev:all
```

Dit start:
- Frontend op poort 3000 (je website)
- Backend op poort 3001 (API server)

## API Endpoints (Poort 3001)

- `GET /` → API server info
- `GET /health` → Health check
- `POST /api/chat` → Chat endpoint
- `GET /api/routes` → Beschikbare routes
- `POST /api/chat/test` → Test endpoint

## Belangrijk

- **Frontend = Poort 3000** (Vite)
- **Backend = Poort 3001** (Express API)
- **Geen Next.js App Router** - dit is een standalone Express server
- **Geen `app/` folder** - dit is een Vite project
