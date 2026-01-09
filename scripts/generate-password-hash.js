/**
 * Script om een password hash te genereren voor admin authenticatie
 * 
 * Gebruik: node scripts/generate-password-hash.js <wachtwoord>
 * 
 * Voorbeeld: node scripts/generate-password-hash.js mijnwachtwoord123
 */

import crypto from 'crypto';

// Haal wachtwoord uit command line argumenten
const password = process.argv[2];

if (!password) {
  console.error('❌ Geef een wachtwoord op als argument');
  console.log('\nGebruik:');
  console.log('  node scripts/generate-password-hash.js <wachtwoord>');
  console.log('\nVoorbeeld:');
  console.log('  node scripts/generate-password-hash.js mijnwachtwoord123');
  process.exit(1);
}

// Genereer SHA-256 hash (zelfde als in useAdminAuth.ts)
const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('\n✅ Password hash gegenereerd!\n');
console.log('Voeg dit toe aan je .env.local bestand:\n');
console.log(`VITE_ADMIN_USERNAME=admin`);
console.log(`VITE_ADMIN_PASSWORD_HASH=${hash}\n`);
console.log('⚠️  Let op: Bewaar je wachtwoord veilig en deel de hash niet!\n');
