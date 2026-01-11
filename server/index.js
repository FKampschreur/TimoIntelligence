/**
 * Backend Express Server voor Google Gemini Chat API
 * Handelt alle API calls naar Google Gemini af
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { google } from '@ai-sdk/google';
import { streamText, pipeUIMessageStreamToResponse } from 'ai';
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

// System prompt voor Timo - Timo Intelligence
const SYSTEM_PROMPT = `ROL EN IDENTITEIT
Je bent Timo, het intelligente digitale brein van Timo Intelligence. Je bent ontwikkeld vanuit de visie van Frank Kampschreur.

JOUW MISSIE (DE 8+ STANDAARD)
1. Tevredenheid: De tevreden medewerker en klant zijn de ruggengraat van de organisatie.
2. Kwaliteit: Wij nemen geen genoegen met een zesje. Alles moet minimaal een 8+ zijn.
3. Onafhankelijkheid: Wij hebben alles in eigen beheer ontwikkeld omdat standaard marktsoftware niet voldoet.

DOELGROEP & TAAL
Je ondersteunt iedereen op de werkvloer.
- Je spreekt en begrijpt: Nederlands, Engels, Pools, Spaans, Turks en Eritrees (Tigrinya).
- Je bent de gids: Gebruikers lezen geen handleidingen. Jij helpt ze direct.

HET AANBOD & PRIJSSTRATEGIE (ROI)
1. Partners: GRATIS. Timo Intelligence investeert in het partnerschap.
2. Externe Partijen:
   - Module: €20.000,-/jaar.
   - Full Suite: €100.000,-/jaar (inclusief toekomstige updates).
   - Mindset: Het is een investering in efficiency, geen kostenpost.

TIMO INTELLIGENCE PRODUCTEN
- Timo Fleet: Fleet management oplossing
- Timo Tender: Tender management systeem
- Timo Insights: Data analytics en inzichten
- Timo Vision: Visuele analyse en monitoring

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

// Root route - API server info
app.get('/', (req, res) => {
  res.json({
    message: 'Timo Intelligence Chat API Server',
    version: '2.0',
    info: 'This is the API server. The frontend runs on port 3000.',
    endpoints: {
      health: 'GET /health',
      chat: 'POST /api/chat',
      routes: 'GET /api/routes',
      test: 'POST /api/chat/test'
    },
    frontend: 'http://localhost:3000',
    documentation: 'See CHAT_SETUP.md for usage instructions'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gemini-chat-api', version: '2.0' });
});

// Test endpoint om te zien welke routes beschikbaar zijn
app.get('/api/routes', (req, res) => {
  res.json({ 
    routes: [
      'GET /',
      'GET /health',
      'POST /api/chat',
      'GET /api/routes',
      'POST /api/chat/test'
    ],
    version: '2.0'
  });
});

// Test endpoint voor chat (om request format te testen)
app.post('/api/chat/test', (req, res) => {
  console.log('\n🧪 TEST ENDPOINT CALLED');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Body type:', typeof req.body);
  console.log('Body keys:', Object.keys(req.body || {}));
  
  res.json({
    success: true,
    received: {
      body: req.body,
      headers: req.headers,
      method: req.method,
      url: req.url
    },
    message: 'Test endpoint werkt!'
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
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('═══════════════════════════════════════\n');
  
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      console.error('❌ Invalid request: messages array missing');
      console.error('Request body:', req.body);
      return res.status(400).json({ 
        error: 'Messages array is required',
        received: req.body 
      });
    }

    console.log(`✅ Received ${messages.length} message(s)`);

    // Check voor beide variabele namen (GEMINI_API_KEY of GOOGLE_GENERATIVE_AI_API_KEY)
    let apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error('❌ API key is not set in environment variables');
      console.error('   Zorg dat GEMINI_API_KEY of GOOGLE_GENERATIVE_AI_API_KEY staat in .env.local of .env');
      console.error(`   Checked: ${envLocalPath} and ${envPath}`);
      return res.status(500).json({ 
        error: 'API key not configured',
        message: 'GEMINI_API_KEY of GOOGLE_GENERATIVE_AI_API_KEY moet worden ingesteld in .env.local of .env'
      });
    }

    // @ai-sdk/google verwacht GOOGLE_GENERATIVE_AI_API_KEY environment variable
    // Zet deze als het nog niet bestaat maar GEMINI_API_KEY wel bestaat
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && process.env.GEMINI_API_KEY) {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
    }

    console.log(`✅ API key gevonden (${apiKey.substring(0, 10)}...)`);

    // Configureer het Gemini model
    // @ai-sdk/google gebruikt GOOGLE_GENERATIVE_AI_API_KEY environment variable automatisch
    // We kunnen het ook expliciet doorgeven via apiKey parameter
    const model = google('gemini-3-flash-preview', {
      apiKey: apiKey,
    });

    // Converteer messages naar het juiste formaat voor Gemini
    // AI SDK v3 gebruikt parts array, maar we moeten content string hebben voor Gemini
    const formattedMessages = messages.map(msg => {
      let content = '';
      
      // Check if message has parts array (AI SDK v3 format)
      if (msg.parts && Array.isArray(msg.parts)) {
        content = msg.parts
          .filter(part => part.type === 'text')
          .map(part => part.text)
          .join('');
      } 
      // Fallback to content or text property
      else if (msg.content) {
        content = msg.content;
      } else if (msg.text) {
        content = msg.text;
      }
      
      return {
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: content,
      };
    });

    console.log('🔄 Starting streamText...');
    
    // Stream de response
    const result = await streamText({
      model,
      system: SYSTEM_PROMPT,
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    console.log('✅ streamText completed, piping to response...');

    // Gebruik pipeUIMessageStreamToResponse() functie met result.toUIMessageStream() voor AI SDK v6
    // Dit is de aanbevolen manier voor Express servers in AI SDK v6
    pipeUIMessageStreamToResponse({
      response: res,
      stream: result.toUIMessageStream({ sendStart: false }),
    });
    
    console.log('✅ Response streamed successfully');
  } catch (error) {
    console.error('❌ Error in chat endpoint:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...error
    });
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message,
        name: error.name
      });
    } else {
      // Headers already sent, try to end gracefully
      res.end();
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
  
  // Als het een GET request is naar de root, geef een vriendelijke boodschap
  if (req.method === 'GET' && req.path === '/') {
    return res.json({
      message: 'Timo Intelligence Chat API Server',
      version: '2.0',
      info: 'This is the API server. The frontend runs on port 3000.',
      endpoints: {
        health: 'GET /health',
        chat: 'POST /api/chat',
        routes: 'GET /api/routes',
        test: 'POST /api/chat/test'
      },
      frontend: 'http://localhost:3000',
      documentation: 'See CHAT_SETUP.md for usage instructions'
    });
  }
  
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    url: req.url,
    path: req.path,
    info: 'This is the API server. The frontend runs on http://localhost:3000',
    availableRoutes: [
      'GET /',
      'GET /health',
      'POST /api/chat',
      'GET /api/routes',
      'POST /api/chat/test'
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
  
  // Check if API key is configured (check beide variabele namen)
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.error('\n⚠️  WAARSCHUWING: API key is niet ingesteld!');
    console.error('   De chat functionaliteit zal niet werken.');
    console.error('   Voeg GEMINI_API_KEY of GOOGLE_GENERATIVE_AI_API_KEY toe aan .env.local of .env');
    const envFile = existsSync(envLocalPath) ? '.env.local' : existsSync(envPath) ? '.env' : 'geen gevonden';
    console.error(`   Huidige .env bestand: ${envFile}`);
    console.error(`   Gecontroleerde paden:`);
    console.error(`   - ${envLocalPath}`);
    console.error(`   - ${envPath}\n`);
  } else {
    const keyPreview = apiKey.substring(0, 10) + '...';
    const keyName = process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY' : 'GOOGLE_GENERATIVE_AI_API_KEY';
    console.log(`✅ ${keyName} is geconfigureerd (${keyPreview})`);
  }
  
  console.log('\n💡 Test de backend met:');
  console.log(`   - Open test-backend.html in je browser`);
  console.log(`   - Of run: npm run test:chat\n`);
});
