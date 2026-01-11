# Vercel Serverless Functions Setup - Geen Aparte Server Nodig!

## Waarom werkt je andere app zonder aparte server?

Je andere app gebruikt waarschijnlijk **Vercel Serverless Functions** (API routes). Deze werken automatisch op Vercel zonder aparte Railway/Render deployment!

## Oplossing: Gebruik Vercel Serverless Functions

Ik heb een Vercel Serverless Function gemaakt in `api/chat.ts`. Dit werkt automatisch op Vercel!

### Wat is er veranderd?

1. **Nieuw bestand:** `api/chat.ts` - Dit is een Vercel Serverless Function
2. **Nieuw bestand:** `vercel.json` - Configureert Vercel om `/api/chat` naar de serverless function te routeren
3. **Geen aparte server nodig!** - Vercel runt dit automatisch

### Stappen om te activeren:

#### Stap 1: Stel Environment Variable in Vercel

1. Ga naar je Vercel project → **Settings** → **Environment Variables**
2. Voeg toe:
   ```
   GEMINI_API_KEY=je_google_api_key_hier
   ```
   (Vervang met je echte API key)
3. Selecteer alle environments (Production, Preview, Development)
4. Klik **Save**

#### Stap 2: Deploy naar Vercel

1. Push de code naar GitHub (als je dat nog niet hebt gedaan)
2. Vercel deployt automatisch
3. Of ga naar Vercel → **Deployments** → **Redeploy**

#### Stap 3: Test

1. Open `https://www.timointelligence.nl`
2. Test de chat widget
3. Het zou nu moeten werken! 🎉

### Hoe werkt het?

- **Vercel detecteert automatisch** bestanden in `/api/` als serverless functions
- **Geen aparte server nodig** - Vercel runt dit op hun infrastructuur
- **Automatisch schaalbaar** - Vercel schaalt automatisch op basis van verkeer
- **Gratis tier** - Vercel heeft een genereuze gratis tier voor serverless functions

### Belangrijk:

- **Geen `VITE_CHAT_API_URL` nodig!** - De chat widget gebruikt automatisch `/api/chat` op hetzelfde domain
- **Geen Railway/Render nodig** - Alles draait op Vercel
- **Geen nginx configuratie nodig** - Vercel handelt routing af

### Verificatie:

Test of de serverless function werkt:

```bash
# Test health endpoint
curl https://www.timointelligence.nl/api/chat

# Test chat endpoint (POST)
curl https://www.timointelligence.nl/api/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hallo"}]}'
```

### Troubleshooting:

#### 404 Error
- **Probleem:** Vercel detecteert de serverless function niet
- **Oplossing:** 
  - Controleer of `api/chat.ts` bestaat
  - Controleer of `vercel.json` correct is
  - Check Vercel deployment logs

#### API Key Error
- **Probleem:** `GEMINI_API_KEY` niet ingesteld
- **Oplossing:** 
  - Stel `GEMINI_API_KEY` in Vercel → Settings → Environment Variables
  - Rebuild deployment

#### CORS Error
- **Probleem:** CORS headers niet correct
- **Oplossing:** De serverless function heeft al CORS headers ingesteld

### Voordelen van deze aanpak:

✅ **Geen aparte server nodig** - Alles op Vercel  
✅ **Automatisch schaalbaar** - Vercel schaalt automatisch  
✅ **Gratis tier** - Genoeg voor kleine/medium projecten  
✅ **Eenvoudiger** - Minder configuratie nodig  
✅ **Sneller** - Geen extra network hops  

### Vergelijking:

| Methode | Server nodig? | Configuratie | Kosten |
|---------|--------------|--------------|--------|
| **Express Server (Railway)** | ✅ Ja | Veel | $5/maand |
| **Vercel Serverless** | ❌ Nee | Minimaal | Gratis |

## Conclusie

Met Vercel Serverless Functions heb je **geen aparte server nodig**! Dit is precies zoals je andere app werkt. De chat widget gebruikt automatisch `/api/chat` op hetzelfde domain, en Vercel runt de serverless function automatisch.
