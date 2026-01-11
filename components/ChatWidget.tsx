import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mail } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

interface ChatWidgetProps {
  apiUrl?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  apiUrl = 'http://localhost:3001/api/chat' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, isLoading, error } = useChat({
    transport: new DefaultChatTransport({
      api: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
    onError: (error) => {
      console.error('Chat error:', error);
      // Show user-friendly error message
      const errorMessage = error.message || String(error);
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('ERR_CONNECTION_REFUSED')) {
        console.error('❌ Kan niet verbinden met chat server.');
        console.error('   Oplossing: Start de backend server met: npm run server');
        console.error('   Of start beide servers met: npm run dev:all');
      } else if (errorMessage.includes('API key') || errorMessage.includes('500')) {
        console.error('❌ API key probleem of server error.');
        console.error('   Controleer:');
        console.error('   1. Is GOOGLE_API_KEY ingesteld in .env.local?');
        console.error('   2. Draait de backend server? (check terminal)');
        console.error('   3. Run: npm run test:chat om te testen');
      }
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage({ content: input });
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
                .map(msg => `${msg.role === 'user' ? 'Gebruiker' : 'Assistent'}: ${msg.content.replace(/\[ACTION_EMAIL\]/g, '')}`)
                .join('\n\n');
      
      const emailBody = encodeURIComponent(
        `Beste Holland Food Service team,\n\n` +
        `Ik heb interesse in Timo. Hieronder staat het gesprek dat ik met Timo heb gevoerd:\n\n` +
        `${conversationContext}\n\n` +
        `Graag zou ik meer informatie willen ontvangen.\n\n` +
        `Met vriendelijke groet`
      );
      
      const emailSubject = encodeURIComponent('Aanvraag via Timo Chatbot');
      const mailtoLink = `mailto:info@hollandfoodservice.nl?subject=${emailSubject}&body=${emailBody}`;
      
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
                <p className="text-xs text-gray-400">Holland Food Service - Ik help je graag verder</p>
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
                <p className="text-sm">Hallo! Ik ben Timo, het digitale brein van Holland Food Service.</p>
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
                    ? 'API key probleem. Controleer GOOGLE_API_KEY in .env.local'
                    : 'Er is een fout opgetreden. Probeer het opnieuw.'}
                </p>
              </div>
            )}

            {messages.map((message) => {
              const emailAction = getEmailAction(message.content);
              const displayContent = emailAction 
                ? emailAction.cleanContent 
                : message.content;

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
