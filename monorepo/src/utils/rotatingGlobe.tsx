import { useState, useEffect } from 'react';

export const RotatingGlobe = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-80 h-80 mx-auto mb-8">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl animate-pulse" />
      
      {/* Main globe container */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-black shadow-2xl border border-slate-700/50 overflow-hidden">
        {/* Globe surface with rotation */}
        <div 
          className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-900/40 via-slate-800 to-slate-900 overflow-hidden"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Enhanced grid lines */}
          <div className="absolute inset-0">
            {/* Meridian lines with glow */}
            {[...Array(12)].map((_, i) => (
              <div
                key={`meridian-${i}`}
                className="absolute w-0.5 bg-gradient-to-b from-cyan-400/60 via-blue-400/40 to-cyan-400/60 shadow-sm shadow-cyan-400/50"
                style={{
                  height: '100%',
                  left: `${(i * 8.33)}%`,
                  transformOrigin: 'center',
                  transform: `rotate(${i * 15}deg)`
                }}
              />
            ))}
            
            {/* Latitude lines with perspective */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`latitude-${i}`}
                className="absolute h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent shadow-sm shadow-cyan-400/30"
                style={{
                  width: '100%',
                  top: `${(i + 1) * 14.28}%`,
                  borderRadius: '50%',
                  transform: `scaleX(${Math.sin((i + 1) * Math.PI / 7) * 0.9 + 0.1})`
                }}
              />
            ))}
          </div>
          
          {/* Enhanced continents with glow */}
          <div className="absolute inset-0 overflow-hidden">
            {/* North America */}
            <div className="absolute w-10 h-8 bg-gradient-to-br from-emerald-400/70 to-green-500/70 rounded-full shadow-lg shadow-emerald-400/30" style={{ top: '25%', left: '12%' }} />
            
            {/* Europe/Africa */}
            <div className="absolute w-14 h-12 bg-gradient-to-br from-amber-400/70 to-orange-500/70 rounded-full shadow-lg shadow-amber-400/30" style={{ top: '35%', left: '42%' }} />
            
            {/* Asia */}
            <div className="absolute w-8 h-14 bg-gradient-to-br from-purple-400/70 to-violet-500/70 rounded-full shadow-lg shadow-purple-400/30" style={{ top: '20%', left: '68%' }} />
            
            {/* South America */}
            <div className="absolute w-6 h-10 bg-gradient-to-br from-pink-400/70 to-rose-500/70 rounded-full shadow-lg shadow-pink-400/30" style={{ top: '55%', left: '18%' }} />
            
            {/* Australia */}
            <div className="absolute w-5 h-4 bg-gradient-to-br from-teal-400/70 to-cyan-500/70 rounded-full shadow-lg shadow-teal-400/30" style={{ top: '70%', left: '72%' }} />
            
            {/* Additional islands */}
            <div className="absolute w-3 h-2 bg-gradient-to-br from-indigo-400/60 to-blue-500/60 rounded-full shadow-md shadow-indigo-400/20" style={{ top: '45%', left: '85%' }} />
            <div className="absolute w-2 h-3 bg-gradient-to-br from-red-400/60 to-pink-500/60 rounded-full shadow-md shadow-red-400/20" style={{ top: '30%', left: '8%' }} />
          </div>
        </div>
        
        {/* Enhanced surface shine */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tl from-transparent via-transparent to-white/10 pointer-events-none" />
      </div>
      
      {/* Orbiting particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-3 h-3 rounded-full animate-pulse shadow-lg"
            style={{
              background: `linear-gradient(45deg, ${['#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16'][i]}, transparent)`,
              top: `${20 + Math.sin((i * Math.PI) / 4) * 30}%`,
              left: `${20 + Math.cos((i * Math.PI) / 4) * 30}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${1.5 + Math.random() * 1.5}s`,
              boxShadow: `0 0 10px ${['#3b82f6', '#8b5cf6', '#ef4444', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16'][i]}40`
            }}
          />
        ))}
      </div>
      
      {/* Floating orbital rings */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `rotate(${rotation * 0.5}deg)` }}
      >
        <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-pulse" style={{ transform: 'rotateX(60deg) rotateY(45deg)' }} />
        <div className="absolute inset-2 rounded-full border border-purple-400/20 animate-pulse" style={{ transform: 'rotateX(-60deg) rotateY(-45deg)', animationDelay: '0.5s' }} />
      </div>
      
      {/* Dynamic light rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
        <div 
          className="absolute w-1 h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent blur-sm"
          style={{ 
            left: '20%', 
            transform: `rotate(${rotation * 2}deg)`,
            transformOrigin: 'center'
          }}
        />
        <div 
          className="absolute w-1 h-full bg-gradient-to-b from-transparent via-purple-400/50 to-transparent blur-sm"
          style={{ 
            right: '20%', 
            transform: `rotate(${-rotation * 1.5}deg)`,
            transformOrigin: 'center'
          }}
        />
      </div>
    </div>
  );
};