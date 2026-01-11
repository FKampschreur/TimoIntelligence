/**
 * Vercel Serverless Function voor Google Gemini Chat API
 * Dit werkt automatisch op Vercel zonder aparte server!
 * 
 * Vercel detecteert automatisch bestanden in /api/ als serverless functions
 */

import { google } from '@ai-sdk/google';
import { streamText, pipeUIMessageStreamToResponse } from 'ai';

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

export default async function handler(req: any, res: any) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', service: 'Timo Intelligence Chat API' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check API key
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ API key missing');
      return res.status(500).json({ 
        error: 'API key is missing',
        message: 'GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set'
      });
    }

    // Get messages from request body
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array is required' });
    }

    // Initialize Google model
    const model = google('gemini-3-flash-preview', {
      apiKey: apiKey,
    });

    // Format messages for AI SDK
    const formattedMessages = messages.map((msg: any) => {
      let content = '';
      
      // Check if message has parts array (AI SDK v3 format)
      if (msg.parts && Array.isArray(msg.parts)) {
        content = msg.parts
          .filter((part: any) => part.type === 'text')
          .map((part: any) => part.text)
          .join('');
      } 
      // Fallback to content or text property
      else if (msg.content) {
        content = msg.content;
      } else if (msg.text) {
        content = msg.text;
      }
      
      return {
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: content,
      };
    }).filter((msg: any) => msg.content);

    console.log(`📨 Received ${formattedMessages.length} messages`);

    // Stream response
    const result = await streamText({
      model,
      system: SYSTEM_PROMPT,
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    console.log('✅ streamText completed, piping to response...');

    // Pipe the stream to response
    pipeUIMessageStreamToResponse({
      response: res,
      stream: result.toUIMessageStream({ sendStart: false }),
    });

  } catch (error: any) {
    console.error('❌ Chat API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message || String(error),
      name: error.name
    });
  }
}
