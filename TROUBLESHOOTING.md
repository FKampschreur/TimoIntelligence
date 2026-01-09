# Troubleshooting Guide

## Probleem: Kan niet inloggen

### Stap 1: Controleer .env.local bestand

Voer het diagnose script uit:
```bash
node scripts/check-admin-config.js
```

Of test met je wachtwoord:
```bash
node scripts/check-admin-config.js jouw_wachtwoord
```

### Stap 2: Controleer of .env.local correct is

Je `.env.local` bestand moet er zo uitzien:
```env
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD_HASH=240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
```

**Belangrijk:**
- Geen quotes rondom de waarden
- Geen spaties rondom de `=`
- Elke variabele op een aparte regel

### Stap 3: Genereer nieuwe hash (als nodig)

Als je je wachtwoord bent vergeten of een nieuwe wilt:
```bash
node scripts/generate-password-hash.js nieuw_wachtwoord
```

Kopieer de output naar je `.env.local` bestand.

### Stap 4: Herstart development server

**Belangrijk:** Na het wijzigen van `.env.local` moet je de server herstarten!

1. Stop de server (Ctrl+C in terminal)
2. Start opnieuw: `npm run dev`

### Stap 5: Test inloggen

1. Open http://localhost:3000 (of 3001 als 3000 bezet is)
2. Klik op ⚙️ rechtsonder
3. Log in met:
   - Gebruikersnaam: `admin` (of wat je hebt ingesteld)
   - Wachtwoord: Het wachtwoord dat je hebt gebruikt om de hash te genereren

## Veelvoorkomende Problemen

### "Admin credentials not configured"

**Oorzaak:** `.env.local` bestaat niet of variabelen zijn niet correct ingesteld.

**Oplossing:**
1. Controleer of `.env.local` bestaat in de root directory
2. Controleer of variabelen beginnen met `VITE_`
3. Herstart development server

### "Ongeldige gebruikersnaam of wachtwoord"

**Oorzaak:** Hash komt niet overeen met ingevoerd wachtwoord.

**Oplossing:**
1. Genereer nieuwe hash: `node scripts/generate-password-hash.js jouw_wachtwoord`
2. Update `.env.local` met nieuwe hash
3. Herstart server
4. Probeer opnieuw in te loggen

### Website laadt niet / Poort conflict

**Oorzaak:** Poort 3000 is bezet of backend draait op zelfde poort.

**Oplossing:**
- Frontend gebruikt automatisch volgende beschikbare poort
- Check welke poort Vite gebruikt in terminal output
- Of wijzig backend poort naar 3002 in `.env.local`:
  ```env
  PORT=3002
  ```

### Environment variables worden niet geladen

**Oorzaak:** Vite laadt alleen variabelen die beginnen met `VITE_`.

**Oplossing:**
- Zorg dat variabelen beginnen met `VITE_`
- Herstart server na wijzigingen
- Check browser console voor errors

## Debug Checklist

- [ ] `.env.local` bestaat in root directory
- [ ] Variabelen beginnen met `VITE_`
- [ ] Geen quotes rondom waarden
- [ ] Password hash is 64 karakters lang
- [ ] Development server is herstart na wijzigingen
- [ ] Browser cache is geleegd (Ctrl+Shift+R)
- [ ] Console heeft geen errors (F12 → Console tab)

## Hulp Nodig?

1. Voer diagnose script uit: `node scripts/check-admin-config.js`
2. Check browser console (F12) voor errors
3. Check terminal output voor warnings
4. Zie `ADMIN_SETUP.md` voor complete setup instructies
