import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { sanitizeInput, sanitizeUrl, LocalStorageEncryption } from '../utils/security';
import { fetchContent, saveContent, SaveStatus } from '../utils/apiService';
import { isApiAvailable } from '../utils/apiConfig';


export type IconName = 'Truck' | 'FileText' | 'BarChart3' | 'Users' | 'ImageIcon' | 'Zap' | 'Shield' | 'Globe' | 'Cpu' | 'Building' | 'Package' | 'Code' | 'Settings' | 'Database' | 'Cloud' | 'Lock' | 'Bell' | 'Mail' | 'Calendar' | 'Wallet' | 'ShoppingCart' | 'TrendingUp' | 'Target' | 'Puzzle';

export interface SolutionData {
  id: string; // added for stable identification
  title: string;
  subtitle: string;
  description: string;
  detailTitle: string;
  detailText: string;
  image: string;
  iconName: IconName; 
}

export interface AboutData {
  tag: string;
  titleLine1: string;
  titleLine2: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
  imageUrl: string;
  imageCaption: string;
  imageSubcaption: string;
}

export interface PartnersData {
  title: string;
  description: string;
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
}

export interface ContactData {
  title: string;
  introText: string;
  addressStreet: string;
  addressPostalCode: string;
  addressCity: string;
  addressNote: string;
  email: string;
  phone: string;
  formTitle: string;
  buttonText: string;
}

// Define the shape of our content
export interface ContentState {
  hero: {
    tag: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    buttonPrimary: string;
    buttonSecondary: string;
  };
  solutions: SolutionData[];
  about: AboutData;
  partners: PartnersData;
  contact: ContactData;
}

