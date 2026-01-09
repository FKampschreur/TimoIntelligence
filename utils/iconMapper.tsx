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
