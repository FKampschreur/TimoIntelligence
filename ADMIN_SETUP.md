# Admin Authenticatie Setup

## Probleem: "Admin credentials not configured"

Als je deze foutmelding ziet, betekent dit dat de admin credentials niet zijn ingesteld in je `.env.local` bestand.

## Oplossing

### Stap 1: Genereer een Password Hash

Je hebt twee opties:

#### Optie A: Via Node.js Script (Aanbevolen)

```bash
node scripts/generate-password-hash.js jouw_wachtwoord
```

Dit geeft je output zoals:
```
✅ Password hash gegenereerd!

Voeg dit toe aan je .env.local bestand:

VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD_HASH=abc123def456...
```

#### Optie B: Via Browser Tool

1. Open `scripts/generate-password-hash.html` in je browser
2. Voer je gebruikersnaam en wachtwoord in
3. Klik op "Genereer Hash"
4. Kopieer de gegenereerde configuratie

### Stap 2: Maak/Update .env.local Bestand

Maak een `.env.local` bestand in de root van je project (als deze nog niet bestaat) en voeg toe:

```env
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD_HASH=je_gegenereerde_hash_hier
```

**Belangrijk:**
- Vervang `admin` met je gewenste gebruikersnaam
- Vervang `je_gegenereerde_hash_hier` met de hash die je hebt gegenereerd
- Gebruik geen quotes rondom de waarden

### Stap 3: Herstart Development Server

Na het toevoegen van de credentials, herstart je development server:

```bash
# Stop de huidige server (Ctrl+C)
# Start opnieuw
npm run dev
```

### Stap 4: Test Inloggen

1. Open je website (meestal http://localhost:3000, of http://localhost:3001 als poort 3000 bezet is)
2. Klik op het ⚙️ icoon rechtsonder
3. Log in met je gebruikersnaam en wachtwoord

## Veiligheid

- ⚠️ **Deel je `.env.local` bestand NOOIT** - het staat al in `.gitignore`
- ⚠️ **Bewaar je wachtwoord veilig** - als je het vergeet, moet je een nieuwe hash genereren
- ⚠️ **Gebruik een sterk wachtwoord** voor productie

## Troubleshooting

### "Admin credentials not configured" blijft verschijnen

1. Controleer of `.env.local` bestaat in de root directory
2. Controleer of de variabelen correct zijn gespeld (moeten beginnen met `VITE_`)
3. Herstart je development server na het toevoegen/wijzigen van `.env.local`
4. Controleer of er geen extra spaties of quotes zijn rondom de waarden

### Kan niet inloggen met correcte credentials

1. Controleer of je de juiste hash hebt gebruikt (genereer opnieuw als nodig)
2. Controleer of gebruikersnaam exact overeenkomt (case-sensitive)
3. Controleer browser console voor andere foutmeldingen

## Voorbeeld .env.local

```env
# Admin Authenticatie
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD_HASH=5e884898da28047151d0e56f8dc6292773603d0d6aabbd62a11ef721d1542d8

# Optioneel: Supabase (als je Supabase gebruikt)
# SUPABASE_URL=https://xxxxx.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optioneel: Backend API (als je backend server gebruikt)
# VITE_API_BASE_URL=http://localhost:3001/api
```
