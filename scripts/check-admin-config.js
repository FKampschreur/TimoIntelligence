/**
 * Script om admin configuratie te controleren
 * 
 * Gebruik: node scripts/check-admin-config.js
 */

import { readFileSync } from 'fs';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔍 Admin Configuratie Diagnose\n');
console.log('='.repeat(50));

// Check 1: Bestaat .env.local?
const envPath = join(projectRoot, '.env.local');
console.log('\n1️⃣  Controleren .env.local bestand...');
if (existsSync(envPath)) {
  console.log('   ✅ .env.local bestaat');
  
  // Lees .env.local
  try {
    const envContent = readFileSync(envPath, 'utf-8');
    console.log('   ✅ .env.local kan worden gelezen');
    
    // Parse environment variables
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
    
    console.log('\n2️⃣  Controleren environment variables...');
    
    const username = envVars['VITE_ADMIN_USERNAME'];
    const passwordHash = envVars['VITE_ADMIN_PASSWORD_HASH'];
    
    if (username) {
      console.log(`   ✅ VITE_ADMIN_USERNAME gevonden: "${username}"`);
    } else {
      console.log('   ❌ VITE_ADMIN_USERNAME NIET GEVONDEN');
      console.log('      Voeg toe: VITE_ADMIN_USERNAME=admin');
    }
    
    if (passwordHash) {
      console.log(`   ✅ VITE_ADMIN_PASSWORD_HASH gevonden: "${passwordHash.substring(0, 20)}..."`);
      console.log(`      Lengte: ${passwordHash.length} karakters (verwacht: 64 voor SHA-256)`);
      
      if (passwordHash.length !== 64) {
        console.log('   ⚠️  Waarschuwing: Hash lengte is niet 64 karakters. Dit kan een probleem zijn.');
      }
    } else {
      console.log('   ❌ VITE_ADMIN_PASSWORD_HASH NIET GEVONDEN');
      console.log('      Genereer met: node scripts/generate-password-hash.js <wachtwoord>');
    }
    
    // Test hash generatie
    if (passwordHash && process.argv[2]) {
      console.log('\n3️⃣  Testen password hash...');
      const testPassword = process.argv[2];
      const testHash = crypto.createHash('sha256').update(testPassword).digest('hex');
      
      if (testHash === passwordHash) {
        console.log(`   ✅ Hash komt overeen! Wachtwoord "${testPassword}" is correct.`);
      } else {
        console.log(`   ❌ Hash komt NIET overeen.`);
        console.log(`      Verwacht: ${passwordHash}`);
        console.log(`      Gekregen: ${testHash}`);
        console.log(`      Het wachtwoord "${testPassword}" komt niet overeen met de hash.`);
      }
    } else if (passwordHash && !process.argv[2]) {
      console.log('\n3️⃣  Test password hash (optioneel)...');
      console.log('   💡 Tip: Voeg een wachtwoord toe om te testen:');
      console.log(`      node scripts/check-admin-config.js <wachtwoord>`);
    }
    
  } catch (error) {
    console.log('   ❌ Fout bij lezen .env.local:', error.message);
  }
  
} else {
  console.log('   ❌ .env.local bestaat NIET');
  console.log('      Maak een .env.local bestand aan in de root directory');
  console.log('      Zie ADMIN_SETUP.md voor instructies');
}

console.log('\n' + '='.repeat(50));
console.log('\n📋 Volgende stappen:');
console.log('   1. Zorg dat .env.local bestaat met VITE_ADMIN_USERNAME en VITE_ADMIN_PASSWORD_HASH');
console.log('   2. Genereer hash met: node scripts/generate-password-hash.js <wachtwoord>');
console.log('   3. Herstart je development server (npm run dev)');
console.log('   4. Test inloggen op http://localhost:3000 (of 3001)\n');
