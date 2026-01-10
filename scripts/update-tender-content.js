/**
 * Script om Timo Tender content te updaten in localStorage
 * Run dit script in de browser console of via Node.js
 */

const updateTenderContent = () => {
  try {
    const storageKey = 'timo-intelligence-content';
    const storedContent = localStorage.getItem(storageKey);
    
    if (!storedContent) {
      console.log('Geen content gevonden in localStorage. De nieuwe standaard content wordt gebruikt bij de volgende pagina refresh.');
      return;
    }

    let content;
    try {
      // Probeer te parsen als JSON (niet-gecodeerd)
      content = JSON.parse(storedContent);
    } catch (e) {
      // Mogelijk gecodeerd, probeer te decoderen
      try {
        const decoded = atob(storedContent);
        content = JSON.parse(decoded);
      } catch (e2) {
        console.error('Kan content niet parsen. Mogelijk is het versleuteld.');
        console.log('Gebruik clear-localstorage.html om localStorage te legen.');
        return;
      }
    }

    // Zoek Timo Tender solution en update
    if (content.solutions && Array.isArray(content.solutions)) {
      const tenderIndex = content.solutions.findIndex(s => s.id === 'tender' || s.title === 'Timo Tender');
      
      if (tenderIndex !== -1) {
        content.solutions[tenderIndex].detailTitle = 'De kritische kracht achter de perfecte match.';
        content.solutions[tenderIndex].detailText = 'Een aanbesteding win je niet met standaardantwoorden, maar met de beste oplossing. Timo Tender is onze exclusieve, interne challenger die het team van Holland Food Service scherp houdt.\n\nDeze module schrijft geen blindelings aanbod, maar fungeert als een intelligente kwaliteitsmanager. Timo analyseert uw uitvraag tot in de kern en toetst onze concepten genadeloos: Geven wij écht antwoord op de vraag van de zorgorganisatie? Is dit de beste versie van onszelf?\n\nDaarnaast scant Timo continu de markt op trends, sterktes en zwaktes. Hierdoor ontvangt u geen generiek verhaal, maar een doordacht voorstel dat feitelijk klopt, perfect aansluit op uw wensen en rekening houdt met de wereld van morgen.';
        
        // Sla op
        try {
          const contentString = JSON.stringify(content);
          localStorage.setItem(storageKey, contentString);
          console.log('✓ Timo Tender content succesvol bijgewerkt!');
          console.log('Ververs de pagina (F5) om de wijzigingen te zien.');
        } catch (saveError) {
          console.error('Fout bij opslaan:', saveError);
        }
      } else {
        console.log('Timo Tender solution niet gevonden in content.');
      }
    } else {
      console.log('Geen solutions array gevonden in content.');
    }
  } catch (error) {
    console.error('Fout bij updaten:', error);
  }
};

// Als dit script in de browser wordt uitgevoerd
if (typeof window !== 'undefined') {
  updateTenderContent();
} else {
  // Als dit via Node.js wordt uitgevoerd, exporteer de functie
  module.exports = { updateTenderContent };
}
