#!/usr/bin/env node

/**
 * Script om een SHA-256 hash te genereren van een wachtwoord
 * Voor gebruik in .env.local bestand
 * 
 * Gebruik: node scripts/generate-password-hash.js jouw_wachtwoord
 */

const crypto = require('crypto');

const password = process.argv[2];

if (!password) {
  console.error('❌ Geen wachtwoord opgegeven!');
  console.log('\nGebruik:');
  console.log('  node scripts/generate-password-hash.js jouw_wachtwoord');
  console.log('\nVoorbeeld:');
  console.log('  node scripts/generate-password-hash.js mijnVeiligeWachtwoord123');
  process.exit(1);
}

// Genereer SHA-256 hash
const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('\n✅ Wachtwoord hash gegenereerd!\n');
console.log('Voeg dit toe aan je .env.local bestand:\n');
console.log(`VITE_ADMIN_USERNAME=jouw_gebruikersnaam`);
console.log(`VITE_ADMIN_PASSWORD_HASH=${hash}\n`);
console.log('⚠️  Let op: Bewaar je wachtwoord veilig! Deze hash kan niet worden teruggedraaid.\n');
