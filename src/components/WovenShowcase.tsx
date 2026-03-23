import React, { useEffect, useState } from 'react';
import vogueWomanArt2 from '@/assets/vogue-woman-art-2.png';
import clotheslineImg from '@/assets/clothesline.png';

const WovenShowcase: React.FC = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 md:py-32 relative overflow-hidden flex items-center justify-center"
      style={{
        background: 'radial-gradient(circle at center, #b81d22 0%, #5c0a0d 100%)',
        minHeight: '80vh',
      }}
    >
      {/* Clothesline image - top center */}
      <img
        src={clotheslineImg}
        alt=""
        aria-hidden="true"
        className="absolute top-4 left-1/2 -translate-x-1/2 w-[70vw] max-w-[600px] pointer-events-none select-none z-[5] opacity-90"
      />

      {/* Vogue woman art - top left */}
      <img
        src={vogueWomanArt2}
        alt=""
        aria-hidden="true"
        className="absolute top-6 left-6 w-36 md:w-52 pointer-events-none select-none z-[5] opacity-80"
      />

      {/* Alpona Background */}
      <div
        className="absolute flex items-center justify-center pointer-events-none"
        style={{
          width: '100vmin',
          height: '100vmin',
          opacity: 0.15,
          animation: 'spinBg 60s linear infinite',
        }}
      >
        <svg viewBox="0 0 500 500" width="100%" height="100%">
          {/* Concentric circles */}
          {[200, 170, 140, 110, 80].map((r, i) => (
            <circle key={i} cx="250" cy="250" r={r} fill="none" stroke="#F8F0E3" strokeWidth="1.5"
              style={{
                strokeDasharray: 2 * Math.PI * r,
                strokeDashoffset: animate ? 0 : 2 * Math.PI * r,
                transition: `stroke-dashoffset 4s cubic-bezier(0.25, 0.1, 0.25, 1) ${i * 0.2}s`,
              }}
            />
          ))}
          {/* Petal shapes */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 250 + Math.cos(angle) * 80;
            const y1 = 250 + Math.sin(angle) * 80;
            const x2 = 250 + Math.cos(angle) * 200;
            const y2 = 250 + Math.sin(angle) * 200;
            return (
              <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#F8F0E3" strokeWidth="1" opacity="0.6"
                style={{
                  strokeDasharray: 120,
                  strokeDashoffset: animate ? 0 : 120,
                  transition: `stroke-dashoffset 3s ease ${0.5 + i * 0.1}s`,
                }}
              />
            );
          })}
          {/* Diamond shapes */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const cx = 250 + Math.cos(angle) * 150;
            const cy = 250 + Math.sin(angle) * 150;
            return (
              <rect key={`d${i}`} x={cx - 8} y={cy - 8} width="16" height="16"
                fill="none" stroke="#F8F0E3" strokeWidth="1"
                transform={`rotate(45 ${cx} ${cy})`}
                style={{
                  strokeDasharray: 64,
                  strokeDashoffset: animate ? 0 : 64,
                  transition: `stroke-dashoffset 2s ease ${1 + i * 0.15}s`,
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* BUTEX SVG Text */}
        <svg viewBox="0 0 600 200" className="w-[80vw] max-w-[600px] h-[200px] overflow-visible">
          <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: '130px',
              letterSpacing: '5px',
              fill: animate ? '#FFD700' : 'transparent',
              stroke: '#FFD700',
              strokeWidth: animate ? '0.5px' : '1.5px',
              strokeDasharray: 800,
              strokeDashoffset: animate ? 0 : 800,
              transition: 'stroke-dashoffset 3.5s ease-in-out 0.5s, fill 1.5s ease-in-out 3.5s, stroke-width 1.5s ease-in-out 3.5s',
              filter: animate ? 'drop-shadow(0px 0px 15px rgba(255, 215, 0, 0.6))' : 'none',
            }}
          >
            BUTEX
          </text>
        </svg>

        {/* Bengali Sub-text */}
        <p
          style={{
            color: '#FFD700',
            fontSize: '1.5rem',
            letterSpacing: '2px',
            marginTop: '-30px',
            opacity: animate ? 1 : 0,
            transform: animate ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 2s ease-out 4s, transform 2s ease-out 4s',
            textShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
            fontFamily: "'Tiro Bangla', serif",
          }}
        >
          বাংলাদেশ টেক্সটাইল বিশ্ববিদ্যালয়
        </p>
      </div>

      {/* Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Tiro+Bangla:ital@0;1&display=swap');
        @keyframes spinBg {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `}</style>
    </section>
  );
};

export default WovenShowcase;
