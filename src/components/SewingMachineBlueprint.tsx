import React from 'react';

const SewingMachineBlueprint: React.FC = () => {
  return (
    <div
      className="w-full max-w-[800px] mx-auto rounded-lg overflow-hidden relative"
      style={{
        aspectRatio: '4/5',
        backgroundColor: '#064273',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px),
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
        border: '4px solid #03203b',
      }}
    >
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      <svg
        viewBox="0 0 800 900"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* === STATIC MACHINE BODY === */}
        <g stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none">
          {/* Base / Table */}
          <rect x="100" y="650" width="600" height="20" rx="3" />
          <line x1="150" y1="670" x2="150" y2="750" />
          <line x1="650" y1="670" x2="650" y2="750" />
          <line x1="120" y1="750" x2="180" y2="750" />
          <line x1="620" y1="750" x2="680" y2="750" />

          {/* Machine Body Outline */}
          <path d="M 180 650 L 180 300 Q 180 250 230 250 L 550 250 Q 600 250 620 280 L 650 340 L 650 650" />

          {/* Top Arm */}
          <path d="M 180 300 L 180 280 Q 180 250 210 250 L 350 250 L 350 300 L 180 300" />

          {/* Head / Front face */}
          <rect x="300" y="300" width="200" height="250" rx="10" />

          {/* Throat plate area */}
          <rect x="200" y="570" width="150" height="80" rx="5" strokeDasharray="5 3" />

          {/* Spool pin on top */}
          <line x1="280" y1="250" x2="280" y2="200" />
          <circle cx="280" cy="195" r="8" />
          <circle cx="280" cy="195" r="3" fill="rgba(255,255,255,0.5)" />

          {/* Tension dial */}
          <circle cx="250" cy="350" r="15" />
          <circle cx="250" cy="350" r="5" fill="rgba(255,255,255,0.3)" />
          <line x1="250" y1="335" x2="250" y2="340" />
          <line x1="250" y1="360" x2="250" y2="365" />
          <line x1="235" y1="350" x2="240" y2="350" />
          <line x1="260" y1="350" x2="265" y2="350" />

          {/* Stitch length dial */}
          <circle cx="450" cy="420" r="12" />
          <line x1="450" y1="408" x2="450" y2="412" />

          {/* Presser foot area */}
          <rect x="230" y="550" width="40" height="20" rx="3" />
          <line x1="250" y1="520" x2="250" y2="550" />
        </g>

        {/* === ANIMATED PARTS === */}

        {/* Hand Wheel (right side) */}
        <g className="sewing-handwheel" filter="url(#glow)">
          <circle cx="600" cy="280" r="40" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" fill="none" />
          <circle cx="600" cy="280" r="30" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          <circle cx="600" cy="280" r="5" fill="rgba(255,255,255,0.6)" />
          {/* Spokes */}
          <line x1="600" y1="240" x2="600" y2="250" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
          <line x1="600" y1="310" x2="600" y2="320" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
          <line x1="560" y1="280" x2="570" y2="280" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
          <line x1="630" y1="280" x2="640" y2="280" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
          {/* Handle */}
          <circle cx="600" cy="240" r="6" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none" />
        </g>

        {/* Bobbin (bottom) */}
        <g className="sewing-bobbin" filter="url(#glow)">
          <circle cx="240" cy="580" r="20" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none" />
          <circle cx="240" cy="580" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          <circle cx="240" cy="580" r="3" fill="rgba(255,255,255,0.5)" />
          <line x1="240" y1="560" x2="240" y2="565" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
          <line x1="240" y1="595" x2="240" y2="600" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
        </g>

        {/* Needle Mechanism */}
        <g className="sewing-needle" filter="url(#glow)">
          <line x1="250" y1="470" x2="250" y2="560" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <polygon points="248,560 252,560 250,580" fill="rgba(255,255,255,0.8)" />
          {/* Needle bar */}
          <rect x="245" y="450" width="10" height="25" rx="2" stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="none" />
        </g>

        {/* Take-up Lever */}
        <g className="sewing-takeup" filter="url(#glow)">
          <line x1="200" y1="350" x2="220" y2="310" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
          <circle cx="220" cy="310" r="4" fill="rgba(255,255,255,0.6)" />
        </g>

        {/* Drive Belt */}
        <path
          className="sewing-belt"
          d="M 600 320 Q 580 450 400 500 Q 280 530 240 560"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Thread path (from spool through machine) */}
        <path
          className="sewing-thread"
          d="M 280 195 L 280 250 L 250 300 L 250 350 L 220 310 L 250 470"
          stroke="rgba(100,200,255,0.6)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />

        {/* Stitches on fabric */}
        <g className="sewing-stitches">
          <line x1="170" y1="570" x2="230" y2="570" stroke="rgba(255,200,100,0.7)" strokeWidth="1.5" strokeDasharray="8 6" />
        </g>

        {/* Fabric piece */}
        <g stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none">
          <path d="M 170 555 L 320 555 L 320 590 L 170 590 Z" strokeDasharray="3 2" />
        </g>

        {/* Dimension lines (blueprint style) */}
        <g stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="5 5">
          <line x1="100" y1="250" x2="100" y2="650" />
          <line x1="95" y1="250" x2="105" y2="250" />
          <line x1="95" y1="650" x2="105" y2="650" />

          <line x1="180" y1="780" x2="650" y2="780" />
          <line x1="180" y1="775" x2="180" y2="785" />
          <line x1="650" y1="775" x2="650" y2="785" />
        </g>
      </svg>
    </div>
  );
};

export default SewingMachineBlueprint;
