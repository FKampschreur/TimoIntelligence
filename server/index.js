/**
 * Backend Express Server voor Google Gemini Chat API
 * Handelt alle API calls naar Google Gemini af
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

// Get current directory (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables - check both .env.local and .env
// .env.local takes precedence (for local development)
const envLocalPath = join(__dirname, '..', '.env.local');
const envPath = join(__dirname, '..', '.env');

if (existsSync(envLocalPath)) {
  console.log('📝 Loading environment from .env.local');
  dotenv.config({ path: envLocalPath });
} else if (existsSync(envPath)) {
  console.log('📝 Loading environment from .env');
  dotenv.config({ path: envPath });
} else {
  console.warn('⚠️  No .env.local or .env file found. Using system environment variables.');
  dotenv.config(); // Fallback to default .env
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - moet VOOR routes worden gezet
app.use(cors({
  origin: process.env.VITE_DEV_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Log alle requests voor debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Log CORS configuratie
console.log(`🌐 CORS configured for origin: ${process.env.VITE_DEV_URL || 'http://localhost:3000'}`);

// System prompt voor Timo - Holland Food Service
const SYSTEM_PROMPT = `ROL EN IDENTITEIT
Je bent Timo, het intelligente digitale brein van Holland Food Service. Je bent ontwikkeld vanuit de visie van Frank Kampschreur (4e generatie eigenaar).

JOUW MISSIE (DE 8+ STANDAARD)
1. Tevredenheid: De tevreden medewerker en klant zijn de ruggengraat van de organisatie.
2. Kwaliteit: Wij nemen geen genoegen met een zesje. Alles moet minimaal een 8+ zijn.
3. Onafhankelijkheid: Wij hebben alles in eigen beheer ontwikkeld omdat standaard marktsoftware niet voldoet.

DOELGROEP & TAAL
Je ondersteunt iedereen op de werkvloer.
- Je spreekt en begrijpt: Nederlands, Engels, Pools, Spaans, Turks en Eritrees (Tigrinya).
- Je bent de gids: Gebruikers lezen geen handleidingen. Jij helpt ze direct.

HET AANBOD & PRIJSSTRATEGIE (ROI)
1. Partners (HFS Klanten): GRATIS. HFS investeert in het partnerschap.
2. Externe Partijen:
   - Module: €20.000,-/jaar.
   - Full Suite: €100.000,-/jaar (inclusief toekomstige updates).
   - Mindset: Het is een investering in efficiency, geen kostenpost.

HET GEDRAG (DE OUTLOOK TRIGGER)
- Antwoord kort en behulpzaam.
- Zodra een gebruiker vraagt naar:
  A) Een live demo of afspraak
  B) Een offerte of prijsvoorstel
  C) Complexe integraties
  ...dan geef je een kort antwoord en eindig je met het keyword: [ACTION_EMAIL].

BELANGRIJK:
- Detecteer automatisch de taal van de gebruiker en antwoord in diezelfde taal (Nederlands, Engels, Pools, Spaans, Turks of Tigrinya).
- Gebruik [ACTION_EMAIL] alleen bij de bovenstaande triggers (demo, offerte, integraties).
- Wees vriendelijk, professioneel en behulpzaam, maar blijf kort en to the point.`;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gemini-chat-api', version: '2.0' });
});

// Test endpoint om te zien welke routes beschikbaar zijn
app.get('/api/routes', (req, res) => {
  res.json({ 
    routes: [
      'GET /health',
      'POST /api/chat',
      'GET /api/routes'
    ],
    version: '2.0'
  });
});

// Chat endpoint - moet VOOR andere routes staan
app.post('/api/chat', async (req, res) => {
  console.log('\n═══════════════════════════════════════');
  console.log('📨 CHAT REQUEST ONTVANGEN!');
  console.log('═══════════════════════════════════════');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Path:', req.path);
  console.log('Original URL:', req.originalUrl);
  console.log('═══════════════════════════════════════\n');
  
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      console.error('❌ Invalid request: messages array missing');
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error('❌ GOOGLE_API_KEY is not set in environment variables');
      console.error('   Zorg dat GOOGLE_API_KEY staat in .env.local of .env');
      console.error(`   Checked: ${envLocalPath} and ${envPath}`);
      return res.status(500).json({ 
        error: 'API key not configured',
        message: 'GOOGLE_API_KEY moet worden ingesteld in .env.local of .env'
      });
    }

    console.log(`✅ API key gevonden (${apiKey.substring(0, 10)}...)`);

    // Configureer het Gemini model
    const model = google('gemini-1.5-flash', {
      apiKey: apiKey,
    });

    // Converteer messages naar het juiste formaat voor Gemini
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    // Stream de response
    const result = await streamText({
      model,
      system: SYSTEM_PROMPT,
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Gebruik toDataStreamResponse() voor compatibiliteit met AI SDK
    const streamResponse = result.toDataStreamResponse();
    
    // Forward de response headers
    for (const [key, value] of streamResponse.headers.entries()) {
      res.setHeader(key, value);
    }

    // Set status code
    res.status(streamResponse.status);

    // Stream de response body
    if (streamResponse.body) {
      const reader = streamResponse.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      } catch (streamError) {
        console.error('Stream error:', streamError);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Stream error' });
        }
      } finally {
        reader.releaseLock();
      }
    }

    res.end();
  } catch (error) {
    console.error('❌ Error in chat endpoint:', error);
    console.error('Error stack:', error.stack);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  }
});

// 404 handler voor onbekende routes
app.use((req, res) => {
  console.log('\n═══════════════════════════════════════');
  console.log('❌ ROUTE NIET GEVONDEN!');
  console.log('═══════════════════════════════════════');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Path:', req.path);
  console.log('Original URL:', req.originalUrl);
  console.log('═══════════════════════════════════════\n');
  
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    url: req.url,
    path: req.path,
    availableRoutes: [
      'GET /health',
      'POST /api/chat',
      'GET /api/routes'
    ],
    version: '2.0'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Gemini Chat API server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📡 Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🌐 CORS origin: ${process.env.VITE_DEV_URL || 'http://localhost:3000'}`);
  
  // Check if API key is configured
  if (!process.env.GOOGLE_API_KEY) {
    console.error('\n⚠️  WAARSCHUWING: GOOGLE_API_KEY is niet ingesteld!');
    console.error('   De chat functionaliteit zal niet werken.');
    console.error('   Voeg GOOGLE_API_KEY toe aan .env.local of .env');
    const envFile = existsSync(envLocalPath) ? '.env.local' : existsSync(envPath) ? '.env' : 'geen gevonden';
    console.error(`   Huidige .env bestand: ${envFile}`);
    console.error(`   Gecontroleerde paden:`);
    console.error(`   - ${envLocalPath}`);
    console.error(`   - ${envPath}\n`);
  } else {
    const keyPreview = process.env.GOOGLE_API_KEY.substring(0, 10) + '...';
    console.log(`✅ GOOGLE_API_KEY is geconfigureerd (${keyPreview})`);
  }
  
  console.log('\n💡 Test de backend met:');
  console.log(`   - Open test-backend.html in je browser`);
  console.log(`   - Of run: npm run test:chat\n`);
});
