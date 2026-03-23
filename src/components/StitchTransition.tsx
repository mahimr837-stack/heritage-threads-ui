import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const StitchTransition: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 90%', 'end 20%'],
  });

  const HOLE_SPACING = 45;
  const NUM_HOLES = 25;
  const CENTER_Y = 40;
  const SVG_WIDTH = 10 + (NUM_HOLES - 1) * HOLE_SPACING + 10;

  const holes = Array.from({ length: NUM_HOLES }, (_, i) => ({
    x: 10 + i * HOLE_SPACING,
    y: CENTER_Y,
  }));

  // Build running-stitch path
  let stitchPath = `M ${holes[0].x} ${holes[0].y}`;
  for (let i = 1; i < holes.length; i++) {
    const midX = (holes[i - 1].x + holes[i].x) / 2;
    if (i % 2 === 1) {
      stitchPath += ` Q ${midX} ${CENTER_Y - 14}, ${holes[i].x} ${holes[i].y}`;
    } else {
      stitchPath += ` Q ${midX} ${CENTER_Y + 14}, ${holes[i].x} ${holes[i].y}`;
    }
  }

  // Animate thread reveal via strokeDashoffset
  const pathLength = NUM_HOLES * HOLE_SPACING * 1.2; // approximate
  const dashOffset = useTransform(scrollYProgress, [0, 1], [pathLength, 0]);

  // Needle position: move across the SVG width
  const needleX = useTransform(scrollYProgress, [0, 1], [holes[0].x, holes[NUM_HOLES - 1].x]);

  // Needle Y follows the wave pattern
  const needleYKeys = holes.map((_, i) => i / (NUM_HOLES - 1));
  const needleYValues = holes.map((h) => h.y);
  const needleY = useTransform(scrollYProgress, needleYKeys, needleYValues);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden pointer-events-none z-30"
      style={{ height: '80px' }}
      aria-hidden="true"
    >
      {/* Fabric strip background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'hsl(var(--card))',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect width='10' height='10' fill='none'/%3E%3Cline x1='0' y1='0' x2='10' y2='0' stroke='%23000' stroke-width='0.3' opacity='0.04'/%3E%3Cline x1='0' y1='5' x2='10' y2='5' stroke='%23000' stroke-width='0.3' opacity='0.04'/%3E%3Cline x1='0' y1='0' x2='0' y2='10' stroke='%23000' stroke-width='0.3' opacity='0.03'/%3E%3Cline x1='5' y1='0' x2='5' y2='10' stroke='%23000' stroke-width='0.3' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundSize: '10px 10px',
        }}
      />

      {/* Top & bottom border stitch marks */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--border)) 0px, hsl(var(--border)) 4px, transparent 4px, transparent 10px)',
      }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{
        backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--border)) 0px, hsl(var(--border)) 4px, transparent 4px, transparent 10px)',
      }} />

      <svg
        viewBox={`0 0 ${SVG_WIDTH} 80`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="st-needle-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(210, 20%, 94%)" />
            <stop offset="40%" stopColor="hsl(215, 16%, 70%)" />
            <stop offset="100%" stopColor="hsl(215, 20%, 45%)" />
          </linearGradient>
          <filter id="st-needle-drop" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0.5" dy="1.5" stdDeviation="1.5" floodOpacity="0.4" floodColor="hsl(209, 30%, 8%)" />
          </filter>
          <radialGradient id="st-hole-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(20, 10%, 8%)" />
            <stop offset="60%" stopColor="hsl(20, 10%, 15%)" />
            <stop offset="100%" stopColor="hsl(20, 10%, 25%)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Guide path (faint) */}
        <path
          d={stitchPath}
          stroke="hsl(var(--border))"
          strokeWidth="1"
          strokeDasharray="2 5"
          strokeLinecap="round"
          opacity="0.25"
        />

        {/* Thread (revealed on scroll) */}
        <motion.path
          d={stitchPath}
          stroke="hsl(12, 76%, 52%)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={pathLength}
          style={{ strokeDashoffset: dashOffset }}
        />

        {/* Stitch holes */}
        {holes.map((hole, i) => (
          <g key={i}>
            <circle cx={hole.x} cy={hole.y} r="4" fill="none" stroke="hsl(20, 8%, 30%)" strokeWidth="0.6" opacity="0.15" />
            <circle cx={hole.x} cy={hole.y} r="2.8" fill="none" stroke="hsl(20, 8%, 20%)" strokeWidth="0.5" opacity="0.2" />
            <circle cx={hole.x} cy={hole.y} r="1.8" fill="url(#st-hole-grad)" opacity="0.7" />
            <circle cx={hole.x - 0.5} cy={hole.y - 0.5} r="0.6" fill="hsl(40, 20%, 70%)" opacity="0.15" />
          </g>
        ))}

        {/* Needle */}
        <motion.g filter="url(#st-needle-drop)" style={{ x: needleX, y: needleY }}>
          <g transform="translate(13, 0)">
            <path
              d="M -3 -1.5 L 18 -0.8 Q 24 0 24 0 Q 24 0 18 0.8 L -3 1.5 Q -5 0 -3 -1.5 Z"
              fill="url(#st-needle-metal)"
              transform="translate(-12, 0)"
            />
            <ellipse cx="-13" cy="0" rx="2" ry="0.7" fill="hsl(209, 30%, 12%)" opacity="0.8" />
            <line x1="-10" y1="-0.6" x2="4" y2="-0.3" stroke="hsl(210, 20%, 88%)" strokeWidth="0.4" opacity="0.5" strokeLinecap="round" />
          </g>
        </motion.g>
      </svg>
    </div>
  );
};

export default StitchTransition;
