# Environment Variables Overzicht

## 📡 Optioneel: Backend API

Als je een backend server gebruikt voor content opslag:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

**Wanneer nodig:**
- Als je een eigen API server hebt
- Als je content op de server wilt opslaan (niet alleen in browser)

**Als niet ingesteld:**
- Applicatie gebruikt automatisch localStorage (browser opslag)
- Content wordt alleen lokaal opgeslagen

## 💬 Chat Widget API

Voor de chatbot functionaliteit:

```env
# Chat API endpoint (OPTIONEEL - gebruikt default localhost:3001 in development)
VITE_CHAT_API_URL=http://localhost:3001/api/chat

# Backend server configuratie (voor server/index.js) - VERPLICHT voor chatbot
# Je kunt GEMINI_API_KEY gebruiken (aanbevolen) of GOOGLE_GENERATIVE_AI_API_KEY
GEMINI_API_KEY=your_google_api_key_here
# OF gebruik:
# GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
PORT=3001
VITE_DEV_URL=http://localhost:3000
```

**BELANGRIJK:** 
- De backend server accepteert beide: `GEMINI_API_KEY` of `GOOGLE_GENERATIVE_AI_API_KEY`
- `GEMINI_API_KEY` wordt automatisch gemapped naar `GOOGLE_GENERATIVE_AI_API_KEY` voor de Google SDK
- Dit is een Express server, geen Next.js API route
- De server code staat in `server/index.js`

**Wanneer nodig:**
- Als je de chatbot wilt gebruiken
- Als je een andere backend URL gebruikt dan localhost:3001

**Als niet ingesteld:**
- Chat widget gebruikt automatisch `http://localhost:3001/api/chat` in development
- In production moet je `VITE_CHAT_API_URL` instellen naar je productie backend URL
- Zonder `GEMINI_API_KEY` werkt de chatbot niet

## 📝 Voorbeeld .env.local

```env
# Backend API (OPTIONEEL - alleen als je backend server gebruikt)
# VITE_API_BASE_URL=http://localhost:3001/api

# Chat Widget API (OPTIONEEL - alleen als je andere URL gebruikt)
# VITE_CHAT_API_URL=http://localhost:3001/api/chat

# Backend server configuratie (VERPLICHT voor chatbot)
# Je kunt GEMINI_API_KEY gebruiken (aanbevolen) of GOOGLE_GENERATIVE_AI_API_KEY
GEMINI_API_KEY=your_google_api_key_here
# OF gebruik:
# GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
PORT=3001
VITE_DEV_URL=http://localhost:3000
```

**Opmerking:** Voor lokale ontwikkeling is alleen `GEMINI_API_KEY` (of `GOOGLE_GENERATIVE_AI_API_KEY`) nodig voor de chatbot. De andere variabelen zijn optioneel. De server ondersteunt beide variabele namen.
