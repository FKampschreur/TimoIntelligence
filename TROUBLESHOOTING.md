# Troubleshooting Guide

## Veelvoorkomende Problemen

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

### Wijzigingen worden niet opgeslagen

**Oorzaak:** localStorage is vol of geblokkeerd.

**Oplossing:**
1. Check browser console voor errors (F12 → Console tab)
2. Controleer of localStorage beschikbaar is
3. Probeer browser cache te legen
4. Als je een backend API gebruikt, controleer of deze bereikbaar is

### Admin panel opent niet

**Oplossing:**
1. Check of de ⚙️ knop rechtsonder zichtbaar is
2. Check browser console voor JavaScript errors (F12)
3. Herstart development server
4. Probeer hard refresh (Ctrl+Shift+R)

## Debug Checklist

- [ ] Development server draait (`npm run dev`)
- [ ] Geen errors in browser console (F12 → Console tab)
- [ ] Geen errors in terminal output
- [ ] Browser cache is geleegd (Ctrl+Shift+R)
- [ ] JavaScript is ingeschakeld in browser
- [ ] (Als backend gebruikt) Backend server draait en is bereikbaar

## Hulp Nodig?

1. Check browser console (F12) voor errors
2. Check terminal output voor warnings
3. Zie `BEHEER_HANDLEIDING.md` voor complete setup instructies
