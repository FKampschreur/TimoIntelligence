/**
 * Centralized icon mapping utility
 * Replaces duplicated icon mapping functions in Solutions.tsx and Ecosystem.tsx
 */

import React from 'react';
import {
  Truck, FileText, BarChart3, Users, Image as ImageIcon,
  Zap, Shield, Globe, Cpu, Building, Package, Code, Settings, Database, Cloud,
  Lock, Bell, Mail, Calendar, Wallet, ShoppingCart, TrendingUp, Target, Puzzle
} from 'lucide-react';
import { IconName } from '../context/ContentContext';

// Icon component map
const ICON_COMPONENT_MAP: Record<IconName, React.ComponentType<any>> = {
  Truck,
  FileText,
  BarChart3,
  Users,
  ImageIcon,
  Zap,
  Shield,
  Globe,
  Cpu,
  Building,
  Package,
  Code,
  Settings,
  Database,
  Cloud,
  Lock,
  Bell,
  Mail,
  Calendar,
  Wallet,
  ShoppingCart,
  TrendingUp,
  Target,
  Puzzle,
};

/**
 * Get icon component by name
 * @param iconName - The icon name
 * @param className - Optional className (e.g., "w-6 h-6")
 * @param size - Optional size prop (alternative to className)
 * @returns React component for the icon
 */
export const getIconComponent = (
  iconName: IconName | string,
  className?: string,
  size?: number
): React.ReactNode => {
  const Icon = ICON_COMPONENT_MAP[iconName as IconName] || Cpu;
  
  if (className) {
    return <Icon className={className} />;
  }
  
  if (size !== undefined) {
    return <Icon size={size} />;
  }
  
  // Default size
  return <Icon className="w-6 h-6" />;
};

/**
 * Get icon component with props object (for more flexibility)
 */
export const getIconComponentWithProps = (
  iconName: IconName | string,
  props?: { className?: string; size?: number; [key: string]: any }
): React.ReactNode => {
  const Icon = ICON_COMPONENT_MAP[iconName as IconName] || Cpu;
  return <Icon {...props} />;
};

/**
 * Icon keyword mapping for intelligent icon selection
 * Extracted from ContentContext to improve organization
 */
export const ICON_KEYWORDS: { [key in IconName]: string[] } = {
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

/**
 * Intelligently select an icon based on text content
 * Uses keyword matching to score and select the best icon
 * Extracted from ContentContext.tsx
 */
export function selectIconFromText(title: string, description: string): IconName {
  const text = `${title} ${description}`.toLowerCase();
  
  // Score each icon based on keyword matches
  const scores: { [key in IconName]?: number } = {};
  
  for (const [icon, keywords] of Object.entries(ICON_KEYWORDS)) {
    scores[icon as IconName] = keywords.reduce((score, keyword) => {
      return score + (text.includes(keyword) ? 1 : 0);
    }, 0);
  }

  // Find the icon with the highest score
  const bestMatch = Object.entries(scores).reduce((best, [icon, score]) => {
    return (score || 0) > (best.score || 0) 
      ? { icon: icon as IconName, score: score || 0 } 
      : best;
  }, { icon: 'Cpu' as IconName, score: 0 });

  // If no match found, default to Cpu (technology icon)
  return bestMatch.score > 0 ? bestMatch.icon : 'Cpu';
}

/**
 * All available icon options for select dropdowns
 */
export const getAllIconOptions = (): Array<{ value: IconName; label: string; emoji: string }> => [
  { value: 'Truck', label: 'Truck (Transport/Vloot)', emoji: '🚚' },
  { value: 'FileText', label: 'FileText (Documenten/Aanbesteding)', emoji: '📄' },
  { value: 'BarChart3', label: 'BarChart3 (Analytics/Data)', emoji: '📊' },
  { value: 'Users', label: 'Users (Medewerkers/Team)', emoji: '👥' },
  { value: 'ImageIcon', label: 'ImageIcon (Beeld/Foto)', emoji: '🖼️' },
  { value: 'Zap', label: 'Zap (Energie/Snel)', emoji: '⚡' },
  { value: 'Shield', label: 'Shield (Veiligheid/Compliance)', emoji: '🛡️' },
  { value: 'Globe', label: 'Globe (Web/Online)', emoji: '🌐' },
  { value: 'Cpu', label: 'Cpu (Technologie/Software)', emoji: '💻' },
  { value: 'Building', label: 'Building (Vastgoed)', emoji: '🏢' },
  { value: 'Package', label: 'Package (Logistiek/Voorraad)', emoji: '📦' },
  { value: 'Code', label: 'Code (Development/API)', emoji: '💻' },
  { value: 'Settings', label: 'Settings (Configuratie/Beheer)', emoji: '⚙️' },
  { value: 'Database', label: 'Database (Data/Opslag)', emoji: '🗄️' },
  { value: 'Cloud', label: 'Cloud (Cloud/SaaS)', emoji: '☁️' },
  { value: 'Lock', label: 'Lock (Beveiliging/Privacy)', emoji: '🔒' },
  { value: 'Bell', label: 'Bell (Notificaties/Alerts)', emoji: '🔔' },
  { value: 'Mail', label: 'Mail (Email/Communicatie)', emoji: '✉️' },
  { value: 'Calendar', label: 'Calendar (Agenda/Planning)', emoji: '📅' },
  { value: 'Wallet', label: 'Wallet (Financieel/Betaling)', emoji: '💳' },
  { value: 'ShoppingCart', label: 'ShoppingCart (E-commerce/Verkoop)', emoji: '🛒' },
  { value: 'TrendingUp', label: 'TrendingUp (Groei/Performance)', emoji: '📈' },
  { value: 'Target', label: 'Target (Doel/Strategie)', emoji: '🎯' },
  { value: 'Puzzle', label: 'Puzzle (Integratie/Ecosysteem)', emoji: '🧩' },
];
