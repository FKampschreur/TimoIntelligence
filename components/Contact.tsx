import React, { useState } from 'react';
import { MapPin, Mail, Phone, Send } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { sanitizeInput, validateEmail, validateLength, RateLimiter } from '../utils/security';
import { VALIDATION_CONSTANTS } from '../utils/constants';
import { sendContactForm } from '../utils/apiService';
import { isApiAvailable } from '../utils/apiConfig';

const Contact: React.FC = () => {
  const { content } = useContent();
  const { contact } = content;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  
  // #region agent log
  fetch('http://127.0.0.1:7245/ingest/73ac9368-5f22-431a-97d8-807ae4abf6aa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Contact.tsx:5',message:'Contact component rendering',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Rate limiting check
    const rateLimitKey = 'contact-form-submission';
    if (!RateLimiter.isAllowed(
      rateLimitKey,
      VALIDATION_CONSTANTS.CONTACT_FORM.MAX_ATTEMPTS,
      VALIDATION_CONSTANTS.CONTACT_FORM.RATE_LIMIT_WINDOW_MS
    )) {
      const remainingTime = Math.ceil(RateLimiter.getResetTime(rateLimitKey) / 1000);
      setRateLimitError(`Te veel pogingen. Probeer over ${remainingTime} seconden opnieuw.`);
      return;
    }
    
    setRateLimitError(null);
    setIsSubmitting(true);
    
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/73ac9368-5f22-431a-97d8-807ae4abf6aa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Contact.tsx:9',message:'Form submitted',data:{hasHandler:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    // Sanitize and validate form data
    const { CONTACT_FORM: FORM } = VALIDATION_CONSTANTS;
    const firstName = sanitizeInput((data.firstName as string)?.trim() || '', FORM.NAME_MAX_LENGTH);
    const lastName = sanitizeInput((data.lastName as string)?.trim() || '', FORM.NAME_MAX_LENGTH);
    const email = (data.email as string)?.trim() || '';
    const message = sanitizeInput((data.message as string)?.trim() || '', FORM.MESSAGE_MAX_LENGTH);
    
    // Validation checks
    if (!validateLength(firstName, 1, FORM.NAME_MAX_LENGTH)) {
      alert(`Voornaam is verplicht en mag maximaal ${FORM.NAME_MAX_LENGTH} tekens bevatten.`);
      setIsSubmitting(false);
      return;
    }
    
    if (!validateLength(lastName, 1, FORM.NAME_MAX_LENGTH)) {
      alert(`Achternaam is verplicht en mag maximaal ${FORM.NAME_MAX_LENGTH} tekens bevatten.`);
      setIsSubmitting(false);
      return;
    }
    
    if (!email) {
      alert('Emailadres is verplicht.');
      setIsSubmitting(false);
      return;
    }
    
    if (!validateEmail(email)) {
      alert('Voer een geldig emailadres in.');
      setIsSubmitting(false);
      return;
    }
    
    if (!validateLength(message, FORM.MESSAGE_MIN_LENGTH, FORM.MESSAGE_MAX_LENGTH)) {
      alert(`Bericht moet tussen ${FORM.MESSAGE_MIN_LENGTH} en ${FORM.MESSAGE_MAX_LENGTH} tekens bevatten.`);
      setIsSubmitting(false);
      return;
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7245/ingest/73ac9368-5f22-431a-97d8-807ae4abf6aa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Contact.tsx:13',message:'Form data collected',data:{fields:Object.keys(data)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    try {
      // SECURITY: Do not log sensitive user data (PII) in production
      // Only log in development mode
      if (import.meta.env.DEV) {
        console.log('Form submitted (dev only):', { firstName: firstName.substring(0, 1) + '***', lastName: lastName.substring(0, 1) + '***', email: email.substring(0, 3) + '***' });
      }
      
      // Probeer eerst via API te versturen (als beschikbaar)
      if (isApiAvailable()) {
        const response = await sendContactForm({
          firstName,
          lastName,
          email,
          message
        });
        
        if (response.success) {
          alert('Bedankt voor uw bericht! We nemen zo spoedig mogelijk contact met u op.');
          e.currentTarget.reset();
          setRateLimitError(null);
          setIsSubmitting(false);
          return;
        } else {
          // API failed, fallback to mailto
          console.warn('API send failed, falling back to mailto:', response.error);
        }
      }
      
      // Fallback: Verstuur email via mailto link
      const recipientEmail = 'f.kampschreur@hollandfoodservice.nl';
      const subject = encodeURIComponent(`Contactformulier: ${firstName} ${lastName}`);
      const body = encodeURIComponent(
        `Beste,\n\n` +
        `Er is een nieuw bericht ontvangen via het contactformulier:\n\n` +
        `Naam: ${firstName} ${lastName}\n` +
        `Email: ${email}\n\n` +
        `Bericht:\n${message}\n\n` +
        `---\n` +
        `Dit bericht is automatisch gegenereerd vanuit het contactformulier op de website.`
      );
      
      // Open email client met mailto link
      const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;
      
      // Reset form
      e.currentTarget.reset();
      setRateLimitError(null);
      
      // Toon bevestiging
      alert('Bedankt voor uw bericht! Uw email client wordt geopend om het bericht te versturen.');
    } catch (error) {
      // Log error without exposing user data
      console.error('Error submitting form:', error instanceof Error ? error.message : 'Unknown error');
      alert('Er is een fout opgetreden bij het verzenden van uw bericht. Probeer het later opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-24 bg-neutral-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Info Side */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">{contact.title}</h2>
            <p className="text-gray-400 mb-10 text-lg">
              {contact.introText}
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-timo-card rounded-lg border border-white/10">
                    <MapPin className="w-6 h-6 text-timo-accent" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Bezoekadres</h3>
                  <p className="text-gray-400">
                    {contact.addressStreet || 'Niet opgegeven'}<br />
                    {contact.addressPostalCode || ''}{contact.addressCity ? ` ${contact.addressCity}` : ''}<br />
                    {contact.addressNote && <span className="text-sm text-gray-500 italic">{contact.addressNote}</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-timo-card rounded-lg border border-white/10">
                    <Mail className="w-6 h-6 text-timo-accent" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Email</h3>
                  <p className="text-gray-400">{contact.email || 'Niet opgegeven'}</p>
                </div>
              </div>

              {contact.phone && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-timo-card rounded-lg border border-white/10">
                      <Phone className="w-6 h-6 text-timo-accent" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Telefoon</h3>
                    <p className="text-gray-400">{contact.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-timo-card border border-white/10 p-8 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6">{contact.formTitle}</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-2">Voornaam</label>
                  <input type="text" id="firstName" name="firstName" className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-timo-accent focus:ring-1 focus:ring-timo-accent transition-colors" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-2">Achternaam</label>
                  <input type="text" id="lastName" name="lastName" className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-timo-accent focus:ring-1 focus:ring-timo-accent transition-colors" />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Zakelijk Emailadres</label>
                <input type="email" id="email" name="email" className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-timo-accent focus:ring-1 focus:ring-timo-accent transition-colors" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Bericht</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={4} 
                  maxLength={VALIDATION_CONSTANTS.CONTACT_FORM.MESSAGE_MAX_LENGTH}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-timo-accent focus:ring-1 focus:ring-timo-accent transition-colors"
                  required
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  Minimaal {VALIDATION_CONSTANTS.CONTACT_FORM.MESSAGE_MIN_LENGTH}, 
                  maximaal {VALIDATION_CONSTANTS.CONTACT_FORM.MESSAGE_MAX_LENGTH} tekens
                </p>
              </div>

              {rateLimitError && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-sm text-red-400">{rateLimitError}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-timo-accent hover:bg-cyan-600'} text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2`}
              >
                {isSubmitting ? 'Verzenden...' : contact.buttonText}
                {!isSubmitting && <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;