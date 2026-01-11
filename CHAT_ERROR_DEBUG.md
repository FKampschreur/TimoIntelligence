# Chat Error Debugging Guide

## Error: DefaultChatTransport.sendMessages

Als je deze error krijgt:
```
ChatWidget.tsx:39 Chat error: Error
    at DefaultChatTransport.sendMessages (chunk-JBCJASB2.js?v=20a65b71:33490:13)
```

## Stap-voor-stap Debugging

### Stap 1: Controleer of de server draait

```bash
npm run check:server
```

Of test handmatig:
```bash
curl http://localhost:3001/health
```

**Verwacht resultaat:**
```json
{"status":"ok","service":"gemini-chat-api","version":"2.0"}
```

### Stap 2: Test de chat endpoint direct

```bash
curl -X POST http://localhost:3001/api/chat/test \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}]}'
```

Dit test of de server de request correct ontvangt.

### Stap 3: Controleer server logs

Wanneer je een chat bericht stuurt, zou je in de server terminal moeten zien:
```
═══════════════════════════════════════
📨 CHAT REQUEST ONTVANGEN!
═══════════════════════════════════════
Method: POST
URL: /api/chat
...
```

Als je dit NIET ziet, komt de request niet aan bij de server.

### Stap 4: Controleer browser console

Open de browser developer tools (F12) en kijk naar:
1. **Console tab** - voor JavaScript errors
2. **Network tab** - voor HTTP requests/responses

In de Network tab:
- Zoek naar de POST request naar `/api/chat`
- Klik erop om details te zien
- Check de **Request** en **Response** tabs
- Check de **Headers** tab voor CORS issues

### Stap 5: Controleer CORS

Als je CORS errors ziet in de console:
- Controleer of `VITE_DEV_URL` in `.env.local` overeenkomt met je frontend URL
- Standaard moet dit `http://localhost:3000` zijn (of de poort waar Vite draait)

### Stap 6: Controleer API Key

De server moet een geldige `GEMINI_API_KEY` hebben. Check de server logs bij startup:
```
✅ GEMINI_API_KEY is geconfigureerd (AIzaSyC0SF...)
```

Als je dit NIET ziet:
```
⚠️  WAARSCHUWING: GEMINI_API_KEY is niet ingesteld!
```

## Veelvoorkomende Problemen

### Probleem 1: Server geeft HTML terug

**Symptoom:** Network tab toont HTML response in plaats van JSON

**Oplossing:**
1. Stop alle processen op poort 3001
2. Start de Express server opnieuw: `npm run server`

### Probleem 2: CORS Error

**Symptoom:** Console toont "CORS policy" error

**Oplossing:**
1. Check `.env.local`:
   ```env
   VITE_DEV_URL=http://localhost:3000
   ```
2. Herstart de server na wijzigingen

### Probleem 3: 404 Not Found

**Symptoom:** Network tab toont 404 status

**Oplossing:**
1. Controleer of de server draait: `npm run check:server`
2. Controleer of de URL correct is: `http://localhost:3001/api/chat`
3. Check server logs voor route registratie

### Probleem 4: Response format error

**Symptoom:** Error in console maar server logs tonen succes

**Mogelijke oorzaken:**
- Server response format komt niet overeen met wat AI SDK verwacht
- Streaming response wordt niet correct afgehandeld

**Oplossing:**
1. Check server logs voor streaming errors
2. Controleer of `toDataStreamResponse()` correct werkt
3. Test met een eenvoudige request eerst

## Verbeterde Error Logging

De code is nu aangepast om meer details te loggen:

### Frontend (ChatWidget.tsx)
- Logt nu volledige error object met alle properties
- Toont API URL die gebruikt wordt
- Geeft specifieke foutmeldingen per error type

### Backend (server/index.js)
- Logt volledige request headers en body
- Logt streaming progress (aantal chunks)
- Logt gedetailleerde error informatie

## Test Commando's

```bash
# Test server health
curl http://localhost:3001/health

# Test routes endpoint
curl http://localhost:3001/api/routes

# Test chat test endpoint
curl -X POST http://localhost:3001/api/chat/test \
  -H "Content-Type: application/json" \
  -d '{"messages":[]}'

# Test chat endpoint (volledig)
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hallo"}]}'
```

## Volgende Stappen

1. **Herstart beide servers:**
   ```bash
   npm run dev:all
   ```

2. **Open browser console (F12)**

3. **Stuur een test bericht in de chat**

4. **Check beide:**
   - Browser console voor frontend errors
   - Server terminal voor backend logs

5. **Deel de logs** als het probleem blijft bestaan:
   - Browser console output
   - Server terminal output
   - Network tab details van de failed request
