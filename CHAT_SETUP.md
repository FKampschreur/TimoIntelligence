# Chat Widget Setup Guide

## Overzicht
Deze chat widget gebruikt Google Gemini AI via de Google AI Studio API om bezoekers van de Timo Intelligence website te helpen.

## Installatie

### 1. Google API Key ophalen
1. Ga naar [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Maak een nieuw API key aan
3. Kopieer de API key

### 2. Environment Variables instellen
Maak een `.env.local` bestand in de root van het project met de volgende inhoud:

```env
GEMINI_API_KEY=AIzaSyC0SFihSEpIzKtC_N00uwGsw22S7OQ8lzQ
PORT=3001
VITE_DEV_URL=http://localhost:3000
```

**BELANGRIJK:** 
- De variabele moet `GEMINI_API_KEY` heten
- Geen spaties rond de `=`
- Geen quotes nodig

**Belangrijk:** 
- Gebruik `.env.local` (dit bestand wordt automatisch genegeerd door git)
- Of gebruik `.env` als alternatief
- De backend server leest beide bestanden (`.env.local` heeft voorrang)

### 3. Servers starten

#### Optie A: Beide servers tegelijk (aanbevolen)
```bash
npm run dev:all
```

Dit start zowel de Vite dev server (poort 3000) als de backend API server (poort 3001).

#### Optie B: Apart starten
Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run server
```

## Functionaliteit

### Chat Widget Features
- ✅ Zwevende chat knop rechtsonder
- ✅ Clean chatvenster met Timo branding
- ✅ Streaming responses (letter voor letter)
- ✅ Meertalige ondersteuning (Nederlands/Engels)
- ✅ Outlook integratie via mailto links

### Outlook Switch Logica
Wanneer de AI detecteert dat een gebruiker interesse heeft in een offerte of sales gesprek:
1. De AI voegt `[ACTION_EMAIL]` toe aan het einde van het bericht
2. Dit codewoord wordt automatisch verborgen voor de gebruiker
3. Er verschijnt een prominente CTA button: "Stuur uw aanvraag direct naar ons"
4. Klikken op de button opent een mailto link met:
   - Email: info@timointelligence.nl
   - Subject: "Aanvraag via Timo Intelligence Website"
   - Body: Volledige gesprekscontext

## System Prompt
De AI is geconfigureerd met een system prompt die informatie bevat over:
- Timo Intelligence en haar diensten
- Frank Kampschreur als leider van het bedrijf
- Focus op Timo Fleet, Timo Tender, Timo Insights, en Timo Vision
- Automatische taal detectie (Nederlands/Engels)
- Wanneer [ACTION_EMAIL] te gebruiken

## API Endpoints

### POST /api/chat
Chat endpoint voor AI gesprekken.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Hallo, wat doet Timo Intelligence?" }
  ]
}
```

**Response:**
Streaming text response (Server-Sent Events format)

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "gemini-chat-api"
}
```

## Troubleshooting

### Chat werkt niet
1. Check of beide servers draaien (frontend op 3000, backend op 3001)
2. Controleer of `GEMINI_API_KEY` correct is ingesteld in `.env.local` of `.env`
3. Check de browser console voor errors
4. Check de backend server logs voor API errors

### CORS Errors
Zorg ervoor dat `VITE_DEV_URL` in `.env` overeenkomt met je frontend URL.

### API Key Errors
- Controleer of `GEMINI_API_KEY` correct is ingesteld in `.env.local` of `.env`
- Controleer of je API key geldig is
- Zorg dat je API key niet is beperkt tot specifieke IP's
- Check of je quota niet is overschreden op Google AI Studio

## Productie Deployment

Voor productie:

### Frontend (Vite Build)
1. Stel `VITE_CHAT_API_URL` in als build-time environment variable:
   ```env
   VITE_CHAT_API_URL=https://www.timointelligence.nl:3001/api/chat
   ```
   Of als je een aparte API subdomain hebt:
   ```env
   VITE_CHAT_API_URL=https://api.timointelligence.nl/api/chat
   ```

2. Build de frontend:
   ```bash
   npm run build
   ```

### Backend Server
1. Stel `GEMINI_API_KEY` in als environment variable op je hosting platform
2. Stel `VITE_PRODUCTION_URL` in voor CORS:
   ```env
   VITE_PRODUCTION_URL=https://www.timointelligence.nl
   ```
3. Zorg dat de backend server bereikbaar is op poort 3001 (of configureer een andere poort)
4. De CORS configuratie staat nu automatisch zowel localhost als productie URLs toe

### Belangrijk voor Productie
- De backend server moet publiek bereikbaar zijn op dezelfde hostname of een subdomain
- Als je een reverse proxy gebruikt (zoals nginx), zorg dat deze correct is geconfigureerd
- De chat widget detecteert automatisch of het in productie draait en gebruikt de juiste API URL
