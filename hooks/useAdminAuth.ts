/**
 * Custom hook for admin authentication
 * Extracts authentication logic from AdminPanel component
 */

import { useState, useEffect } from 'react';
import { ADMIN_CONSTANTS } from '../utils/constants';

// Simple hash function for password verification
const simpleHash = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Get credentials from environment variables
const getAdminCredentials = () => {
  const username = import.meta.env.VITE_ADMIN_USERNAME || '';
  const passwordHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH || '';
  return { username, passwordHash };
};

export interface UseAdminAuthReturn {
  isAuthenticated: boolean;
  username: string;
  password: string;
  loginError: string;
  loginAttempts: number;
  isLocked: boolean;
  lockUntil: number | null;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleLogout: () => void;
}

export const useAdminAuth = (): UseAdminAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockUntil, setLockUntil] = useState<number | null>(null);

  // Check authentication status from sessionStorage on mount
  useEffect(() => {
    const authExpiry = sessionStorage.getItem('admin-auth-expiry');
    if (authExpiry && parseInt(authExpiry) > Date.now()) {
      setIsAuthenticated(true);
    } else {
      sessionStorage.removeItem('admin-auth-expiry');
    }
  }, []);

  // Check if account is locked
  useEffect(() => {
    if (lockUntil && lockUntil > Date.now()) {
      setIsLocked(true);
      const timer = setTimeout(() => {
        setIsLocked(false);
        setLockUntil(null);
        setLoginAttempts(0);
      }, lockUntil - Date.now());
      return () => clearTimeout(timer);
    } else {
      setIsLocked(false);
    }
  }, [lockUntil]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Check if account is locked
    if (isLocked && lockUntil && lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((lockUntil - Date.now()) / 60000);
      setLoginError(`Account tijdelijk geblokkeerd. Probeer over ${minutesLeft} minuten opnieuw.`);
      return;
    }

    // Rate limiting: lock after max attempts
    if (loginAttempts >= ADMIN_CONSTANTS.MAX_LOGIN_ATTEMPTS) {
      const lockTime = Date.now() + ADMIN_CONSTANTS.LOCKOUT_DURATION_MS;
      setLockUntil(lockTime);
      setIsLocked(true);
      setLoginError('Te veel mislukte pogingen. Account geblokkeerd voor 15 minuten.');
      return;
    }

    // Normalize username to lowercase for comparison
    const normalizedUsername = username.toLowerCase().trim();
    
    // Get credentials from environment
    const { username: adminUsername, passwordHash: adminPasswordHash } = getAdminCredentials();
    
    // Validate credentials are configured
    if (!adminUsername || !adminPasswordHash) {
      console.error('Admin credentials not configured. Set VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD_HASH in .env.local');
      setLoginError('Authenticatie niet geconfigureerd. Neem contact op met de beheerder.');
      return;
    }

    // Hash the provided password and compare
    try {
      const providedPasswordHash = await simpleHash(password);
      
      if (normalizedUsername === adminUsername.toLowerCase() && providedPasswordHash === adminPasswordHash) {
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
        setLoginAttempts(0);
        // Set session expiry
        const expiryTime = Date.now() + ADMIN_CONSTANTS.SESSION_DURATION_MS;
        sessionStorage.setItem('admin-auth-expiry', expiryTime.toString());
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        const remainingAttempts = ADMIN_CONSTANTS.MAX_LOGIN_ATTEMPTS - newAttempts;
        if (remainingAttempts > 0) {
          setLoginError(`Ongeldige gebruikersnaam of wachtwoord. ${remainingAttempts} pogingen over.`);
        } else {
          setLoginError('Ongeldige gebruikersnaam of wachtwoord.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Er is een fout opgetreden bij het inloggen. Probeer het opnieuw.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setLoginError('');
    setLoginAttempts(0);
    setIsLocked(false);
    setLockUntil(null);
    sessionStorage.removeItem('admin-auth-expiry');
  };

  return {
    isAuthenticated,
    username,
    password,
    loginError,
    loginAttempts,
    isLocked,
    lockUntil,
    setUsername,
    setPassword,
    handleLogin,
    handleLogout,
  };
};
