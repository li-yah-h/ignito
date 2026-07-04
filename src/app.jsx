import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Calendar, Mail, ChevronRight, Crosshair, Terminal, Code, Lock, User, Shield, ArrowLeft } from 'lucide-react';

// SMOOTH CARD COMPONENT
const SmoothCard = ({ children, className, onClick }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div 
      className="relative w-full h-full z-10 cursor-pointer group" 
      onClick={onClick}
    >
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative h-full overflow-hidden transition-all duration-500 ease-out transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] ${className}`}
      >
        <div 
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.12), transparent 40%)`
          }}
        />
        {children}
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isHovering, setIsHovering] = useState(false);
  const [booting, setBooting] = useState(true);
  const [showComingSoon, setShowComingSoon] = useState(false);
  
  const [currentView, setCurrentView] = useState('landing'); 
  const [authMode, setAuthMode] = useState('signin'); 

  const mouseRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const bgGridRef = useRef(null);
  const rocketSystemRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);

  useEffect(() => {
    if (booting) return;

    const handleMouseMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const renderLoop = () => {
      const sx = window.scrollY;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      
      const offsetX = mx - window.innerWidth / 2;
      const offsetY = my - window.innerHeight / 2;

      if (cursorDotRef.current) cursorDotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (cursorOutlineRef.current) cursorOutlineRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;

      if (bgGridRef.current) {
        bgGridRef.current.style.transform = `translate(${offsetX * -0.01}px, ${offsetY * -0.01 + sx * -0.3}px)`;
      }

      if (rocketSystemRef.current) {
        const time = Date.now() * 0.002; 
        const floatY = Math.sin(time) * 15; 
        
        rocketSystemRef.current.style.transform = `
          translate(${offsetX * -0.03}px, ${offsetY * -0.03 + sx * 0.6 + floatY}px) 
          rotate(${sx * 0.03}deg)
        `;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [booting]);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (booting || showComingSoon || currentView === 'auth') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTab(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, [booting, showComingSoon, currentView]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  if (booting) {
    return (
      <div className="min-h-screen bg-[#030305] flex flex-col items-center justify-center font-mono text-cyan-400">
        <Terminal size={48} className="mb-4 animate-pulse" />
        <p className="text-sm tracking-[0.2em] animate-pulse">LOADING...</p>
        <div className="w-64 h-1 bg-gray-800 mt-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-cyan-400 animate-[pulse_1s_ease-in-out_infinite] w-full origin-left scale-x-0 transition-transform duration-[1500ms]" style={{ transform: 'scaleX(1)' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-space relative overflow-hidden bg-[#030305]">
      
      {/*CURSOR*/}
      <div ref={cursorDotRef} className="cursor-dot hidden md:block z-[999]" />
      <div ref={cursorOutlineRef} className={`cursor-outline hidden md:block z-[999] ${isHovering ? 'hovering' : ''}`} />

      {/*REDIRECT*/}
      {showComingSoon && (
        <div className="fixed inset-0 z-[100] bg-[#030305]/95 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="text-center space-y-8 p-6">
            <Terminal size={64} className="text-cyan-500 mx-auto opacity-50" />
            <h2 className="text-5xl md:text-7xl font-syncopate font-bold text-white tracking-widest">
              DATA <span className="text-cyan-500">ENCRYPTED</span>
            </h2>
            <p className="text-gray-400 font-mono tracking-[0.3em] uppercase text-sm animate-pulse">
              Mission parameters are currently classified. <br/> Module coming soon.
            </p>
            <button 
              onClick={() => setShowComingSoon(false)}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="mt-8 border-2 border-cyan-500 text-cyan-400 px-8 py-4 font-syncopate font-bold text-sm hover:bg-cyan-500 hover:text-black transition-all duration-300"
            >
              RETURN TO BASE
            </button>
          </div>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none z-0">
        <div ref={bgGridRef} className="absolute inset-[-50%] w-[200%] h-[200%]">
          <div className="absolute inset-0 bg-tech-grid bg-[size:40px_40px] opacity-10"></div>
          <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-cyan-600/10 blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full bg-purple-600/10 blur-[100px]"></div>
        </div>

        <div className={`absolute top-[20%] right-[5%] lg:right-[15%] w-[400px] h-[400px] flex justify-center items-center scale-75 md:scale-100 transition-opacity duration-700 ${currentView === 'auth' ? 'opacity-10' : 'opacity-40 md:opacity-100'}`}>
          <div ref={rocketSystemRef} className="relative w-full h-full flex justify-center items-center">
            
            <div className="absolute" style={{ transform: 'rotateX(75deg) rotateY(-15deg)', transformStyle: 'preserve-3d' }}>
              <div className="w-[450px] h-[450px] border-2 border-cyan-400/90 shadow-[0_0_35px_rgba(34,211,238,0.5)] rounded-full animate-[spin_12s_linear_infinite] relative">
                <div className="absolute top-0 left-1/2 w-4 h-4 bg-cyan-300 rounded-full shadow-[0_0_30px_#22d3ee] -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>

            <div className="absolute" style={{ transform: 'rotateX(65deg) rotateY(25deg)', transformStyle: 'preserve-3d' }}>
              <div className="w-[550px] h-[550px] border-[3px] border-dashed border-purple-500/90 shadow-[0_0_35px_rgba(168,85,247,0.5)] rounded-full animate-[spin_20s_linear_infinite_reverse] relative">
                <div className="absolute bottom-0 left-1/2 w-5 h-5 bg-purple-400 rounded-full shadow-[0_0_35px_#a855f7] -translate-x-1/2 translate-y-1/2"></div>
              </div>
            </div>

            <div className="absolute w-40 h-40 bg-cyan-500/20 rounded-full blur-[40px] animate-pulse"></div>

            <div className="relative z-10 flex flex-col items-center drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] translate-y-12">
              <Rocket size={112} className="text-cyan-400 -rotate-45 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" strokeWidth={1.5} />
              <div className="w-4 h-36 bg-gradient-to-b from-cyan-400 via-cyan-500/60 to-transparent blur-[4px] mt-2 rounded-full animate-pulse-fast"></div>
            </div>

          </div>
        </div>
      </div>

      {/*NAVIGATION*/}
      <nav className="fixed top-0 w-full z-50 bg-[#030305]/80 backdrop-blur-md border-b border-cyan-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            className="font-syncopate font-bold text-xl tracking-widest flex items-center gap-2 cursor-pointer"
            onClick={() => { setCurrentView('landing'); setTimeout(() => scrollToSection('home'), 100); }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Crosshair className="text-cyan-400 animate-spin-slow" size={24} />
            <span className="text-white">IGNITO<span className="text-cyan-400">'26</span></span>
          </div>
          
          <div className="hidden md:flex gap-8 font-syncopate text-xs tracking-widest items-center">
            {currentView === 'landing' ? (
              <>
                {['home', 'events', 'competitions', 'contact'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => scrollToSection(tab)}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className={`uppercase transition-all duration-300 ${activeTab === tab ? 'text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-gray-500 hover:text-white'}`}
                  >
                    {tab}
                  </button>
                ))}
              </>
            ) : (
              <button 
                onClick={() => setCurrentView('landing')}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="flex items-center gap-2 text-cyan-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} /> ABORT ROUTINE
              </button>
            )}
          </div>
        </div>
      </nav>

      {currentView === 'landing' ? (
        <main className={`relative z-10 max-w-7xl mx-auto px-6 flex flex-col transition-opacity duration-500 ${showComingSoon ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          
          {/* HOME SECTION */}
          <section id="home" className="min-h-screen flex items-center pt-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
              <div className="space-y-6">
                <br></br>
                <h1 className="text-6xl md:text-8xl font-bold font-syncopate leading-none uppercase text-white glitch-text" data-text="BEYOND ORBIT">
                  BEYOND <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">ORBIT</span>
                </h1>
                
                <p className="text-gray-400 text-lg md:text-xl font-light max-w-lg leading-relaxed">
                  A technology symposium for engineers and developers. Engage in technical workshops, competitive hackathons, and connect with industry professionals.
                </p>
                
                <div className="pt-6">
                  <button 
                    onClick={() => setCurrentView('auth')}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-syncopate text-sm font-bold tracking-widest px-8 py-4 flex items-center gap-3 transition-all duration-300"
                  >
                    SIGN IN <ChevronRight size={18} />
                  </button>
                </div>
              </div>
              <div className="hidden lg:block h-[500px]"></div>
            </div>
          </section>

          {/*EVENTS*/}
          <section id="events" className="min-h-[80vh] flex flex-col justify-center py-20 border-t border-cyan-900/30">
            <div className="space-y-12 w-full">
              <div className="text-center space-y-2">
                <h2 className="text-4xl md:text-5xl font-syncopate font-bold text-white uppercase">Featured Events</h2>
                <p className="text-cyan-400 font-mono text-sm">WORKSHOPS & SEMINARS</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((item) => (
                  <SmoothCard 
                    key={`event-${item}`} 
                    onClick={() => setShowComingSoon(true)}
                    className="bg-[#0a0a14]/60 backdrop-blur-md border border-cyan-900/50 group-hover:border-cyan-400 group-hover:bg-[#0a0a14]/90 p-8 flex flex-col transition-colors duration-300 rounded-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-[1500ms] ease-linear pointer-events-none z-0"></div>

                    <div className="relative z-10 w-12 h-12 rounded-lg bg-cyan-950 flex items-center justify-center mb-6 text-cyan-400 border border-cyan-800 shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300">
                      <Calendar size={24} className="relative z-10" />
                      <div className="absolute inset-0 bg-cyan-400/20 rounded-lg scale-0 group-hover:scale-150 group-hover:animate-ping opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"></div>
                    </div>
                    
                    <h3 className="relative z-10 text-2xl font-bold font-syncopate text-white mb-3">EVENT 0{item}</h3>
                    <p className="relative z-10 text-gray-400 text-sm mb-4 flex-grow group-hover:text-gray-300 transition-colors">
                      Attend specialized technical workshops and seminars.
                    </p>
                    
                    <div className="relative z-10 w-full h-[2px] bg-cyan-900/30 mt-auto mb-4 overflow-hidden rounded-full">
                      <div className="absolute top-0 left-0 h-full bg-cyan-400 w-0 group-hover:w-full transition-all duration-[1000ms] ease-out"></div>
                    </div>

                    <div className="relative z-10 flex justify-center items-center border-t border-cyan-900/50 pt-4">
                      <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300">
                        ENTRY FEE: ₹{['300', '600', '1,000'][item - 1]}
                      </span>
                    </div>
                  </SmoothCard>
                ))}
              </div>
            </div>
          </section>

          {/*COMPETITIONS*/}
          <section id="competitions" className="min-h-[80vh] flex flex-col justify-center py-20 border-t border-cyan-900/30">
            <div className="space-y-12 w-full">
              <div className="text-center space-y-2">
                <h2 className="text-4xl md:text-5xl font-syncopate font-bold text-white uppercase">Competitions</h2>
                <p className="text-cyan-400 font-mono text-sm">HACKATHONS & CHALLENGES</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((item) => (
                  <SmoothCard 
                    key={`comp-${item}`} 
                    onClick={() => setShowComingSoon(true)}
                    className="bg-[#0a0a14]/60 backdrop-blur-md border border-purple-900/50 group-hover:border-purple-400 group-hover:bg-[#0a0a14]/90 p-8 flex flex-col transition-colors duration-300 rounded-xl"
                  >
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-3 group-hover:translate-y-3 transition-all duration-300"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-400 opacity-0 group-hover:opacity-100 group-hover:-translate-x-3 group-hover:translate-y-3 transition-all duration-300"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-3 group-hover:-translate-y-3 transition-all duration-300"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-400 opacity-0 group-hover:opacity-100 group-hover:-translate-x-3 group-hover:-translate-y-3 transition-all duration-300"></div>

                    <div className="relative z-10 w-12 h-12 rounded-lg bg-purple-950 flex items-center justify-center mb-6 text-purple-400 border border-purple-800 shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all duration-300">
                      <Code size={24} className="relative z-10" />
                      <div className="absolute inset-[-6px] border border-dashed border-purple-400/0 group-hover:border-purple-400/60 rounded-lg group-hover:animate-[spin_4s_linear_infinite] transition-colors duration-300 pointer-events-none"></div>
                    </div>
                    
                    <h3 className="relative z-10 text-2xl font-bold font-syncopate text-white mb-3">HACKATHON 0{item}</h3>
                    <p className="relative z-10 text-gray-400 text-sm mb-4 flex-grow group-hover:text-gray-300 transition-colors">
                      Demonstrate your engineering and problem-solving skills in hackathons, challenges, and technical design sprints.
                    </p>

                    <div className="relative z-10 w-full flex gap-1 mt-auto mb-4">
                      <div className="h-[2px] bg-purple-900/50 flex-grow group-hover:bg-purple-500/50 transition-colors duration-500 delay-100"></div>
                      <div className="h-[2px] bg-purple-900/50 w-4 group-hover:bg-purple-400 transition-colors duration-500 delay-200 group-hover:animate-pulse"></div>
                      <div className="h-[2px] bg-purple-900/50 w-2 group-hover:bg-purple-300 transition-colors duration-500 delay-300"></div>
                    </div>

                    <div className="relative z-10 flex justify-center items-center border-t border-purple-900/50 pt-4">
                      <span className="text-xs font-mono font-bold text-purple-400 tracking-widest group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] transition-all duration-300">
                        PRIZE POOL: ₹{['1,500', '3,000', '5,000'][item - 1]}
                      </span>
                    </div>
                  </SmoothCard>
                ))}
              </div>
            </div>
          </section>

          {/*CONTACT*/}
          <section id="contact" className="min-h-screen flex items-center justify-center py-20 border-t border-cyan-900/30">
            <div className="max-w-2xl mx-auto w-full">
              <SmoothCard className="bg-[#0a0a14]/80 backdrop-blur-lg border border-cyan-800/50 p-8 md:p-12 rounded-2xl">                
                <div className="mb-8 relative z-10">
                  <h2 className="text-3xl font-syncopate font-bold text-white flex items-center gap-3">
                    <Mail className="text-cyan-400" /> TRANSMIT SIGNAL
                  </h2>
                </div>

                <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                  <div className="relative">
                    <label className="block text-xs font-mono text-cyan-500 mb-2">NAME</label>
                    <input type="text" className="peer w-full bg-black/50 border-b border-cyan-900 p-3 text-white focus:outline-none transition-colors font-mono text-sm relative z-10" placeholder="Enter name" />
                    <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-cyan-400 peer-focus:w-full peer-focus:left-0 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(34,211,238,0.8)] z-20"></div>
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-mono text-cyan-500 mb-2">EMAIL</label>
                    <input type="email" className="peer w-full bg-black/50 border-b border-cyan-900 p-3 text-white focus:outline-none transition-colors font-mono text-sm relative z-10" placeholder="operator@domain.com" />
                    <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-cyan-400 peer-focus:w-full peer-focus:left-0 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(34,211,238,0.8)] z-20"></div>
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-mono text-cyan-500 mb-2">MESSAGE</label>
                    <textarea rows="4" className="peer w-full bg-black/50 border-b border-cyan-900 p-3 text-white focus:outline-none transition-colors font-mono text-sm resize-none relative z-10" placeholder="Enter encrypted message..."></textarea>
                    <div className="absolute bottom-1 left-1/2 w-0 h-[2px] bg-cyan-400 peer-focus:w-full peer-focus:left-0 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(34,211,238,0.8)] z-20"></div>
                  </div>
                  <button 
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="relative overflow-hidden w-full bg-cyan-950 text-cyan-400 border border-cyan-500 font-syncopate text-sm font-bold tracking-widest p-4 group"
                  >
                    <span className="relative z-10 group-hover:text-black transition-colors duration-300">INITIATE TRANSFER</span>
                    <div className="absolute inset-0 bg-cyan-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
                  </button>
                </form>
              </SmoothCard>
            </div>
          </section>

        </main>
      ) : (

        /*SIGN IN*/
        <main className="relative z-10 max-w-lg mx-auto px-6 pt-32 pb-20 flex flex-col items-center justify-center min-h-screen animate-in fade-in zoom-in-95 duration-500">
          <SmoothCard className="bg-[#0a0a14]/80 backdrop-blur-xl border border-cyan-800/50 p-8 md:p-10 w-full rounded-2xl relative overflow-hidden">
            
            <div className="absolute top-0 right-0 p-4 text-cyan-900/10 font-syncopate text-8xl font-black pointer-events-none z-0 select-none">
              {authMode === 'signin' ? 'SYS' : 'NEW'}
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

            <div className="relative z-10 mb-8 text-center space-y-2">
              <Shield className="mx-auto text-cyan-400 mb-4" size={32} />
              <h2 className="text-2xl font-syncopate font-bold text-white uppercase tracking-wider">
                System Clearance
              </h2>
              <p className="text-cyan-500 font-mono text-xs tracking-widest">AWAITING CREDENTIALS</p>
            </div>

            <div className="relative z-10 flex bg-black/50 p-1 rounded-sm border border-cyan-900/50 mb-8 font-syncopate text-xs font-bold tracking-widest">
              <button 
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-3 transition-colors ${authMode === 'signin' ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/30' : 'text-gray-500 hover:text-cyan-200'}`}
              >
                ACCESS
              </button>
              <button 
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-3 transition-colors ${authMode === 'signup' ? 'bg-purple-950/80 text-purple-400 border border-purple-500/30' : 'text-gray-500 hover:text-purple-200'}`}
              >
                ENLIST
              </button>
            </div>

            <form className="space-y-5 relative z-10" onSubmit={(e) => e.preventDefault()}>
              
              {authMode === 'signup' && (
                <div className="relative animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="flex items-center gap-2 text-[10px] font-mono text-purple-400 mb-2 uppercase">
                    <User size={12} /> Operator Designation
                  </label>
                  <input type="text" required className="peer w-full bg-black/50 border-b border-cyan-900/50 p-3 text-white focus:outline-none focus:border-transparent transition-colors font-mono text-sm relative z-10 placeholder-gray-700" placeholder="Full Name" />
                  <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-purple-400 peer-focus:w-full peer-focus:left-0 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(168,85,247,0.8)] z-20"></div>
                </div>
              )}

              <div className="relative">
                <label className="flex items-center gap-2 text-[10px] font-mono text-cyan-500 mb-2 uppercase">
                  <Mail size={12} /> Comm-Link (Email)
                </label>
                <input type="email" required className="peer w-full bg-black/50 border-b border-cyan-900/50 p-3 text-white focus:outline-none focus:border-transparent transition-colors font-mono text-sm relative z-10 placeholder-gray-700" placeholder="operator@domain.com" />
                <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-cyan-400 peer-focus:w-full peer-focus:left-0 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(34,211,238,0.8)] z-20"></div>
              </div>

              <div className="relative">
                <label className="flex items-center gap-2 text-[10px] font-mono text-cyan-500 mb-2 uppercase">
                  <Lock size={12} /> Security Key
                </label>
                <input type="password" required className="peer w-full bg-black/50 border-b border-cyan-900/50 p-3 text-white focus:outline-none focus:border-transparent transition-colors font-mono text-sm relative z-10 placeholder-gray-700" placeholder="••••••••" />
                <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-cyan-400 peer-focus:w-full peer-focus:left-0 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(34,211,238,0.8)] z-20"></div>
              </div>

              {authMode === 'signup' && (
                <>
                  <div className="relative animate-in fade-in slide-in-from-top-4 duration-300 delay-75">
                    <label className="flex items-center gap-2 text-[10px] font-mono text-purple-400 mb-2 uppercase">
                      <Lock size={12} /> Verify Security Key
                    </label>
                    <input type="password" required className="peer w-full bg-black/50 border-b border-cyan-900/50 p-3 text-white focus:outline-none focus:border-transparent transition-colors font-mono text-sm relative z-10 placeholder-gray-700" placeholder="••••••••" />
                    <div className="absolute bottom-0 left-1/2 w-0 h-[2px] bg-purple-400 peer-focus:w-full peer-focus:left-0 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(168,85,247,0.8)] z-20"></div>
                  </div>
                  
                  <div className="flex items-start gap-3 mt-4 animate-in fade-in duration-300 delay-100">
                    <input type="checkbox" required id="tos" className="mt-1 accent-purple-500 bg-black border-purple-900" />
                    <label htmlFor="tos" className="text-[10px] font-mono text-gray-400 leading-tight">
                      I confirm these credentials are valid and accept the <span className="text-purple-400 hover:underline cursor-pointer">Ignito Protocol Directives</span> for system usage.
                    </label>
                  </div>
                </>
              )}

              {authMode === 'signin' && (
                <div className="text-right mt-2">
                  <button type="button" className="text-[10px] font-mono text-cyan-600 hover:text-cyan-400 transition-colors">
                    OVERRIDE CLEARANCE (Forgot Key?)
                  </button>
                </div>
              )}

              <button 
                type="submit"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className={`relative overflow-hidden w-full mt-6 font-syncopate text-sm font-bold tracking-widest p-4 group transition-colors duration-300 ${
                  authMode === 'signin' 
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]' 
                  : 'bg-purple-950 text-purple-400 border border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                }`}
              >
                <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                  {authMode === 'signin' ? 'INITIALIZE UPLINK' : 'ESTABLISH PROFILE'}
                </span>
                <div className={`absolute inset-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0 ${authMode === 'signin' ? 'bg-cyan-400' : 'bg-purple-400'}`}></div>
              </button>
            </form>
          </SmoothCard>
        </main>
      )}

      {/*Mobile Nav*/}
      {currentView === 'landing' && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#030305]/95 border-t border-cyan-900/50 p-4 flex justify-around z-50">
          {['home', 'events', 'competitions', 'contact'].map((tab) => (
            <button 
              key={`mobile-${tab}`}
              onClick={() => scrollToSection(tab)}
              className={`text-[10px] uppercase font-syncopate font-bold ${activeTab === tab ? 'text-cyan-400' : 'text-gray-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}