// Initial Data (The default hardcoded values moved here)
const defaultContent: ContentState = {
  hero: {
    tag: 'POWERED BY HOLLAND FOOD SERVICE',
    titleLine1: 'Intelligente Software.',
    titleLine2: 'Geboren in de Praktijk.',
    description: 'Vanuit Holland Food Service en Timo Vastgoed ontwikkelden wij het ultieme AI-ecosysteem voor logistiek, vastgoed en procesoptimalisatie. Nu beschikbaar voor uw organisatie.',
    buttonPrimary: 'Bekijk onze oplossingen',
    buttonSecondary: 'Vraag demo aan'
  },
  solutions: [
    {
      id: 'fleet',
      title: 'Timo Fleet',
      subtitle: 'Voorheen EcoRoute',
      description: 'Geavanceerd vlootbeheer gericht op maximale kostenreductie en CO2-besparing. Optimaliseer routes en reduceer brandstofverbruik in real-time.',
      detailTitle: 'Strategisch Vlootbeheer',
      detailText: 'Timo Fleet is uw strategische partner voor modern transportmanagement. Gedreven door AI, gaat dit platform verder dan simpele routeplanning. Wij bieden realtime vlootbeheer, dynamische chauffeursroosters en intelligente kostenreductie.\n\nHet systeem maakt autonome afwegingen op basis van uw bedrijfsdata: is een tijdvenster-boete voordeliger dan een extra voertuig inzetten? Prioriteren we elektrisch rijden voor duurzaamheid? Timo Fleet navigeert niet alleen uw wagens, maar ook uw bedrijfsstrategie.',
      image: 'https://i.imgur.com/6ULyMKV.jpg',
      iconName: 'Truck'
    },
    {
      id: 'tender',
      title: 'Timo Tender',
      subtitle: 'Aanbesteding Intelligence',
      description: 'AI-ondersteuning voor het analyseren en winnen van aanbestedingen. Beheer contractvereisten en genereer winnende voorstellen.',
      detailTitle: 'Slimmer Inschrijven',
      detailText: 'Analyseer razendsnel bestekdocumenten en genereer conceptantwoorden op basis van uw historische successen.',
      image: 'https://i.imgur.com/BHQtcIb.jpg',
      iconName: 'FileText'
    },
    {
      id: 'insights',
      title: 'Timo Insights',
      subtitle: 'Business Intelligence',
      description: 'Real-time dashboarding voor grip op inkoop, voorraad en operationele processen. Van ruwe data naar strategische beslissingen.',
      detailTitle: 'Data Driven Decisions',
      detailText: 'Koppel al uw databronnen en visualiseer uw KPI\'s in real-time. Van voorraadbeheer tot financiële prognoses.',
      image: 'https://i.imgur.com/j4wMdCZ.jpg',
      iconName: 'BarChart3'
    },
    {
      id: 'connect',
      title: 'Timo Connect',
      subtitle: 'Medewerkers App',
      description: 'De centrale hub voor uw personeel. Roosterinzage, communicatie en taakbeheer voor maximale tevredenheid en efficiëntie.',
      detailTitle: 'Employee Engagement',
      detailText: 'Verhoog de betrokkenheid van uw medewerkers met een moderne app voor nieuws, roosters en verlofaanvragen.',
      image: 'https://i.imgur.com/BYfL1zs.jpg',
      iconName: 'Users'
    },
    {
      id: 'vision',
      title: 'Timo Vision',
      subtitle: 'Beeldoptimalisatie',
      description: 'Automatische verwerking en optimalisatie van productafbeeldingen voor webshops en catalogi. Consistentie en kwaliteit gegarandeerd.',
      detailTitle: 'Automated Imaging',
      detailText: 'Laat AI uw productfotografie optimaliseren, vrijstaand maken en categoriseren voor e-commerce gebruik.',
      image: 'https://i.imgur.com/tO0TYrR.jpg',
      iconName: 'ImageIcon'
    },
  ],
  about: {
    tag: 'ONZE KRACHT',
    titleLine1: 'Gebouwd op Ervaring.',
    titleLine2: 'Gedreven door Innovatie.',
    paragraph1: 'Vanuit Holland Food Service en Timo Vastgoed hebben wij jarenlang de uitdagingen van logistiek en vastgoedmanagement van dichtbij meegemaakt. Deze praktijkervaring vormt de basis van onze AI-oplossingen.',
    paragraph2: 'Onze software is niet ontwikkeld in een laboratorium, maar geboren uit echte bedrijfsprocessen. Elke feature is getest en verfijnd in de dagelijkse praktijk van onze eigen organisaties.',
    paragraph3: 'Nu delen wij deze intelligentie met organisaties die klaar zijn voor de volgende stap in digitale transformatie. Samen bouwen we aan slimmere, efficiëntere en duurzamere bedrijfsvoering.',
    feature1Title: 'Praktijkervaring',
    feature1Description: 'Jarenlange ervaring in logistiek en vastgoedmanagement',
    feature2Title: 'Innovatie',
    feature2Description: 'Voortdurende ontwikkeling van AI-gedreven oplossingen',
    imageUrl: 'https://picsum.photos/id/1074/600/800',
    imageCaption: 'Management en Development Team',
    imageSubcaption: 'De mensen achter Timo Intelligence'
  },
  partners: {
    title: 'Voor Partners & Aanbestedingen',
    description: 'Op zoek naar een technologiepartner die de taal van aanbestedingen spreekt? Kiest u voor Timo Intelligence, dan kiest u voor innovatiekracht en absolute leverzekerheid.',
    feature1Title: 'Innovatiekracht',
    feature1Description: 'Onderscheidend vermogen in EMVI plannen.',
    feature2Title: 'ISO & Compliance',
    feature2Description: 'Veiligheid en data-integriteit gewaarborgd.'
  },
  contact: {
    title: 'Neem Contact Op',
    introText: 'Klaar om uw organisatie te optimaliseren met Timo Intelligence? Wij komen graag langs voor een demo of een gesprek over de mogelijkheden.',
    addressStreet: 'Bijsterhuizen 2513',
    addressPostalCode: '6604 LM Wijchen (Gld)',
    addressCity: '',
    addressNote: '(Gevestigd bij Holland Food Service)',
    email: 'info@timointelligence.nl',
    phone: '',
    formTitle: 'Stuur ons een bericht',
    buttonText: 'Verstuur Bericht'
  }
};

