import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { sanitizeInput, sanitizeUrl } from '../utils/security'; // Still used in updateSolution
import { SaveStatus } from '../utils/apiService';
import { agentLog } from '../utils/agentLogging';
import { selectIconFromText } from '../utils/iconMapper';
import { validateContentStructure } from './validators/contentValidator';
import { ContentPersistenceService } from './services/ContentPersistenceService';
import {
  createContentUpdater,
  HERO_FIELD_CONFIG,
  ABOUT_FIELD_CONFIG,
  PARTNERS_FIELD_CONFIG,
  CONTACT_FIELD_CONFIG
} from './hooks/useContentUpdater';


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
  subtitle: string;
  description: string;
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
  feature3Title: string;
  feature3Description: string;
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
    description: 'Vanuit de unieke wisselwerking tussen Holland Food Service en de tech-specialisten van Timo Intelligente ontwikkelden wij het ultieme AI-ecosysteem. Geen software van een afstand, maar intelligentie direct uit de praktijk.\n\nOf het nu gaat om het MKB of complexe zorginstellingen: met Timo optimaliseert u niet alleen uw bedrijfsprocessen, u bent klaar voor de toekomst. Onze technologie, geboren op de werkvloer, is nu beschikbaar voor úw organisatie.',
    buttonPrimary: 'Bekijk onze oplossingen',
    buttonSecondary: 'Vraag demo aan'
  },
  solutions: [
    {
      id: 'fleet',
      title: 'Timo Fleet',
      subtitle: 'Voorheen EcoRoute',
      description: 'Real-time vlootoptimalisatie die CO2-uitstoot minimaliseert en efficiency maximaliseert. Wij bewijzen dat duurzaamheid en leverbetrouwbaarheid hand in hand gaan.',
      detailTitle: 'Strategisch Vlootbeheer',
      detailText: 'Timo Fleet is uw strategische partner voor modern transportmanagement. Gedreven door AI, gaat dit platform verder dan simpele routeplanning. Wij bieden realtime vlootbeheer, dynamische chauffeursroosters en intelligente kostenreductie.\n\nHet systeem maakt autonome afwegingen op basis van uw bedrijfsdata: is een tijdvenster-boete voordeliger dan een extra voertuig inzetten? Prioriteren we elektrisch rijden voor duurzaamheid? Timo Fleet navigeert niet alleen uw wagens, maar ook uw bedrijfsstrategie.',
      image: 'https://i.imgur.com/6ULyMKV.jpg',
      iconName: 'Truck'
    },
    {
      id: 'tender',
      title: 'Timo Tender',
      subtitle: 'Aanbesteding Intelligence',
      description: 'Strategische kwaliteitsbewaking bij tenders. Timo analyseert uw uitvraag tot in de kern en daagt ons uit om de perfecte vertaalslag te maken naar uw wensen.',
      detailTitle: 'De kritische kracht achter de perfecte match.',
      detailText: 'Een aanbesteding win je niet met standaardantwoorden, maar met de beste oplossing. Timo Tender is onze exclusieve, interne challenger die het team van Holland Food Service scherp houdt.\n\nDeze module schrijft geen blindelings aanbod, maar fungeert als een intelligente kwaliteitsmanager. Timo analyseert uw uitvraag tot in de kern en toetst onze concepten genadeloos: Geven wij écht antwoord op de vraag van de zorgorganisatie? Is dit de beste versie van onszelf?\n\nDaarnaast scant Timo continu de markt op trends, sterktes en zwaktes. Hierdoor ontvangt u geen generiek verhaal, maar een doordacht voorstel dat feitelijk klopt, perfect aansluit op uw wensen en rekening houdt met de wereld van morgen.',
      image: 'https://i.imgur.com/BHQtcIb.jpg',
      iconName: 'FileText'
    },
    {
      id: 'insights',
      title: 'Timo Insights',
      subtitle: 'Business Intelligence',
      description: 'Volledige regie over uw keten. Stop met het managen van losse eilandjes. Timo verbindt inkoop, voorraad en financiën in één levend overzicht. Van de eerste bestelling tot de laatste factuur: u ziet direct hoe operationele details uw strategische doelen beïnvloeden.',
      detailTitle: 'Data Driven Decisions',
      detailText: 'Van achteraf verklaren naar vooraf bijsturen. Stop met sturen in de achteruitkijkspiegel. Timo bundelt al uw stromen – van inkoop tot financiën – in één helder dashboard. Geen verrassingen achteraf, maar real-time grip op uw budgetten en processen.',
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
      description: 'Uw assortiment, perfect in beeld. Transformeer ruw beeldmateriaal direct naar een strakke, uniforme webshop-ervaring. Timo zorgt volautomatisch voor vrijstaande beelden en consistente kwaliteit. Zodat uw producten de aandacht krijgen die ze verdienen.',
      detailTitle: 'Automated Imaging',
      detailText: 'Visuele perfectie, volledig geautomatiseerd. Uw assortiment verdient de beste presentatie. Timo Vision transformeert ruwe foto\'s direct naar professionele, vrijstaande e-commerce beelden. Het resultaat? Een uniforme, aantrekkelijke catalogus die de verkoop stimuleert, zonder dat er een fotograaf aan te pas komt.',
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
    title: 'Partnerschap & Technologie',
    subtitle: 'De stille kracht achter uw operatie.',
    description: 'Op zoek naar een samenwerking die verder gaat dan alleen dozen schuiven? Kiest u voor Holland Food Service met Timo Intelligente, dan kiest u voor de perfecte balans tussen logistieke betrouwbaarheid en technologische vooruitgang. Wij bieden de zekerheid van een bewezen partner, met de innovatiekracht van een tech-pionier.',
    feature1Title: 'Innovatiekracht & Continuïteit',
    feature1Description: 'Stilstand is achteruitgang. Met Timo kiest u niet voor een statisch pakket, maar voor een platform dat continu meegroeit met de markt. Wij leveren tools die uw processen vandaag optimaliseren, en u voorbereiden op de uitdagingen van morgen.',
    feature2Title: 'Future-Proof Architectuur',
    feature2Description: 'Wij bouwen niet op verouderde servers, maar op een moderne, cloud-native infrastructuur. Voor uw organisatie betekent dit pure snelheid en betrouwbaarheid:\n\nMaximale Uptime: Dankzij ons \'Serverless\' platform (Edge Network) is de software altijd en overal razendsnel beschikbaar.\n\nReal-time Data: Wijzigingen zijn direct zichtbaar voor alle gebruikers. Geen vertraging, geen synchronisatiefouten.\n\nSchaalbaarheid: Of u nu 1.000 of 500.000 maaltijden verwerkt; onze architectuur groeit naadloos met u mee zonder prestatieverlies.',
    feature3Title: 'ISO & Compliance',
    feature3Description: 'In de zorg is dataheiligheid geen discussiepunt, maar een vereiste.\n\nSecurity by Design: Beveiliging zit in de kern van onze code, niet in een schil eromheen.\n\nAVG-Proof: Volledige encryptie van data en strikte scheiding van gegevensstromen.\n\nControleerbaar: Dankzij geautomatiseerde versiebeheer-systemen is elke wijziging in de software traceerbaar en transparant.'
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
  agentLog('ContentContext.tsx:100', 'ContentProvider initializing', { solutionsCount: defaultContent.solutions.length });
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
  const isLoadingContentRef = useRef(false);
  const isSavingRef = useRef(false);

  // Initialize content with default (will be replaced by loadContent)
  const [content, setContent] = useState<ContentState>(defaultContent);
  
  // Load content from API or localStorage on mount
  useEffect(() => {
    // Prevent concurrent loads
    if (isLoadingContentRef.current) {
      return;
    }
    
    const loadContent = async () => {
      isLoadingContentRef.current = true;
      setSaveStatus(prev => ({ ...prev, isSaving: true }));
      
      try {
        const loadedContent = await ContentPersistenceService.loadContent(defaultContent);
        setContent(loadedContent);
        setSaveStatus({
          isSaving: false,
          lastSaved: loadedContent !== defaultContent ? new Date() : null,
          error: null,
        });
      } catch (error) {
        console.error('Error loading content:', error);
        setContent(defaultContent);
        setSaveStatus({
          isSaving: false,
          lastSaved: null,
          error: null,
        });
      } finally {
        isLoadingContentRef.current = false;
        isInitialLoadRef.current = false;
      }
    };

    loadContent();
  }, []);

  // Save content function - uses ContentPersistenceService
  const persistContent = async (contentToSave: ContentState, showError = false) => {
    // Prevent concurrent saves - use mutex pattern
    if (isSavingRef.current) {
      console.warn('Save already in progress, skipping duplicate save');
      return;
    }

    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    isSavingRef.current = true;
    setSaveStatus(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      const result = await ContentPersistenceService.saveContent(contentToSave, showError);
      
      if (result.error && showError) {
        const errorMessage = result.savedToLocalStorage
          ? `API opslag mislukt: ${result.error}. Opgeslagen in browser.`
          : result.error;
        setSaveStatus(prev => ({
          ...prev,
          isSaving: false,
          error: errorMessage,
        }));
      } else {
        setSaveStatus({
          isSaving: false,
          lastSaved: new Date(),
          error: null,
        });
      }
    } catch (error: any) {
      console.error('Error in persistContent:', error);
      setSaveStatus(prev => ({
        ...prev,
        isSaving: false,
        error: showError ? (error?.message || 'Fout bij opslaan') : prev.error,
      }));
    } finally {
      isSavingRef.current = false;
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
      saveTimeoutRef.current = null;
    }

    // Set new timeout
    const timeoutId = setTimeout(() => {
      persistContent(content, false).catch(error => {
        console.error('Error in debounced save:', error);
      });
      saveTimeoutRef.current = null;
    }, 500);
    
    saveTimeoutRef.current = timeoutId;

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
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

  // Create updater functions using the generic helper
  const heroUpdater = createContentUpdater<ContentState['hero']>('hero', HERO_FIELD_CONFIG);
  const aboutUpdater = createContentUpdater<AboutData>('about', ABOUT_FIELD_CONFIG);
  const partnersUpdater = createContentUpdater<PartnersData>('partners', PARTNERS_FIELD_CONFIG);
  const contactUpdater = createContentUpdater<ContactData>('contact', CONTACT_FIELD_CONFIG);

  const updateHero = (key: keyof ContentState['hero'], value: string) => {
    const sanitized = heroUpdater(key, value);
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
    const sanitized = aboutUpdater(key, value);
    setContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        [key]: sanitized
      }
    }));
  };

  const updatePartners = (key: keyof PartnersData, value: string) => {
    const sanitized = partnersUpdater(key, value);
    setContent(prev => ({
      ...prev,
      partners: {
        ...prev.partners,
        [key]: sanitized
      }
    }));
  };

  const updateContact = (key: keyof ContactData, value: string) => {
    const sanitized = contactUpdater(key, value);
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
  agentLog('ContentContext.tsx:138', 'useContent hook called', { hasContext: context !== undefined });
  // #endregion
  if (context === undefined) {
    // #region agent log
    agentLog('ContentContext.tsx:141', 'useContent error: context undefined');
    // #endregion
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
