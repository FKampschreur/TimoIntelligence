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
import { ContentProvider } from './context/ContentContext';

const App: React.FC = () => {
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/73ac9368-5f22-431a-97d8-807ae4abf6aa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:16',message:'App component rendering',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
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
      </div>
    </ContentProvider>
    </ErrorBoundary>
  );
};

export default App;