interface ContentContextType {
  content: ContentState;
  saveStatus: SaveStatus;
  updateContent: (newContent: ContentState) => void;
  updateHero: (key: keyof ContentState['hero'], value: string) => void;
  updateSolution: (index: number, field: keyof SolutionData, value: string | SolutionData['iconName']) => void;
  addSolution: (onAdded?: (newIndex: number) => void) => void;
  removeSolution: (index: number) => void;
  selectIconFromText: (title: string, description: string) => IconName;
  updateAbout: (key: keyof AboutData, value: string) => void;
  updatePartners: (key: keyof PartnersData, value: string) => void;
  updateContact: (key: keyof ContactData, value: string) => void;
  forceSave: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/73ac9368-5f22-431a-97d8-807ae4abf6aa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ContentContext.tsx:100',message:'ContentProvider initializing',data:{solutionsCount:defaultContent.solutions.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  
  // Save status state
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({
    isSaving: false,
    lastSaved: null,
    error: null,
  });

  // Ref om te voorkomen dat we meerdere saves tegelijk doen
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  // Load saved content from localStorage or use default
  const loadSavedContentFromLocalStorage = (): ContentState => {
    try {
      const savedContent = localStorage.getItem('timo-intelligence-content');
      if (savedContent) {
        // Try to parse as JSON first (backward compatibility)
        let parsed: any;
        try {
          parsed = JSON.parse(savedContent);
        } catch (parseError) {
          // If parsing fails, might be encrypted - try to decrypt asynchronously
          // For now, return default and decrypt in useEffect
          return defaultContent;
        }
        
        // Validate that parsed content has the correct structure
        if (parsed && typeof parsed === 'object') {
          // Deep validation of structure
          const isValid = (
            parsed.hero && typeof parsed.hero === 'object' &&
            Array.isArray(parsed.solutions) &&
            parsed.about && typeof parsed.about === 'object' &&
            parsed.partners && typeof parsed.partners === 'object' &&
            parsed.contact && typeof parsed.contact === 'object'
          );
          
          if (isValid) {
            // Validate solutions array structure
            const solutionsValid = parsed.solutions.every((sol: any) => 
              sol && typeof sol === 'object' &&
              typeof sol.id === 'string' &&
              typeof sol.title === 'string' &&
              typeof sol.subtitle === 'string' &&
              typeof sol.description === 'string' &&
              typeof sol.detailTitle === 'string' &&
              typeof sol.detailText === 'string' &&
              typeof sol.image === 'string' &&
              typeof sol.iconName === 'string'
            );
            
            if (solutionsValid) {
              return parsed as ContentState;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading saved content from localStorage:', error);
    }
    return defaultContent;
  };

  const [content, setContent] = useState<ContentState>(loadSavedContentFromLocalStorage);
  
  // Load content from API on mount (if available), fallback to localStorage
  useEffect(() => {
    const loadContent = async () => {
      if (!isApiAvailable()) {
        // API niet beschikbaar, gebruik localStorage
        console.log('API niet geconfigureerd, gebruik localStorage');
        return;
      }

      try {
        setSaveStatus(prev => ({ ...prev, isSaving: true }));
        const response = await fetchContent();
        
        if (response.success && response.data) {
          // Content succesvol opgehaald van API
          setContent(response.data);
          setSaveStatus({
            isSaving: false,
            lastSaved: new Date(),
            error: null,
          });
          console.log('Content geladen van API');
        } else {
          // API geeft geen content terug, gebruik localStorage als fallback
          console.log('Geen content op API, gebruik localStorage:', response.error);
          const localContent = loadSavedContentFromLocalStorage();
          if (localContent !== defaultContent) {
            setContent(localContent);
          }
          setSaveStatus({
            isSaving: false,
            lastSaved: null,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error loading content from API:', error);
        // Fallback naar localStorage
        const localContent = loadSavedContentFromLocalStorage();
        if (localContent !== defaultContent) {
          setContent(localContent);
        }
        setSaveStatus({
          isSaving: false,
          lastSaved: null,
          error: null,
        });
      } finally {
        isInitialLoadRef.current = false;
      }
    };

    loadContent();
  }, []);

  // Try to decrypt encrypted content on mount (if needed) - alleen als API niet beschikbaar is
  useEffect(() => {
    if (isApiAvailable()) return; // Skip als API beschikbaar is
    
    const savedContent = localStorage.getItem('timo-intelligence-content');
    if (savedContent && savedContent.length > 100 && /^[A-Za-z0-9+/=]+$/.test(savedContent)) {
      // Looks like encrypted content, try to decrypt
      LocalStorageEncryption.decrypt(savedContent).then(decrypted => {
        try {
          const parsed = JSON.parse(decrypted);
          if (parsed && typeof parsed === 'object') {
            setContent(parsed as ContentState);
          }
        } catch (error) {
          console.warn('Failed to parse decrypted content:', error);
        }
      }).catch(error => {
        console.warn('Decryption failed, using default content:', error);
      });
    }
  }, []);

  // Save content function - probeert eerst API, dan localStorage
  const persistContent = async (contentToSave: ContentState, showError = false) => {
    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaveStatus(prev => ({ ...prev, isSaving: true, error: null }));

    let savedToApi = false;
    let savedToLocalStorage = false;

    // Try API first if available
    if (isApiAvailable()) {
      try {
        const response = await saveContent(contentToSave);
        if (response.success) {
          savedToApi = true;
          setSaveStatus({
            isSaving: false,
            lastSaved: new Date(),
            error: null,
          });
        } else {
          // API save failed, fallback to localStorage
          console.warn('API save failed, falling back to localStorage:', response.error);
          if (showError) {
            setSaveStatus(prev => ({
              ...prev,
              isSaving: false,
              error: `API opslag mislukt: ${response.error}. Opgeslagen in browser.`,
            }));
          }
        }
      } catch (error: any) {
        console.error('Error saving to API:', error);
        if (showError) {
          setSaveStatus(prev => ({
            ...prev,
            isSaving: false,
            error: `API fout: ${error.message}. Opgeslagen in browser.`,
          }));
        }
      }
    }

    // Always save to localStorage as backup (and primary if API not available)
    try {
      const contentString = JSON.stringify(contentToSave);
      // Encrypt sensitive content before storing
      const encrypted = await LocalStorageEncryption.encrypt(contentString);
      localStorage.setItem('timo-intelligence-content', encrypted);
      savedToLocalStorage = true;
      
      if (!savedToApi && !isApiAvailable()) {
        // Only update status if we're using localStorage as primary
        setSaveStatus({
          isSaving: false,
          lastSaved: new Date(),
          error: null,
        });
      } else if (!savedToApi && isApiAvailable()) {
        // API failed but localStorage succeeded
        setSaveStatus(prev => ({
          ...prev,
          isSaving: false,
          lastSaved: new Date(),
        }));
      }
    } catch (error: any) {
      console.error('Error saving to localStorage:', error);
      setSaveStatus(prev => ({
        ...prev,
        isSaving: false,
        error: prev.error || (error?.name === 'QuotaExceededError' || error?.code === 22
          ? 'Opslagruimte vol. Uw wijzigingen kunnen niet worden opgeslagen.'
          : 'Fout bij opslaan van wijzigingen.'),
      }));
    }
  };

  // Debounced save - wacht 500ms na laatste wijziging voordat we opslaan
  useEffect(() => {
    // Skip save tijdens initial load
    if (isInitialLoadRef.current) {
      return;
    }

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      persistContent(content, false); // Don't show error on auto-save
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content]);

  // Force save function (voor handmatige save knop)
  const forceSave = async () => {
    await persistContent(content, true); // Show error on manual save
  };

  const updateContent = (newContent: ContentState) => {
    setContent(newContent);
  };

  const updateHero = (key: keyof ContentState['hero'], value: string) => {
    // Sanitize input to prevent XSS
    const sanitized = sanitizeInput(value, 5000);
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [key]: sanitized
      }
    }));
  };

  const updateSolution = (index: number, field: keyof SolutionData, value: string | SolutionData['iconName']) => {
    setContent(prev => {
      // Validate index bounds
      if (index < 0 || index >= prev.solutions.length) {
        console.error(`Invalid solution index: ${index}. Solutions array length: ${prev.solutions.length}`);
        return prev; // Return unchanged state if index is invalid
      }
      
      const newSolutions = [...prev.solutions];
      // Ensure the solution at index exists before updating
      if (!newSolutions[index]) {
        console.error(`Solution at index ${index} does not exist`);
        return prev;
      }
      
      // Sanitize input based on field type
      let sanitizedValue: string | SolutionData['iconName'] = value;
      if (field === 'image') {
        // Sanitize URL for image field
        sanitizedValue = sanitizeUrl(value as string) || (value as string);
      } else if (typeof value === 'string') {
        // Sanitize text fields
        const maxLength = field === 'detailText' ? 10000 : field === 'description' ? 2000 : 500;
        sanitizedValue = sanitizeInput(value, maxLength);
      }
      
      newSolutions[index] = {
        ...newSolutions[index],
        [field]: sanitizedValue
      };
      return {
        ...prev,
        solutions: newSolutions
      };
    });
  };

  // Function to intelligently select an icon based on text content
  const selectIconFromText = (title: string, description: string): IconName => {
    const text = `${title} ${description}`.toLowerCase();
    
    // Keyword matching for different categories
    const iconKeywords: { [key in IconName]?: string[] } = {
      Truck: ['vloot', 'fleet', 'transport', 'vervoer', 'voertuig', 'chauffeur', 'route', 'logistiek'],
      FileText: ['aanbesteding', 'tender', 'document', 'contract', 'bestek', 'voorstel', 'rapport'],
      BarChart3: ['insights', 'data', 'analytics', 'dashboard', 'kpi', 'statistiek', 'meting', 'rapportage'],
      Users: ['medewerker', 'personeel', 'team', 'connect', 'rooster', 'verlof', 'hr', 'human'],
      ImageIcon: ['beeld', 'image', 'foto', 'fotografie', 'visual', 'afbeelding', 'catalogus'],
      Zap: ['energie', 'elektriciteit', 'snel', 'real-time', 'instant', 'power'],
      Shield: ['security', 'veiligheid', 'bescherming', 'compliance', 'iso', 'certificering'],
      Globe: ['web', 'internet', 'online', 'website', 'platform', 'cloud'],
      Cpu: ['technologie', 'tech', 'software', 'systeem', 'platform', 'ai', 'intelligentie'],
      Building: ['vastgoed', 'real estate', 'gebouw', 'faciliteit', 'property'],
      Package: ['pakket', 'levering', 'voorraad', 'inventory', 'warehouse', 'opslag'],
      Code: ['development', 'ontwikkeling', 'programmeren', 'api', 'integratie'],
      Settings: ['configuratie', 'instellingen', 'beheer', 'management', 'admin'],
      Database: ['database', 'data', 'opslag', 'storage', 'informatie'],
      Cloud: ['cloud', 'saas', 'online', 'remote', 'hosting'],
      Lock: ['beveiliging', 'security', 'encryptie', 'privacy', 'toegang'],
      Bell: ['notificatie', 'alert', 'melding', 'waarschuwing', 'reminder'],
      Mail: ['email', 'communicatie', 'contact', 'bericht', 'newsletter'],
      Calendar: ['agenda', 'planning', 'afspraak', 'event', 'rooster'],
      Wallet: ['financieel', 'betaling', 'factuur', 'accounting', 'geld'],
      ShoppingCart: ['e-commerce', 'winkel', 'verkoop', 'order', 'bestelling'],
      TrendingUp: ['groei', 'performance', 'resultaat', 'succes', 'verbetering'],
      Target: ['doel', 'strategie', 'focus', 'planning', 'missie'],
      Puzzle: ['integratie', 'connectie', 'ecosysteem', 'samenwerking', 'link']
    };

    // Score each icon based on keyword matches
    const scores: { [key in IconName]?: number } = {};
    
    for (const [icon, keywords] of Object.entries(iconKeywords)) {
      scores[icon as IconName] = keywords.reduce((score, keyword) => {
        return score + (text.includes(keyword) ? 1 : 0);
      }, 0);
    }

    // Find the icon with the highest score
    const bestMatch = Object.entries(scores).reduce((best, [icon, score]) => {
      return (score || 0) > (best.score || 0) ? { icon: icon as IconName, score: score || 0 } : best;
    }, { icon: 'Cpu' as IconName, score: 0 });

    // If no match found, default to Cpu (technology icon)
    return bestMatch.score > 0 ? bestMatch.icon : 'Cpu';
  };

  const addSolution = (onAdded?: (newIndex: number) => void) => {
    setContent(prev => {
      const defaultTitle = 'Nieuwe Oplossing';
      const defaultDescription = 'Beschrijving van de oplossing';
      const selectedIcon = selectIconFromText(defaultTitle, defaultDescription);
      
      const newSolution: SolutionData = {
        id: `solution-${Date.now()}`,
        title: defaultTitle,
        subtitle: 'Subtitel',
        description: defaultDescription,
        detailTitle: 'Detail Titel',
        detailText: 'Detail tekst van de oplossing',
        image: 'https://picsum.photos/id/1/600/400',
        iconName: selectedIcon
      };
      const newIndex = prev.solutions.length;
      // Call callback with new index after state update
      if (onAdded) {
        setTimeout(() => onAdded(newIndex), 0);
      }
      return {
        ...prev,
        solutions: [...prev.solutions, newSolution]
      };
    });
  };

  const removeSolution = (index: number) => {
    setContent(prev => {
      const newSolutions = prev.solutions.filter((_, i) => i !== index);
      return {
        ...prev,
        solutions: newSolutions
      };
    });
  };

  const updateAbout = (key: keyof AboutData, value: string) => {
    // Sanitize input
    const maxLength = key === 'imageUrl' ? 2000 : key.startsWith('paragraph') ? 5000 : 500;
    const sanitized = key === 'imageUrl' ? sanitizeUrl(value) || value : sanitizeInput(value, maxLength);
    setContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        [key]: sanitized
      }
    }));
  };

  const updatePartners = (key: keyof PartnersData, value: string) => {
    // Sanitize input
    const maxLength = key === 'description' ? 2000 : 500;
    const sanitized = sanitizeInput(value, maxLength);
    setContent(prev => ({
      ...prev,
      partners: {
        ...prev.partners,
        [key]: sanitized
      }
    }));
  };

  const updateContact = (key: keyof ContactData, value: string) => {
    // Sanitize input
    const maxLength = key === 'introText' ? 2000 : 500;
    const sanitized = sanitizeInput(value, maxLength);
    setContent(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [key]: sanitized
      }
    }));
  };

  return (
    <ContentContext.Provider value={{ 
      content, 
      saveStatus,
      updateContent, 
      updateHero, 
      updateSolution, 
      addSolution, 
      removeSolution, 
      selectIconFromText, 
      updateAbout, 
      updatePartners, 
      updateContact,
      forceSave,
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/73ac9368-5f22-431a-97d8-807ae4abf6aa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ContentContext.tsx:138',message:'useContent hook called',data:{hasContext:context!==undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  if (context === undefined) {
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/73ac9368-5f22-431a-97d8-807ae4abf6aa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ContentContext.tsx:141',message:'useContent error: context undefined',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
