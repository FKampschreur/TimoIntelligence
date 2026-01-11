# Chat API 404 Error - Oplossing

## Probleem Analyse

Je krijgt een **404 Not Found** error bij `POST http://localhost:3001/api/chat`. 

**Belangrijk:** Dit project gebruikt **Vite + React + Express**, niet Next.js. Er is geen `app/api/chat/route.ts` bestand nodig.

## Oorzaak

Er draait waarschijnlijk een ander proces op poort 3001 dat HTML teruggeeft in plaats van JSON. De Express server moet opnieuw gestart worden.

## Oplossing

### Stap 1: Stop alle processen op poort 3001

```powershell
# Zoek het proces ID
netstat -ano | findstr :3001

# Stop het proces (vervang PID met het nummer uit bovenstaande output)
taskkill /PID <PID> /F
```

Of gebruik deze PowerShell commando:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
```

### Stap 2: Controleer .env.local bestand

Zorg dat je `.env.local` bestand bestaat in de root van het project met:

```env
GEMINI_API_KEY=your_google_api_key_here
PORT=3001
VITE_DEV_URL=http://localhost:3000
```

**BELANGRIJK:** 
- De variabele moet `GEMINI_API_KEY` heten
- Geen spaties rond de `=`
- Geen quotes nodig

### Stap 3: Start de servers opnieuw

**Optie A: Beide servers tegelijk (aanbevolen)**
```bash
npm run dev:all
```

**Optie B: Apart starten**
```bash
# Terminal 1 - Frontend (poort 3000)
npm run dev

# Terminal 2 - Backend (poort 3001)
npm run server
```

### Stap 4: Test de server

```bash
npm run test:chat
```

Of test handmatig:
```bash
# Test health endpoint
curl http://localhost:3001/health

# Test chat endpoint
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hallo"}]}'
```

## Project Structuur

Dit project heeft de volgende structuur:

```
TimoIntelligence/
├── server/
│   └── index.js          ← Express server (poort 3001)
├── components/
│   └── ChatWidget.tsx    ← Frontend chat component
└── .env.local            ← Environment variables
```

**GEEN Next.js App Router structuur:**
- ❌ Geen `app/api/chat/route.ts`
- ❌ Geen `pages/api/chat.ts`
- ✅ Express server in `server/index.js`

## API Endpoint Details

### Backend (Express Server)
- **Bestand:** `server/index.js`
- **Endpoint:** `POST /api/chat`
- **Poort:** 3001 (configureerbaar via `PORT` in `.env.local`)
- **API Key:** `GEMINI_API_KEY`

### Frontend (Vite + React)
- **Component:** `components/ChatWidget.tsx`
- **API URL:** `http://localhost:3001/api/chat` (development)
- **Configuratie:** Via `VITE_CHAT_API_URL` in `.env.local` (optioneel)

## Environment Variables

### Voor Backend Server (`server/index.js`)
```env
GEMINI_API_KEY=your_google_api_key_here
PORT=3001
VITE_DEV_URL=http://localhost:3000
```

### Voor Frontend (optioneel)
```env
VITE_CHAT_API_URL=http://localhost:3001/api/chat
```

**Let op:** 
- Backend variabelen beginnen NIET met `VITE_`
- Frontend variabelen MOETEN beginnen met `VITE_` (Vite requirement)

## Troubleshooting

### Server geeft HTML terug in plaats van JSON
- **Oorzaak:** Er draait een andere server op poort 3001
- **Oplossing:** Stop alle processen op poort 3001 en start de Express server opnieuw

### "API key not configured" error
- **Oorzaak:** `GEMINI_API_KEY` niet ingesteld of verkeerde naam
- **Oplossing:** Controleer `.env.local` bestand, gebruik exact `GEMINI_API_KEY`

### CORS errors
- **Oorzaak:** `VITE_DEV_URL` komt niet overeen met frontend URL
- **Oplossing:** Zorg dat `VITE_DEV_URL` in `.env.local` overeenkomt met je frontend URL (standaard `http://localhost:3000`)

### 404 Not Found
- **Oorzaak:** Server draait niet of verkeerde poort
- **Oplossing:** 
  1. Controleer of server draait: `npm run check:server`
  2. Start server: `npm run server`
  3. Controleer poort in terminal output

## Als je WEL naar Next.js wilt migreren

Als je dit project naar Next.js 14 App Router wilt migreren, zou je het volgende nodig hebben:

### 1. Maak `app/api/chat/route.ts`:

```typescript
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const model = google('gemini-3-flash-preview', {
    apiKey: process.env.GEMINI_API_KEY,
  });

  const result = await streamText({
    model,
    messages,
  });

  return result.toDataStreamResponse();
}
```

### 2. Environment Variable voor Next.js:

```env
GEMINI_API_KEY=your_key_here
```

**Maar:** Je huidige setup (Vite + Express) werkt perfect en is eenvoudiger voor development. Migratie naar Next.js is alleen nodig als je Next.js features nodig hebt.
