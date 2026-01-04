import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Clock, ChevronDown, CheckCircle, Send, Menu, X, Sparkles, Star, Moon, Wine, Navigation, CalendarPlus, Car, Users, Utensils, Home, Heart, List } from 'lucide-react';

// --- CONFIGURATION ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // --- CHATBOT ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: "Shalom ! Je suis votre assistant pour ce mariage. Besoin d'infos sur le programme ou le lieu ?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // --- RSVP IA ---
  const [guestMessage, setGuestMessage] = useState('');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  // --- TIMER ---
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Date du mariage (simulation +60 jours)
    const weddingDate = new Date();
    weddingDate.setDate(weddingDate.getDate() + 60);
    
    const timer = setInterval(() => {
      const now = new Date();
      const diff = weddingDate.getTime() - now.getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatOpen]);

  // FONCTION ENVOI CHAT
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setIsChatLoading(true);

    // Réponses simples basées sur des mots-clés
    setTimeout(() => {
      const lowerMessage = userMessage.toLowerCase();
      let response = "Pour toute question, n'hésitez pas à nous contacter directement.";
      
      if (lowerMessage.includes('lieu') || lowerMessage.includes('adresse') || lowerMessage.includes('où')) {
        response = "Le mariage aura lieu au Pavillon des Princes à Paris. Vous pouvez utiliser Waze pour vous y rendre.";
      } else if (lowerMessage.includes('date') || lowerMessage.includes('quand') || lowerMessage.includes('heure')) {
        response = "Le mariage est prévu le 24 Août 2025. La cérémonie (Houppa) commence à 17h30.";
      } else if (lowerMessage.includes('cacher') || lowerMessage.includes('nourriture') || lowerMessage.includes('repas')) {
        response = "Le repas sera Glatt Cacher. Tous les détails seront communiqués sur place.";
      } else if (lowerMessage.includes('programme') || lowerMessage.includes('déroulé')) {
        response = "La cérémonie (Houppa) débute à 17h30, suivie du repas et de la fête. Le programme détaillé sera affiché sur place.";
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', text: response }]);
      setIsChatLoading(false);
    }, 500);
  };

  // FONCTION GENERATION VOEUX
  const generateWishes = async () => {
    setIsGeneratingMessage(true);
    const messages = [
      "Mazel Tov ! Que votre union soit bénie de bonheur et de joie éternels.",
      "Mazel Tov ! Puissiez-vous construire ensemble un foyer rempli d'amour et de paix.",
      "Mazel Tov ! Que votre mariage soit source de bénédictions infinies.",
      "Mazel Tov ! Que votre vie commune soit unie et harmonieuse."
    ];
    const text = messages[Math.floor(Math.random() * messages.length)];
    
    setTimeout(() => {
      let i = 0;
      setGuestMessage('');
      const interval = setInterval(() => {
        setGuestMessage(text.substring(0, i + 1));
        i++;
        if (i === text.length) {
          clearInterval(interval);
          setIsGeneratingMessage(false);
        }
      }, 30);
    }, 300);
  };

  const googleCalendarLink = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mariage+Sarah+%26+David";
  const wazeLink = "https://waze.com/ul?q=Pavillon+des+Princes+Paris";

  return (
    <div className="min-h-screen bg-transparent text-stone-900 font-sans selection:bg-[#C5A059]/30 selection:text-stone-900 pb-20 md:pb-0">
      
      {/* B"H Fixe */}
      <div className="fixed top-4 right-4 md:right-6 z-[60] text-[#C5A059]/40 text-xs font-serif select-none">B"H</div>

      {/* Menu Desktop */}
      <nav className={`hidden md:block fixed w-full z-50 transition-all duration-700 ${scrolled ? 'bg-white/85 backdrop-blur-md py-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)]' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl tracking-[0.2em] font-serif text-[#C5A059] border-y border-[#C5A059] py-1 cursor-default">S & D</div>
          <div className="flex space-x-12">
             {['Familles', 'Cérémonie', 'Lieu', 'RSVP'].map((item) => (
               <a
                 key={item}
                 href={`#${item.toLowerCase().replace(' ', '')}`}
                 className={`text-xs uppercase tracking-[0.25em] transition-colors relative group hover:text-[#C5A059] ${scrolled ? 'text-stone-700' : 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]'}`}
               >
                 {item}
               </a>
             ))}
          </div>
        </div>
      </nav>

      {/* Menu Mobile Top */}
      <nav className={`md:hidden fixed w-full z-40 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md py-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)]' : 'bg-transparent py-4'}`}>
         <div className="text-center">
            <span className="text-lg tracking-[0.2em] font-serif text-[#C5A059] border-y border-[#C5A059] py-1 inline-block">S & D</span>
         </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="relative h-screen overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0 bg-fixed bg-center bg-cover hero-bg" style={{ backgroundImage: 'url("/images/hero.jpg")', filter: 'brightness(0.92) contrast(1.05) saturate(1.05)' }} />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/35 via-white/10 to-white/45" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6 mt-10">
          <div className="bg-white/82 backdrop-blur-md border border-[#C5A059]/25 shadow-[0_28px_90px_rgba(0,0,0,0.18)] px-6 md:px-10 py-10 md:py-12">
            <div className="flex items-center justify-between mb-6">
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.42em] text-stone-600 font-medium">Invitation</div>
              <div className="text-[10px] md:text-[11px] uppercase tracking-[0.42em] text-stone-600 font-medium">Save the date</div>
            </div>

            <div className="h-px w-full bg-[#C5A059]/25 mb-8" />

            <div className="text-center">
              <p className="text-stone-700 italic text-sm md:text-base mb-4">Kol Sasson V'Kol Simcha</p>
              <h1 className="font-elegant text-5xl md:text-8xl text-stone-950 leading-[0.95] tracking-[-0.02em]">
                SARAH <span className="align-middle text-[#C5A059] font-serif italic text-2xl md:text-4xl">&</span> DAVID
              </h1>
              <div className="flex items-center justify-center gap-4 mt-7 mb-6">
                <div className="h-px w-16 md:w-24 bg-[#C5A059]/35" />
                <div className="h-[6px] w-[6px] rotate-45 bg-[#C5A059]/55" />
                <div className="h-px w-16 md:w-24 bg-[#C5A059]/35" />
              </div>
              <p className="text-[11px] md:text-xs uppercase tracking-[0.5em] text-stone-700">Dimanche 24 Août 2025</p>
              <p className="text-[10px] md:text-xs uppercase tracking-[0.42em] mt-3 text-[#B8862B]">Pavillon des Princes • Paris</p>
            </div>

            <div className="h-px w-full bg-[#C5A059]/25 mt-9" />
          </div>
        </div>
        <div className="absolute bottom-24 md:bottom-12 text-[#C5A059] animate-bounce cursor-pointer">
          <ChevronDown size={24} strokeWidth={1} />
        </div>
      </header>

      {/* FAMILLES - 2 COLONNES FORCEES SUR MOBILE */}
      <section id="familles" className="py-16 md:py-24 bg-white/60 px-2 md:px-4 text-center border-b border-[#C5A059]/15 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          {/* grid-cols-2 force l'affichage côte à côte même sur petit écran */}
          <div className="grid grid-cols-2 gap-2 md:gap-12 mb-10 md:mb-16 items-start">
            
            {/* Côté Mariée */}
            <div className="space-y-1.5 text-center font-serif text-stone-800 leading-relaxed tracking-wide text-[11px] md:text-base">
               <p className="font-medium text-[#C5A059] uppercase tracking-widest text-[9px] md:text-xs mb-2 md:mb-4">Famille Mariée</p>
               <p>M. et Mme <span className="whitespace-nowrap">Samuel <span className="text-[#C5A059]">COHEN</span></span></p>
               <p><span className="whitespace-nowrap">Mme Rachel <span className="text-[#C5A059]">LEVY</span></span></p>
               <div className="h-0.5 md:h-1"></div>
               <p>M. et Mme <span className="whitespace-nowrap">Isaac <span className="text-[#C5A059]">COHEN</span></span></p>
            </div>

            {/* Côté Marié */}
            <div className="space-y-1.5 text-center font-serif text-stone-800 leading-relaxed tracking-wide text-[11px] md:text-base">
               <p className="font-medium text-[#C5A059] uppercase tracking-widest text-[9px] md:text-xs mb-2 md:mb-4">Famille Marié</p>
               <p><span className="whitespace-nowrap">M. David <span className="text-[#C5A059]">BENICHOU</span></span> <span className="text-[9px] opacity-50">z"l</span></p>
               <p><span className="whitespace-nowrap">Mme Sarah <span className="text-[#C5A059]">BENICHOU</span></span></p>
               <div className="h-0.5 md:h-1"></div>
               <p>M. et Mme <span className="whitespace-nowrap">Jacob <span className="text-[#C5A059]">ABECASSIS</span></span></p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 px-4">
            <p className="font-serif italic text-base md:text-2xl text-stone-700">
              Ont la joie de vous faire part du mariage de leurs petits-enfants et enfants
            </p>
            <div className="py-2 md:py-6">
              <h2 className="font-elegant text-2xl md:text-5xl text-[#C5A059] tracking-tight whitespace-nowrap">
                SARAH <span className="text-lg md:text-2xl italic text-stone-700 font-serif">&</span> DAVID
              </h2>
            </div>
            <p className="font-serif italic text-base md:text-2xl text-stone-700">
              Et vous prient de bien vouloir assister à la Houppa qui sera célébrée
            </p>
            <div className="border-y border-[#C5A059]/30 py-3 md:py-4 mt-4 md:mt-6 inline-block px-6 md:px-12">
               <p className="uppercase tracking-[0.2em] text-[10px] md:text-sm text-stone-900 font-semibold">Dimanche 24 Août 2025</p>
               <p className="font-serif italic text-stone-600 mt-1 md:mt-2 text-xs md:text-sm">29 Av 5785 &bull; À 17 heures 30 précises</p>
            </div>
          </div>
        </div>
      </section>

      {/* VERSET & COMPTE A REBOURS */}
      <section id="ceremonie" className="py-16 md:py-24 bg-white/50 px-4 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[60vh]">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: 'url("/images/ceremony.jpg")', opacity: 0.12 }} />
        <div className="max-w-4xl mx-auto relative z-10 w-full">
          <Star className="w-5 h-5 text-[#C5A059] mx-auto mb-8 animate-pulse" />
          <h2 className="font-serif text-4xl md:text-7xl leading-tight text-[#C5A059] mb-4 drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]">אֲנִי לְדוֹדִי וְדוֹדִי לִי</h2>
          <p className="text-stone-600 font-light tracking-[0.2em] uppercase text-xs mb-12">Je suis à mon bien-aimé, et mon bien-aimé est à moi</p>
          <div className="grid grid-cols-4 gap-3 md:gap-12 max-w-2xl mx-auto px-2">
            {[{ l: 'Jours', v: timeLeft.days }, { l: 'Heures', v: timeLeft.hours }, { l: 'Min', v: timeLeft.minutes }, { l: 'Sec', v: timeLeft.seconds }].map((t, i) => (
              <div key={i} className="text-center bg-white/70 border border-[#C5A059]/20 p-2 md:p-4 backdrop-blur-sm rounded-sm">
                <span className="block text-xl md:text-5xl font-serif text-[#C5A059] tabular-nums">{t.v}</span>
                <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-stone-500 mt-1 block">{t.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIEU & WAZE */}
      <section id="lieu" className="py-16 md:py-24 bg-white/60 px-4 relative overflow-hidden">
         <div className="max-w-4xl mx-auto bg-white/85 backdrop-blur-sm border border-[#C5A059]/20 p-6 md:p-12 relative z-10 overflow-hidden rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.10)]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 text-center md:text-left">
               <div className="space-y-4">
                  <h3 className="text-[#C5A059] uppercase tracking-[0.2em] text-xs flex items-center justify-center md:justify-start gap-2">
                    <MapPin size={14} /> Le Lieu d'Exception
                  </h3>
                  <h2 className="text-3xl font-serif text-stone-900">Pavillon des Princes</h2>
                  <p className="text-stone-600 font-light leading-relaxed max-w-md text-sm">
                     69 Avenue de la Porte d'Auteuil, 75016 Paris
                  </p>
               </div>
               <div className="flex flex-col gap-3 w-full md:w-auto">
                  <a href={googleCalendarLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-stone-900 transition-all w-full md:w-64 rounded">
                     <CalendarPlus size={16} /> <span className="uppercase tracking-widest text-[10px] font-bold">Agenda</span>
                  </a>
                  <a href={wazeLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C5A059] text-stone-900 hover:bg-[#b8924d] hover:text-white transition-all w-full md:w-64 shadow-lg rounded">
                     <Navigation size={16} /> <span className="uppercase tracking-widest text-[10px] font-bold">Waze</span>
                  </a>
               </div>
            </div>
         </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-16 md:py-32 bg-white/50 px-4 relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10 border border-[#C5A059]/20 bg-white/85 backdrop-blur-md p-6 md:p-16 shadow-[0_20px_80px_rgba(0,0,0,0.12)] rounded-lg">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl text-stone-900 mb-2">R.S.V.P</h2>
            <p className="text-[#C5A059] text-[10px] uppercase tracking-[0.2em] mb-2">Avant le 1er Juin</p>
          </div>

          {!rsvpSent ? (
            <form onSubmit={(e) => { e.preventDefault(); setRsvpSent(true); }} className="space-y-6">
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                     <input type="text" required className="block w-full bg-white border border-stone-200 rounded p-3 text-stone-900 text-sm focus:border-[#C5A059] focus:outline-none" placeholder="Prénom" />
                     <input type="text" required className="block w-full bg-white border border-stone-200 rounded p-3 text-stone-900 text-sm focus:border-[#C5A059] focus:outline-none" placeholder="Nom" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-stone-600 text-[10px] uppercase tracking-widest mb-1">Adultes</label>
                    <select className="w-full bg-white border border-stone-200 rounded p-2 text-stone-900 text-sm outline-none focus:border-[#C5A059]"><option>1</option><option>2</option></select>
                 </div>
                 <div>
                    <label className="block text-stone-600 text-[10px] uppercase tracking-widest mb-1">Enfants</label>
                    <select className="w-full bg-white border border-stone-200 rounded p-2 text-stone-900 text-sm outline-none focus:border-[#C5A059]"><option>0</option><option>1</option></select>
                 </div>
              </div>

              <div className="p-3 bg-[#FFF7F2] border border-dashed border-stone-200 rounded flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Car size={16} className="text-[#C5A059]" />
                    <span className="text-stone-800 text-xs">Voiturier</span>
                 </div>
                 <input type="checkbox" className="accent-[#C5A059] w-4 h-4" />
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center">
                   <label className="text-stone-600 text-[10px] uppercase tracking-widest">Message</label>
                   <button type="button" onClick={generateWishes} className="text-[10px] text-[#C5A059] flex items-center gap-1 border border-[#C5A059]/30 px-2 py-1 rounded">
                    <Sparkles size={10} /> IA
                   </button>
                 </div>
                 <textarea value={guestMessage} onChange={(e) => setGuestMessage(e.target.value)} className="w-full bg-white border border-stone-200 p-3 text-stone-800 font-serif italic text-sm rounded h-24 focus:border-[#C5A059] focus:outline-none" placeholder="Vœux..."></textarea>
              </div>

              <button className="w-full bg-[#C5A059] text-stone-900 py-3 uppercase tracking-[0.2em] text-xs font-bold rounded shadow-lg hover:bg-[#b8924d] hover:text-white transition-all">
                Confirmer
              </button>
            </form>
          ) : (
            <div className="text-center py-12 bg-white/70 rounded">
              <Wine className="text-[#C5A059] w-10 h-10 mx-auto mb-4" />
              <span className="font-serif text-3xl text-stone-900 block mb-2">Toda Raba !</span>
              <p className="text-stone-600 font-light">Nous avons hâte de vous retrouver.</p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white/70 py-12 pb-24 text-center border-t border-[#C5A059]/15">
        <p className="font-elegant text-[#C5A059] text-2xl mb-4">Sarah & David</p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">24 . 08 . 2025</p>
      </footer>

      {/* BARRE NAVIGATION MOBILE (Type App) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-stone-200 flex justify-around items-center py-3 z-50 pb-safe">
        <a href="#home" className="flex flex-col items-center gap-1 text-[#C5A059]">
          <Home size={20} />
          <span className="text-[9px] uppercase tracking-widest">Accueil</span>
        </a>
        <a href="#familles" className="flex flex-col items-center gap-1 text-stone-600 hover:text-[#C5A059]">
          <Users size={20} />
          <span className="text-[9px] uppercase tracking-widest">Famille</span>
        </a>
        <a href="#lieu" className="flex flex-col items-center gap-1 text-stone-600 hover:text-[#C5A059]">
          <MapPin size={20} />
          <span className="text-[9px] uppercase tracking-widest">Lieu</span>
        </a>
        <a href="#rsvp" className="flex flex-col items-center gap-1 text-stone-600 hover:text-[#C5A059]">
          <Send size={20} />
          <span className="text-[9px] uppercase tracking-widest">RSVP</span>
        </a>
      </div>

      {/* BOUTON ASSISTANT IA FLOTTANT */}
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40">
        {isChatOpen && (
          <div className="mb-2 w-64 md:w-80 bg-white/90 border border-[#C5A059]/40 shadow-2xl flex flex-col rounded-lg overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="bg-white p-3 flex justify-between items-center border-b border-[#C5A059]/20">
              <span className="text-[#C5A059] uppercase text-[10px]">Assistant</span>
              <button onClick={() => setIsChatOpen(false)}><X size={14} className="text-stone-700" /></button>
            </div>
            <div className="h-48 overflow-y-auto p-3 space-y-2 bg-white">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`text-xs p-2 rounded ${msg.role === 'user' ? 'bg-[#C5A059]/15 text-stone-900 ml-4' : 'text-stone-700 mr-4'}`}>{msg.text}</div>
              ))}
              {isChatLoading && <div className="text-[9px] text-stone-400 text-center">...</div>}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleChatSubmit} className="p-2 bg-white flex gap-2 border-t border-stone-200">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="w-full bg-transparent text-stone-800 text-xs outline-none" placeholder="Question ?" />
              <button type="submit"><Send size={12} className="text-[#C5A059]" /></button>
            </form>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-10 h-10 md:w-12 md:h-12 bg-white border border-[#C5A059] rounded-full flex items-center justify-center shadow-lg">
          {isChatOpen ? <X size={16} className="text-[#C5A059]" /> : <Moon size={16} className="text-[#C5A059]" />}
        </button>
      </div>

    </div>
  );
}