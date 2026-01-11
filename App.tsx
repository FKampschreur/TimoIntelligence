import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import Ecosystem from './components/Ecosystem';
import Solutions from './components/Solutions';
import About from './components/About';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import ErrorBoundary from './components/ErrorBoundary';
import ChatWidgetWrapper from './components/ChatWidgetWrapper';
import { ContentProvider } from './context/ContentContext';
import { agentLog } from './utils/agentLogging';

const App: React.FC = () => {
  // #region agent log
  agentLog('App.tsx:16', 'App component rendering');
  // #endregion
  return (
    <ErrorBoundary>
      <ContentProvider>
      <div className="min-h-screen bg-timo-dark text-white selection:bg-timo-accent selection:text-black overflow-x-hidden">
        <Navbar />
        <main>
          <section id="home">
            <Hero />
          </section>
          <section id="philosophy">
            <Philosophy />
          </section>
          <section id="ecosysteem">
            <Ecosystem />
          </section>
          <section id="oplossingen">
            <Solutions />
          </section>
          <section id="over-ons">
            <About />
          </section>
          <section id="partners">
            <Partners />
          </section>
          <section id="contact">
            <Contact />
          </section>
        </main>
        <Footer />
        
        {/* The Admin Settings Panel */}
        <AdminPanel />
        
        {/* Chat Widget */}
        <ChatWidgetWrapper />
      </div>
    </ContentProvider>
    </ErrorBoundary>
  );
};

export default App;