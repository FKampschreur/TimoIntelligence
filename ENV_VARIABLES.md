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

## 📝 Voorbeeld .env.local

```env
# Backend API (OPTIONEEL - alleen als je backend server gebruikt)
# VITE_API_BASE_URL=http://localhost:3001/api
```

**Opmerking:** Voor lokale ontwikkeling is geen `.env.local` bestand nodig. De applicatie werkt direct zonder configuratie.
