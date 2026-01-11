import React, { useEffect, useState } from 'react';

const Splash: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500); // Wait for fade animation
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } bg-[#020617] text-white`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Enhansive Liquid Logo */}
        <div className="relative group mb-12">
          {/* External Glow Ring */}
          <div className="absolute inset-[-20px] bg-blue-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="relative w-48 h-48 md:w-56 md:h-56">
            {/* The "Globe" Container */}
            <div className="absolute inset-0 rounded-full bg-slate-900 border border-white/10 shadow-2xl overflow-hidden flex items-center justify-center backdrop-blur-3xl">
              
              {/* Liquid Waves Animation */}
              <div className="absolute inset-0 opacity-40">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 50 Q 25 40 50 50 T 100 50 V 100 H 0 Z" fill="#3b82f6" className="animate-wave-slow" />
                  <path d="M0 60 Q 25 70 50 60 T 100 60 V 100 H 0 Z" fill="#2563eb" className="animate-wave-fast" />
                </svg>
              </div>

              {/* Central Icon */}
              <div className="relative z-20 flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400 drop-shadow-glow">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor" fillOpacity="0.3" />
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 14c.5 1.5 2 2.5 4 2.5s3.5-1 4-2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                   </svg>
                </div>
                
                {/* Badge */}
                <div className="mt-4 px-3 py-1 bg-white/10 border border-white/20 rounded-full backdrop-blur-xl">
                  <span className="text-[10px] font-black tracking-[0.2em] text-blue-200 uppercase">SDG 6 Indicator</span>
                </div>
              </div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            </div>
          </div>
        </div>

        {/* Textual Identity */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
            AQUA DISTENSER
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-blue-500"></div>
            <p className="text-blue-400 font-bold text-sm tracking-widest uppercase opacity-80">
              Sustainable Lake Monitoring
            </p>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-blue-500"></div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
          100% { transform: translateX(0); }
        }
        .animate-wave-slow {
          animation: wave 12s ease-in-out infinite;
          transform-origin: bottom;
        }
        .animate-wave-fast {
          animation: wave 8s ease-in-out infinite reverse;
          opacity: 0.6;
        }
        .drop-shadow-glow {
          filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.5));
        }
      `}} />
    </div>
  );
};

export default Splash;