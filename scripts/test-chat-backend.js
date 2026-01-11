/**
 * Test script om te controleren of de chat backend server correct werkt
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔍 Chat Backend Test Script\n');
console.log('='.repeat(50));

// Check 1: Bestaat .env.local?
const envLocalPath = join(projectRoot, '.env.local');
const envPath = join(projectRoot, '.env');

console.log('\n1️⃣  Controleren environment bestanden...');
let envFile = null;
let envContent = '';

if (existsSync(envLocalPath)) {
  console.log('   ✅ .env.local gevonden');
  envFile = envLocalPath;
  try {
    envContent = readFileSync(envLocalPath, 'utf-8');
    console.log('   ✅ .env.local kan worden gelezen');
  } catch (error) {
    console.log('   ❌ Fout bij lezen .env.local:', error.message);
  }
} else if (existsSync(envPath)) {
  console.log('   ✅ .env gevonden');
  envFile = envPath;
  try {
    envContent = readFileSync(envPath, 'utf-8');
    console.log('   ✅ .env kan worden gelezen');
  } catch (error) {
    console.log('   ❌ Fout bij lezen .env:', error.message);
  }
} else {
  console.log('   ❌ Geen .env.local of .env bestand gevonden!');
  console.log('      Maak een .env.local bestand aan met:');
  console.log('      GOOGLE_API_KEY=your_api_key_here');
  console.log('      PORT=3001');
  process.exit(1);
}

// Check 2: Is GOOGLE_API_KEY ingesteld?
console.log('\n2️⃣  Controleren GOOGLE_API_KEY...');
const apiKeyMatch = envContent.match(/GOOGLE_API_KEY\s*=\s*(.+)/);
const geminiKeyMatch = envContent.match(/GEMINI_API_KEY\s*=\s*(.+)/);

if (geminiKeyMatch && !apiKeyMatch) {
  console.log('   ⚠️  GEMINI_API_KEY gevonden, maar backend verwacht GOOGLE_API_KEY!');
  console.log('   🔧 Oplossing: Verander GEMINI_API_KEY naar GOOGLE_API_KEY in je .env.local');
  const geminiKey = geminiKeyMatch[1].trim();
  console.log(`   📝 Gevonden key: ${geminiKey.substring(0, 10)}...`);
  console.log('\n   ❌ Backend kan deze key niet lezen omdat de naam verkeerd is!');
  process.exit(1);
}

if (apiKeyMatch) {
  const apiKey = apiKeyMatch[1].trim();
  if (apiKey && apiKey !== 'your_google_api_key_here' && apiKey.length > 10) {
    console.log('   ✅ GOOGLE_API_KEY is ingesteld');
    console.log(`   📝 Key lengte: ${apiKey.length} karakters`);
    console.log(`   📝 Key preview: ${apiKey.substring(0, 10)}...`);
  } else {
    console.log('   ❌ GOOGLE_API_KEY is niet correct ingesteld!');
    console.log('      Zorg dat je een geldige Google API key hebt ingevuld');
    process.exit(1);
  }
} else {
  console.log('   ❌ GOOGLE_API_KEY niet gevonden in', envFile);
  console.log('      Voeg toe: GOOGLE_API_KEY=your_api_key_here');
  if (geminiKeyMatch) {
    console.log('      (Je hebt GEMINI_API_KEY gebruikt, maar het moet GOOGLE_API_KEY zijn)');
  }
  process.exit(1);
}

// Check 3: Is PORT ingesteld?
console.log('\n3️⃣  Controleren PORT...');
const portMatch = envContent.match(/PORT\s*=\s*(\d+)/);
if (portMatch) {
  const port = portMatch[1];
  console.log(`   ✅ PORT is ingesteld: ${port}`);
} else {
  console.log('   ⚠️  PORT niet ingesteld, gebruikt default: 3001');
}

// Check 4: Test backend server connectie
console.log('\n4️⃣  Testen backend server connectie...');
const port = portMatch ? portMatch[1] : '3001';
const backendUrl = `http://localhost:${port}`;

try {
  const response = await fetch(`${backendUrl}/health`);
  if (response.ok) {
    const data = await response.json();
    console.log('   ✅ Backend server is bereikbaar!');
    console.log(`   📡 Server status: ${data.status}`);
    console.log(`   📡 Service: ${data.service}`);
  } else {
    console.log(`   ❌ Backend server reageert met status: ${response.status}`);
    console.log('      Controleer of de server draait: npm run server');
  }
} catch (error) {
  console.log('   ❌ Kan niet verbinden met backend server!');
  console.log(`   📡 URL: ${backendUrl}`);
  console.log(`   ❌ Error: ${error.message}`);
  console.log('\n   💡 Oplossing:');
  console.log('      1. Start de backend server: npm run server');
  console.log('      2. Of start beide servers: npm run dev:all');
  process.exit(1);
}

// Check 5: Test chat endpoint (zonder daadwerkelijk te chatten)
console.log('\n5️⃣  Testen chat endpoint...');
try {
  const testResponse = await fetch(`${backendUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'test' }]
    })
  });

  if (testResponse.status === 500) {
    const errorData = await testResponse.json();
    if (errorData.error === 'API key not configured') {
      console.log('   ❌ API key probleem!');
      console.log('      De backend server kan de GOOGLE_API_KEY niet lezen');
      console.log('      Controleer je .env.local bestand');
    } else {
      console.log(`   ⚠️  Chat endpoint reageert met error: ${errorData.error}`);
    }
  } else if (testResponse.ok || testResponse.status === 200) {
    console.log('   ✅ Chat endpoint werkt!');
  } else {
    console.log(`   ⚠️  Chat endpoint reageert met status: ${testResponse.status}`);
  }
} catch (error) {
  console.log('   ❌ Fout bij testen chat endpoint:', error.message);
}

console.log('\n' + '='.repeat(50));
console.log('\n✅ Alle checks voltooid!\n');
console.log('💡 Als je problemen hebt:');
console.log('   1. Zorg dat beide servers draaien: npm run dev:all');
console.log('   2. Controleer je .env.local bestand');
console.log('   3. Haal een nieuwe API key op: https://aistudio.google.com/app/apikey\n');
