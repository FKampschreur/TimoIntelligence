/**
 * Script om te testen of admin credentials correct worden geladen
 * 
 * Dit simuleert wat er in de browser gebeurt bij het inloggen
 */

import crypto from 'crypto';

console.log('🧪 Test Admin Login Configuratie\n');
console.log('='.repeat(50));

// Simuleer de hash functie zoals in useAdminAuth.ts
const simpleHash = async (str) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Test credentials
const testUsername = process.argv[2] || 'admin';
const testPassword = process.argv[3] || 'admin123';

console.log('\n1️⃣  Test Hash Generatie...');
console.log(`   Gebruikersnaam: ${testUsername}`);
console.log(`   Wachtwoord: ${testPassword}`);

try {
  const hash = await simpleHash(testPassword);
  console.log(`   ✅ Hash gegenereerd: ${hash}`);
  console.log(`   Lengte: ${hash.length} karakters`);
  
  console.log('\n2️⃣  Vergelijk met .env.local...');
  
  // Lees .env.local
  const { readFileSync, existsSync } = await import('fs');
  const { fileURLToPath } = await import('url');
  const { dirname, join } = await import('path');
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const projectRoot = join(__dirname, '..');
  const envPath = join(projectRoot, '.env.local');
  
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8');
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
    
    const storedUsername = envVars['VITE_ADMIN_USERNAME'];
    const storedHash = envVars['VITE_ADMIN_PASSWORD_HASH'];
    
    console.log(`   Opgeslagen gebruikersnaam: ${storedUsername || 'NIET GEVONDEN'}`);
    console.log(`   Opgeslagen hash: ${storedHash ? storedHash.substring(0, 20) + '...' : 'NIET GEVONDEN'}`);
    
    if (storedUsername && storedHash) {
      console.log('\n3️⃣  Validatie...');
      
      // Check username
      if (testUsername.toLowerCase() === storedUsername.toLowerCase()) {
        console.log('   ✅ Gebruikersnaam komt overeen');
      } else {
        console.log(`   ❌ Gebruikersnaam komt NIET overeen`);
        console.log(`      Verwacht: ${storedUsername}`);
        console.log(`      Gekregen: ${testUsername}`);
      }
      
      // Check password hash
      if (hash === storedHash) {
        console.log('   ✅ Password hash komt overeen');
        console.log('\n✅ ALLES CORRECT! Je kunt inloggen met:');
        console.log(`   Gebruikersnaam: ${testUsername}`);
        console.log(`   Wachtwoord: ${testPassword}`);
      } else {
        console.log('   ❌ Password hash komt NIET overeen');
        console.log(`      Verwacht: ${storedHash}`);
        console.log(`      Gekregen: ${hash}`);
        console.log('\n⚠️  Het wachtwoord komt niet overeen met de hash in .env.local');
        console.log('   Genereer nieuwe hash met:');
        console.log(`   node scripts/generate-password-hash.js ${testPassword}`);
      }
    } else {
      console.log('\n❌ Configuratie niet compleet!');
      if (!storedUsername) {
        console.log('   - VITE_ADMIN_USERNAME ontbreekt');
      }
      if (!storedHash) {
        console.log('   - VITE_ADMIN_PASSWORD_HASH ontbreekt');
      }
      console.log('\n   Setup met:');
      console.log(`   node scripts/setup-admin-env.js ${testUsername} ${testPassword}`);
    }
  } else {
    console.log('   ❌ .env.local bestaat niet');
    console.log('   Maak aan met:');
    console.log(`   node scripts/setup-admin-env.js ${testUsername} ${testPassword}`);
  }
  
} catch (error) {
  console.error('❌ Fout:', error.message);
  process.exit(1);
}

console.log('\n' + '='.repeat(50));
