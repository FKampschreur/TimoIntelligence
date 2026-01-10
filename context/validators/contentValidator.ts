/**
 * Content structure validation
 * Extracted from ContentContext to improve maintainability and reusability
 */

import { ContentState, IconName, SolutionData, AboutData, PartnersData, ContactData } from '../ContentContext';

const VALID_ICON_NAMES: IconName[] = [
  'Truck', 'FileText', 'BarChart3', 'Users', 'ImageIcon', 'Zap', 
  'Shield', 'Globe', 'Cpu', 'Building', 'Package', 'Code', 'Settings', 
  'Database', 'Cloud', 'Lock', 'Bell', 'Mail', 'Calendar', 'Wallet', 
  'ShoppingCart', 'TrendingUp', 'Target', 'Puzzle'
];

/**
 * Validates that an object has all required string fields
 */
function validateStringFields<T extends Record<string, any>>(
  obj: any,
  fields: (keyof T)[]
): obj is T {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  return fields.every(field => typeof obj[field] === 'string');
}

/**
 * Validates a single solution object
 */
function validateSolution(sol: any): sol is SolutionData {
  return sol && typeof sol === 'object' &&
    typeof sol.id === 'string' &&
    typeof sol.title === 'string' &&
    typeof sol.subtitle === 'string' &&
    typeof sol.description === 'string' &&
    typeof sol.detailTitle === 'string' &&
    typeof sol.detailText === 'string' &&
    typeof sol.image === 'string' &&
    typeof sol.iconName === 'string' &&
    VALID_ICON_NAMES.includes(sol.iconName);
}

/**
 * Deep validation of ContentState structure
 * Returns type guard to ensure type safety
 */
export function validateContentStructure(data: any): data is ContentState {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Validate hero
  const heroFields: (keyof ContentState['hero'])[] = [
    'tag', 'titleLine1', 'titleLine2', 'description', 'buttonPrimary', 'buttonSecondary'
  ];
  if (!validateStringFields<ContentState['hero']>(data.hero, heroFields)) {
    return false;
  }

  // Validate solutions array
  if (!Array.isArray(data.solutions) || data.solutions.length === 0) {
    return false;
  }
  if (!data.solutions.every(validateSolution)) {
    return false;
  }

  // Validate about
  const aboutFields: (keyof AboutData)[] = [
    'tag', 'titleLine1', 'titleLine2', 'paragraph1', 'paragraph2', 'paragraph3', 
    'feature1Title', 'feature1Description', 'feature2Title', 'feature2Description', 
    'imageUrl', 'imageCaption', 'imageSubcaption'
  ];
  if (!validateStringFields<AboutData>(data.about, aboutFields)) {
    return false;
  }

  // Validate partners
  const partnersFields: (keyof PartnersData)[] = [
    'title', 'subtitle', 'description', 'feature1Title', 'feature1Description', 
    'feature2Title', 'feature2Description', 'feature3Title', 'feature3Description'
  ];
  if (!validateStringFields<PartnersData>(data.partners, partnersFields)) {
    return false;
  }

  // Validate contact
  const contactFields: (keyof ContactData)[] = [
    'title', 'introText', 'addressStreet', 'addressPostalCode', 'addressCity', 
    'addressNote', 'email', 'phone', 'formTitle', 'buttonText'
  ];
  if (!validateStringFields<ContactData>(data.contact, contactFields)) {
    return false;
  }

  return true;
}
