import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mail } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

interface ChatWidgetProps {
  apiUrl?: string;
}

// Get API URL from environment or use default
const getChatApiUrl = (): string => {
  // Check for environment variable first (heeft altijd voorrang)
  if (import.meta.env.VITE_CHAT_API_URL) {
    console.log('🔗 Using VITE_CHAT_API_URL:', import.meta.env.VITE_CHAT_API_URL);
    return import.meta.env.VITE_CHAT_API_URL;
  }
  
  // Detect production environment
  const isProduction = typeof window !== 'undefined' && 
                      window.location.hostname !== 'localhost' && 
                      !window.location.hostname.includes('127.0.0.1') &&
                      window.location.protocol === 'https:';
  
  if (isProduction) {
    // Production: gebruik een specifieke productie API URL als ingesteld
    if (import.meta.env.VITE_PRODUCTION_API_URL) {
      console.log('🔗 Using VITE_PRODUCTION_API_URL:', import.meta.env.VITE_PRODUCTION_API_URL);
      return import.meta.env.VITE_PRODUCTION_API_URL;
    }
    
    // Als VITE_CHAT_API_URL niet is ingesteld, gebruik reverse proxy setup
    // Dit werkt als je een nginx reverse proxy hebt die /api/chat naar backend proxyt
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    
    // Gebruik relatief pad of volledige URL op basis van setup
    // Als er een poort is (bijv. :3000), gebruik die
    // Anders gebruik reverse proxy op dezelfde hostname
    const apiUrl = port 
      ? `${protocol}//${hostname}:${port}/api/chat`  // Met poort
      : `${protocol}//${hostname}/api/chat`;          // Reverse proxy (geen poort)
    
    console.log('🔗 Using reverse proxy API URL:', apiUrl);
    console.log('ℹ️  Zorg dat je backend server draait en nginx correct is geconfigureerd.');
    return apiUrl;
  }
  
  // Development: fallback to localhost
  const devUrl = 'http://localhost:3001/api/chat';
  console.log('🔗 Using development API URL:', devUrl);
  return devUrl;
};

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  apiUrl 
}) => {
  // Use provided apiUrl, or get from environment, or use default
  const chatApiUrl = apiUrl || getChatApiUrl();
  
  // Log the API URL being used (only once on mount)
  useEffect(() => {
    console.log('💬 ChatWidget initialized with API URL:', chatApiUrl);
    console.log('🌐 Current location:', {
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A',
      protocol: typeof window !== 'undefined' ? window.location.protocol : 'N/A',
      href: typeof window !== 'undefined' ? window.location.href : 'N/A'
    });
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: chatApiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
    }),
    onError: (error) => {
      console.error('Chat error:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        cause: error.cause,
        ...error
      });
      console.error('🔗 API URL being used:', chatApiUrl);
      console.error('🌐 Current location:', typeof window !== 'undefined' ? window.location.href : 'N/A');
      
      // Show user-friendly error message
      const errorMessage = error.message || String(error);
      
      // Check for Vercel/404 errors
      if (errorMessage.includes('NOT_FOUND') || errorMessage.includes('404') || errorMessage.includes('page could not be found')) {
        console.error('❌ Backend server niet gevonden (404).');
        console.error('   Dit betekent dat de backend server niet bereikbaar is op:', chatApiUrl);
        console.error('   Oplossing voor productie:');
        console.error('   1. Deploy de backend server (server/index.js) naar een hosting platform');
        console.error('   2. Stel VITE_CHAT_API_URL in als environment variable in Vercel');
        console.error('   3. Rebuild de frontend met: npm run build');
        console.error('   Zie PRODUCTION_DEPLOYMENT.md voor instructies');
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('ERR_CONNECTION_REFUSED')) {
        const isProduction = typeof window !== 'undefined' && 
                            window.location.hostname !== 'localhost' && 
                            !window.location.hostname.includes('127.0.0.1');
        if (isProduction) {
          console.error('❌ Kan niet verbinden met chat server in productie.');
          console.error('   Controleer:');
          console.error('   1. Draait de backend server op de productie URL?');
          console.error('   2. Is VITE_CHAT_API_URL correct ingesteld in Vercel?');
          console.error('   3. Is de backend server publiek bereikbaar?');
        } else {
          console.error('❌ Kan niet verbinden met chat server.');
          console.error('   Oplossing: Start de backend server met: npm run server');
          console.error('   Of start beide servers met: npm run dev:all');
        }
      } else if (errorMessage.includes('API key') || errorMessage.includes('500')) {
        console.error('❌ API key probleem of server error.');
        console.error('   Controleer:');
        console.error('   1. Is GEMINI_API_KEY ingesteld op de backend server?');
        console.error('   2. Draait de backend server? (check terminal/logs)');
        console.error('   3. Run: npm run test:chat om te testen');
      } else {
        console.error('❌ Onbekende chat error.');
        console.error('   Controleer de browser console en server logs voor meer details.');
        console.error('   API URL:', chatApiUrl);
      }
    },
  });

  // Check if loading (submitted or streaming)
  const isLoading = status === 'submitted' || status === 'streaming';

  // Helper function to get text content from message parts
  const getMessageText = (message: typeof messages[0]): string => {
    if ('parts' in message && Array.isArray(message.parts)) {
      return message.parts
        .filter((part: any) => part.type === 'text')
        .map((part: any) => part.text)
        .join('');
    }
    // Fallback for older format or direct text
    if ('text' in message) {
      return message.text as string;
    }
    if ('content' in message) {
      return message.content as string;
    }
    return '';
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // AI SDK v3 - sendMessage accepts text directly
    sendMessage({ text: input });
    setInput(''); // Clear input after sending
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Scroll naar beneden bij nieuwe berichten
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Detecteer [ACTION_EMAIL] in berichten en genereer mailto link
  const getEmailAction = (messageContent: string) => {
    if (!messageContent || typeof messageContent !== 'string') {
      return null;
    }
    if (messageContent.includes('[ACTION_EMAIL]')) {
      // Verwijder het codewoord voor display
      const cleanContent = messageContent.replace(/\[ACTION_EMAIL\]/g, '').trim();
      
      // Genereer email body met gesprekscontext
      const conversationContext = messages
        .map(msg => {
          const msgText = getMessageText(msg);
          return `${msg.role === 'user' ? 'Gebruiker' : 'Assistent'}: ${msgText.replace(/\[ACTION_EMAIL\]/g, '')}`;
        })
        .join('\n\n');
      
      const emailBody = encodeURIComponent(
        `Beste Timo Intelligence team,\n\n` +
        `Ik heb interesse in Timo Intelligence. Hieronder staat het gesprek dat ik met Timo heb gevoerd:\n\n` +
        `${conversationContext}\n\n` +
        `Graag zou ik meer informatie willen ontvangen.\n\n` +
        `Met vriendelijke groet`
      );
      
      const emailSubject = encodeURIComponent('Aanvraag via Timo Intelligence Website');
      const mailtoLink = `mailto:info@timointelligence.nl?subject=${emailSubject}&body=${emailBody}`;
      
      return { cleanContent, mailtoLink };
    }
    return null;
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-timo-accent hover:bg-cyan-600 text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatContainerRef}
          className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md h-[600px] bg-timo-card border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-timo-dark border-b border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-timo-accent/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-timo-accent" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Timo</h3>
                <p className="text-xs text-gray-400">Timo Intelligence - Ik help je graag verder</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !error && (
              <div className="text-center text-gray-400 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-timo-accent/50" />
                <p className="text-sm">Hallo! Ik ben Timo, het intelligente digitale brein van Timo Intelligence.</p>
                <p className="text-xs mt-2 text-gray-500">Hoe kan ik je helpen vandaag?</p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 m-4">
                <p className="text-red-400 text-sm font-semibold mb-2">⚠️ Chat Fout</p>
                <p className="text-red-300 text-xs">
                  {error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')
                    ? 'Kan niet verbinden met chat server. Zorg dat de backend server draait (npm run server)'
                    : error.message?.includes('API key')
                    ? 'API key probleem. Controleer GEMINI_API_KEY in .env.local'
                    : 'Er is een fout opgetreden. Probeer het opnieuw.'}
                </p>
              </div>
            )}

            {messages.map((message) => {
              const messageText = getMessageText(message);
              const emailAction = getEmailAction(messageText);
              const displayContent = emailAction 
                ? emailAction.cleanContent 
                : messageText;

              return (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-timo-accent text-black'
                        : 'bg-white/5 text-white border border-white/10'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{displayContent}</p>
                    
                    {/* Email Action Button */}
                    {emailAction && (
                      <a
                        href={emailAction.mailtoLink}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-timo-accent hover:bg-cyan-600 text-black font-semibold rounded-lg transition-colors text-sm shadow-lg"
                      >
                        <Mail className="w-4 h-4" />
                        Stuur uw aanvraag direct naar ons
                      </a>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 text-white border border-white/10 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-timo-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-timo-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-timo-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 p-4 bg-timo-dark"
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Typ je bericht..."
                disabled={isLoading}
                className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-timo-accent focus:ring-1 focus:ring-timo-accent transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 bg-timo-accent hover:bg-cyan-600 text-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
