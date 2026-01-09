import React, { useState, useEffect } from 'react';
import { Settings, X, LogOut, Save, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';
import { TabButton } from './admin/inputs/TabButton';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { AdminAuth } from './admin/AdminAuth';
import { HeroEditor } from './admin/editors/HeroEditor';
import { SolutionsEditor } from './admin/editors/SolutionsEditor';
import { AboutEditor } from './admin/editors/AboutEditor';
import { PartnersEditor } from './admin/editors/PartnersEditor';
import { ContactEditor } from './admin/editors/ContactEditor';
import { isApiAvailable } from '../utils/apiConfig';

const AdminPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'solutions' | 'about' | 'partners' | 'contact'>('hero');
  const { content, saveStatus, updateHero, updateSolution, addSolution, removeSolution, selectIconFromText, updateAbout, updatePartners, updateContact, forceSave } = useContent();
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  
  // Use authentication hook
  const auth = useAdminAuth();

  const handleLogout = () => {
    auth.handleLogout();
    setIsOpen(false);
  };

  const handleManualSave = async () => {
    await forceSave();
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  // Format last saved time
  const formatLastSaved = (date: Date | null): string => {
    if (!date) return '';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    
    if (diffSecs < 10) return 'zojuist';
    if (diffSecs < 60) return `${diffSecs} seconden geleden`;
    if (diffMins < 60) return `${diffMins} minuten geleden`;
    return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          // Reset authentication when opening (for security, require login each time)
          auth.handleLogout();
        }}
        className="fixed bottom-6 right-6 z-50 p-4 bg-timo-accent text-black rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:bg-white transition-all duration-300 group"
        aria-label="Open Settings"
      >
        <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
      </button>

      {/* Slide-over Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-neutral-900 border-l border-white/10 shadow-2xl z-[70] flex flex-col"
            >
              {/* Login Screen */}
              {!auth.isAuthenticated ? (
                <AdminAuth {...auth} onClose={() => setIsOpen(false)} />
              ) : (
                <>
                  {/* Header */}
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-timo-dark">
                    <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-timo-accent" />
                        <h2 className="text-xl font-bold text-white">Site Editor</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                          onClick={handleLogout}
                          className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                          title="Uitloggen"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                      <button 
                          onClick={() => setIsOpen(false)}
                          className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-white/10 overflow-x-auto">
                    <TabButton id="hero" label="Hero" activeTab={activeTab} onClick={() => setActiveTab('hero')} />
                    <TabButton id="solutions" label="Oplossingen" activeTab={activeTab} onClick={() => setActiveTab('solutions')} />
                    <TabButton id="about" label="Onze Kracht" activeTab={activeTab} onClick={() => setActiveTab('about')} />
                    <TabButton id="partners" label="Partners" activeTab={activeTab} onClick={() => setActiveTab('partners')} />
                    <TabButton id="contact" label="Contact" activeTab={activeTab} onClick={() => setActiveTab('contact')} />
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Hero Editor */}
                {activeTab === 'hero' && (
                    <HeroEditor hero={content.hero} updateHero={updateHero} />
                )}

                {/* Solutions Editor */}
                {activeTab === 'solutions' && (
                  <SolutionsEditor
                    solutions={content.solutions}
                    updateSolution={updateSolution}
                    addSolution={addSolution}
                    removeSolution={removeSolution}
                    selectIconFromText={selectIconFromText}
                  />
                )}

                {/* About Editor */}
                {activeTab === 'about' && (
                  <AboutEditor about={content.about} updateAbout={updateAbout} />
                )}

                {/* Partners Editor */}
                {activeTab === 'partners' && (
                  <PartnersEditor partners={content.partners} updatePartners={updatePartners} />
                )}

                {/* Contact Editor */}
                {activeTab === 'contact' && (
                  <ContactEditor contact={content.contact} updateContact={updateContact} />
                )}
              </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-white/10 bg-timo-dark">
                    {/* Save Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {saveStatus.isSaving ? (
                          <>
                            <Loader className="w-4 h-4 text-timo-accent animate-spin" />
                            <span className="text-xs text-gray-400">Opslaan...</span>
                          </>
                        ) : saveStatus.error ? (
                          <>
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs text-yellow-500 truncate" title={saveStatus.error}>
                              {saveStatus.error}
                            </span>
                          </>
                        ) : saveStatus.lastSaved ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-gray-400">
                              Opgeslagen {formatLastSaved(saveStatus.lastSaved)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500">Wijzigingen worden automatisch opgeslagen</span>
                        )}
                      </div>
                      <button
                        onClick={handleManualSave}
                        disabled={saveStatus.isSaving}
                        className="flex items-center gap-2 px-3 py-1.5 bg-timo-accent text-black rounded text-xs font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Handmatig opslaan"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Opslaan
                      </button>
                    </div>
                    
                    {/* Storage Info */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        {isApiAvailable() 
                          ? 'Wijzigingen worden opgeslagen op de server'
                          : 'Wijzigingen worden opgeslagen in de browser (lokaal)'}
                      </p>
                      {showSaveMessage && !saveStatus.isSaving && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-timo-accent mt-1"
                        >
                          {saveStatus.error ? 'Opslaan mislukt - zie bovenstaande melding' : 'Opgeslagen!'}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};


export default AdminPanel;
