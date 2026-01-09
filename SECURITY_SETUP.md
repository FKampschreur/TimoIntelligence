# Security Setup Guide

## Admin Credentials Configuration

De applicatie gebruikt nu environment variables voor admin authenticatie in plaats van hardcoded credentials.

### Stap 1: Genereer Password Hash

Gebruik een van de volgende methoden om een SHA-256 hash van je wachtwoord te genereren:

**Op Linux/Mac:**
```bash
echo -n "jouwwachtwoord" | sha256sum
```

**Op Windows (PowerShell):**
```powershell
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$bytes = [System.Text.Encoding]::UTF8.GetBytes("jouwwachtwoord")
$hash = $sha256.ComputeHash($bytes)
$hashString = [System.BitConverter]::ToString($hash).Replace("-", "").ToLower()
Write-Output $hashString
```

**Online tool (alleen voor test):**
Gebruik een SHA-256 hash generator (bijv. https://emn178.github.io/online-tools/sha256.html)

### Stap 2: Configureer Environment Variables

Maak of bewerk het `.env.local` bestand in de root van het project:

```env
# Admin Panel Credentials
VITE_ADMIN_USERNAME=your-email@example.com
VITE_ADMIN_PASSWORD_HASH=your-sha256-hash-here
```

**BELANGRIJK:**
- `.env.local` staat al in `.gitignore` en wordt NIET gecommit naar version control
- Gebruik een sterk wachtwoord (minimaal 12 karakters)
- Deel credentials NOOIT via email of chat
- Roteer credentials regelmatig

### Stap 3: Herstart Development Server

Na het toevoegen van de environment variables, herstart de development server:

```bash
npm run dev
```

## Security Features

### Rate Limiting
- Na 5 mislukte login pogingen wordt het account 15 minuten geblokkeerd
- Pogingen worden geteld per browser sessie

### Session Management
- Authenticatie sessies verlopen na 8 uur
- Sessies worden opgeslagen in sessionStorage (vervalt bij sluiten browser)

### Password Security
- Wachtwoorden worden nooit als plaintext opgeslagen
- SHA-256 hashing wordt gebruikt voor verificatie
- **LET OP:** Voor productie moet server-side authenticatie worden geïmplementeerd

## Productie Aanbevelingen

Voor productie gebruik wordt sterk aangeraden:

1. **Server-side Authentication:** Implementeer een backend API met JWT tokens
2. **Password Hashing:** Gebruik bcrypt of Argon2 in plaats van SHA-256
3. **Rate Limiting:** Implementeer server-side rate limiting
4. **Audit Logging:** Log alle login pogingen en admin acties
5. **2FA:** Overweeg two-factor authentication voor extra beveiliging

## Troubleshooting

**"Authenticatie niet geconfigureerd" error:**
- Controleer of `.env.local` bestaat in de project root
- Controleer of variabelen correct zijn gespeld (VITE_ADMIN_USERNAME, VITE_ADMIN_PASSWORD_HASH)
- Herstart de development server na het toevoegen van variabelen

**Login werkt niet:**
- Controleer of de password hash correct is gegenereerd (geen extra spaties)
- Controleer of de username exact overeenkomt (case-insensitive)
- Controleer browser console voor errors
