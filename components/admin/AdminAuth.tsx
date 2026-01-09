/**
 * Admin Authentication Component
 * Extracted from AdminPanel for better separation of concerns
 */

import React, { useEffect } from 'react';
import { X, Lock } from 'lucide-react';
import { UseAdminAuthReturn } from '../../hooks/useAdminAuth';
import { ADMIN_CONSTANTS } from '../../utils/constants';

interface AdminAuthProps extends UseAdminAuthReturn {
  onClose: () => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({
  username,
  password,
  loginError,
  loginAttempts,
  isLocked,
  lockUntil,
  setUsername,
  setPassword,
  handleLogin,
  onClose,
}) => {
  // Reset velden wanneer het formulier wordt geopend
  useEffect(() => {
    setUsername('');
    setPassword('');
  }, [setUsername, setPassword]);

  return (
    <>
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-timo-dark">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-timo-accent" />
          <h2 className="text-xl font-bold text-white">Inloggen</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Gebruikersnaam
            </label>
            <input
              id="username"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Gebruikersnaam"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-timo-accent focus:outline-none focus:ring-1 focus:ring-timo-accent transition-colors"
              required
              autoFocus
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-timo-accent focus:outline-none focus:ring-1 focus:ring-timo-accent transition-colors"
              required
            />
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-400">{loginError}</p>
              {loginAttempts > 0 && loginAttempts < ADMIN_CONSTANTS.MAX_LOGIN_ATTEMPTS && (
                <p className="text-xs text-red-300 mt-1">
                  Mislukte pogingen: {loginAttempts}/{ADMIN_CONSTANTS.MAX_LOGIN_ATTEMPTS}
                </p>
              )}
            </div>
          )}
          
          {isLocked && lockUntil && (
            <div className="p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
              <p className="text-sm text-yellow-400">
                Account geblokkeerd. Probeer over {Math.ceil((lockUntil - Date.now()) / 60000)} minuten opnieuw.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-timo-accent hover:bg-cyan-600 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Inloggen
          </button>
        </form>
      </div>
    </>
  );
};
