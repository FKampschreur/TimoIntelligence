# API Setup Instructies

Deze applicatie ondersteunt nu het opslaan van content naar een backend API. Dit zorgt ervoor dat wijzigingen persistent zijn wanneer de website live staat.

## Hoe het werkt

1. **Bij het laden**: De applicatie probeert eerst content op te halen van de API. Als dit mislukt, wordt localStorage gebruikt als fallback.
2. **Bij wijzigingen**: Wijzigingen worden automatisch opgeslagen (na 500ms debounce):
   - Eerst wordt geprobeerd op te slaan naar de API
   - Als de API niet beschikbaar is of faalt, wordt localStorage gebruikt als backup
   - De gebruiker ziet altijd feedback over de opslagstatus

## Backend API Vereisten

Je backend API moet de volgende endpoints implementeren:

### 1. GET `/api/content`
Haalt de huidige content op.

**Response (200 OK):**
```json
{
  "hero": {
    "tag": "...",
    "titleLine1": "...",
    "titleLine2": "...",
    "description": "...",
    "buttonPrimary": "...",
    "buttonSecondary": "..."
  },
  "solutions": [...],
  "about": {...},
  "partners": {...},
  "contact": {...}
}
```

**Response (404 Not Found):**
Als er nog geen content bestaat, retourneer 404. De applicatie gebruikt dan de default content.

### 2. PUT `/api/content`
Slaat nieuwe content op.

**Request Body:**
```json
{
  "hero": {...},
  "solutions": [...],
  "about": {...},
  "partners": {...},
  "contact": {...}
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

**Response (401/403 Unauthorized/Forbidden):**
Als authenticatie vereist is en de gebruiker niet is ingelogd.

### 3. (Optioneel) GET `/api/health`
Health check endpoint voor API beschikbaarheid.

**Response (200 OK):**
```json
{
  "status": "ok"
}
```

## Configuratie

### Environment Variables

Maak een `.env.local` bestand in de root van je project:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3001/api

# Voor productie:
# VITE_API_BASE_URL=https://api.jouwdomein.nl/api
```

**Belangrijk**: Als `VITE_API_BASE_URL` niet is ingesteld, gebruikt de applicatie automatisch localStorage als primaire opslagmethode.

## Authenticatie (Optioneel)

Als je backend authenticatie vereist, kun je een Bearer token toevoegen aan requests:

1. Sla het token op in `sessionStorage` met de key `admin-auth-token`
2. De API service voegt automatisch `Authorization: Bearer <token>` header toe aan requests

Voorbeeld:
```javascript
sessionStorage.setItem('admin-auth-token', 'jouw-token-hier');
```

## Voorbeeld Backend Implementatie

### Node.js/Express Voorbeeld

```javascript
const express = require('express');
const app = express();
const fs = require('fs').promises;
const path = require('path');

app.use(express.json());

const CONTENT_FILE = path.join(__dirname, 'content.json');

// GET /api/content
app.get('/api/content', async (req, res) => {
  try {
    const content = await fs.readFile(CONTENT_FILE, 'utf8');
    res.json(JSON.parse(content));
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Content not found' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// PUT /api/content
app.put('/api/content', async (req, res) => {
  try {
    // Optioneel: verifieer authenticatie
    // const token = req.headers.authorization?.replace('Bearer ', '');
    // if (!isValidToken(token)) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    await fs.writeFile(CONTENT_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save content' });
  }
});

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3001, () => {
  console.log('API server running on http://localhost:3001');
});
```

### Python/Flask Voorbeeld

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

CONTENT_FILE = 'content.json'

@app.route('/api/content', methods=['GET'])
def get_content():
    try:
        with open(CONTENT_FILE, 'r') as f:
            return jsonify(json.load(f))
    except FileNotFoundError:
        return jsonify({'error': 'Content not found'}), 404

@app.route('/api/content', methods=['PUT'])
def save_content():
    try:
        # Optioneel: verifieer authenticatie
        # token = request.headers.get('Authorization', '').replace('Bearer ', '')
        # if not is_valid_token(token):
        #     return jsonify({'error': 'Unauthorized'}), 401

        with open(CONTENT_FILE, 'w') as f:
            json.dump(request.json, f, indent=2)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(port=3001)
```

## Database Opslag (Aanbevolen voor Productie)

Voor productie is het aanbevolen om een database te gebruiken in plaats van een JSON bestand:

- **PostgreSQL/MySQL**: Voor relationele data
- **MongoDB**: Voor document-gebaseerde opslag
- **Firebase**: Voor serverless oplossingen

## CORS Configuratie

Zorg ervoor dat je backend CORS headers correct instelt:

```javascript
// Express
app.use(cors({
  origin: ['http://localhost:5173', 'https://jouwdomein.nl'],
  credentials: true
}));
```

## Testing

1. Start je backend API server
2. Zet `VITE_API_BASE_URL` in `.env.local`
3. Herstart de development server (`npm run dev`)
4. Maak wijzigingen in de admin panel
5. Controleer of de status indicator "Opgeslagen op de server" toont

## Troubleshooting

### "API niet geconfigureerd, gebruik localStorage"
- Controleer of `VITE_API_BASE_URL` is ingesteld in `.env.local`
- Herstart de development server na het toevoegen van environment variables

### "API opslag mislukt"
- Controleer of de backend server draait
- Controleer CORS configuratie
- Controleer de browser console voor foutmeldingen
- Wijzigingen worden automatisch opgeslagen in localStorage als backup

### "Timeout - server reageert niet"
- Controleer of de API URL correct is
- Controleer of de server bereikbaar is
- Verhoog `TIMEOUT` in `utils/apiConfig.ts` als nodig
