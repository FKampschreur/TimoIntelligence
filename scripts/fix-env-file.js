/**
 * Script om .env.local te repareren en correct te formatteren
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const envPath = join(projectRoot, '.env.local');

console.log('🔧 Repareer .env.local bestand\n');
console.log('='.repeat(50));

// Lees huidige inhoud
let currentContent = '';
if (existsSync(envPath)) {
  try {
    currentContent = readFileSync(envPath, 'utf-8');
    console.log('📄 Huidige inhoud .env.local:');
    console.log('-'.repeat(50));
    console.log(currentContent);
    console.log('-'.repeat(50));
  } catch (error) {
    console.error('❌ Fout bij lezen:', error.message);
  }
} else {
  console.log('⚠️  .env.local bestaat niet, wordt aangemaakt...');
}

// Parse bestaande variabelen
const envVars = {};
const lines = currentContent.split('\n');
lines.forEach((line, index) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    // Probeer verschillende formaten te parsen
    let key, value;
    
    // Format: KEY=value
    if (trimmed.includes('=')) {
      const parts = trimmed.split('=');
      key = parts[0].trim();
      value = parts.slice(1).join('=').trim();
      
      // Verwijder quotes als die er zijn
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      if (key && value) {
        envVars[key] = value;
        console.log(`✅ Gevonden: ${key} = ${value.substring(0, 20)}...`);
      }
    }
  }
});

// Vraag om credentials als ze niet bestaan
const username = process.argv[2] || envVars['VITE_ADMIN_USERNAME'] || 'admin';
const password = process.argv[3] || 'admin123';

if (!envVars['VITE_ADMIN_PASSWORD_HASH'] && !process.argv[3]) {
  console.log('\n⚠️  Geen password hash gevonden. Genereer met wachtwoord "admin123"...');
}

// Genereer hash
const hash = crypto.createHash('sha256').update(password).digest('hex');

// Update admin credentials
envVars['VITE_ADMIN_USERNAME'] = username;
envVars['VITE_ADMIN_PASSWORD_HASH'] = hash;

// Bouw nieuwe .env.local met correcte format
let newContent = '# Admin Authenticatie Credentials\n';
newContent += `# Genereerd/geüpdatet op: ${new Date().toISOString()}\n`;
newContent += `# BELANGRIJK: Geen quotes, geen spaties rondom =\n\n`;
newContent += `VITE_ADMIN_USERNAME=${username}\n`;
newContent += `VITE_ADMIN_PASSWORD_HASH=${hash}\n\n`;

// Voeg andere variabelen toe (behoud bestaande configuratie)
const otherVars = Object.keys(envVars).filter(key => 
  key !== 'VITE_ADMIN_USERNAME' && 
  key !== 'VITE_ADMIN_PASSWORD_HASH'
);

if (otherVars.length > 0) {
  newContent += '# Overige configuratie\n';
  otherVars.forEach(key => {
    newContent += `${key}=${envVars[key]}\n`;
  });
}

// Schrijf naar bestand
try {
  writeFileSync(envPath, newContent, 'utf-8');
  console.log('\n✅ .env.local is gerepareerd en opgeslagen!\n');
  console.log('Nieuwe inhoud:');
  console.log('-'.repeat(50));
  console.log(newContent);
  console.log('-'.repeat(50));
  console.log('\n📋 Volgende stappen:');
  console.log('   1. Stop je development server (Ctrl+C)');
  console.log('   2. Start opnieuw: npm run dev');
  console.log('   3. Test inloggen met:');
  console.log(`      Gebruikersnaam: ${username}`);
  console.log(`      Wachtwoord: ${password}\n`);
} catch (error) {
  console.error('❌ Fout bij schrijven:', error.message);
  process.exit(1);
}
