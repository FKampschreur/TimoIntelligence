/**
 * Script om automatisch .env.local te maken/updaten met admin credentials
 * 
 * Gebruik: node scripts/setup-admin-env.js <username> <password>
 * 
 * Voorbeeld: node scripts/setup-admin-env.js admin mijnwachtwoord123
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const envPath = join(projectRoot, '.env.local');

// Haal argumenten op
const username = process.argv[2] || 'admin';
const password = process.argv[3];

if (!password) {
  console.error('❌ Geef een wachtwoord op');
  console.log('\nGebruik:');
  console.log('  node scripts/setup-admin-env.js <username> <password>');
  console.log('\nVoorbeeld:');
  console.log('  node scripts/setup-admin-env.js admin mijnwachtwoord123');
  process.exit(1);
}

// Genereer hash
const hash = crypto.createHash('sha256').update(password).digest('hex');

// Lees bestaand .env.local als het bestaat
let envContent = '';
if (existsSync(envPath)) {
  try {
    envContent = readFileSync(envPath, 'utf-8');
  } catch (error) {
    console.warn('⚠️  Kon bestaand .env.local niet lezen, maak nieuw bestand');
  }
}

// Parse bestaande variabelen
const envVars = {};
const lines = envContent.split('\n');
lines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Update admin credentials
envVars['VITE_ADMIN_USERNAME'] = username;
envVars['VITE_ADMIN_PASSWORD_HASH'] = hash;

// Bouw nieuwe .env.local content
let newEnvContent = '# Admin Authenticatie Credentials\n';
newEnvContent += `# Genereerd op: ${new Date().toISOString()}\n`;
newEnvContent += `VITE_ADMIN_USERNAME=${username}\n`;
newEnvContent += `VITE_ADMIN_PASSWORD_HASH=${hash}\n\n`;

// Voeg andere variabelen toe (behoud bestaande configuratie)
const otherVars = Object.keys(envVars).filter(key => 
  !key.startsWith('VITE_ADMIN_') && 
  key !== 'VITE_ADMIN_USERNAME' && 
  key !== 'VITE_ADMIN_PASSWORD_HASH'
);

if (otherVars.length > 0) {
  newEnvContent += '\n# Overige configuratie\n';
  otherVars.forEach(key => {
    newEnvContent += `${key}=${envVars[key]}\n`;
  });
}

// Schrijf naar bestand
try {
  writeFileSync(envPath, newEnvContent, 'utf-8');
  console.log('\n✅ .env.local is bijgewerkt!\n');
  console.log('Configuratie:');
  console.log(`  Gebruikersnaam: ${username}`);
  console.log(`  Password Hash: ${hash.substring(0, 20)}...`);
  console.log('\n⚠️  Belangrijk:');
  console.log('   1. Herstart je development server (npm run dev)');
  console.log('   2. Log in met gebruikersnaam en wachtwoord');
  console.log(`   3. Gebruikersnaam: ${username}`);
  console.log(`   4. Wachtwoord: ${password}\n`);
} catch (error) {
  console.error('❌ Fout bij schrijven .env.local:', error.message);
  process.exit(1);
}
