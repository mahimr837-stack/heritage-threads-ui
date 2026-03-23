import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

const StitchTransition: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const guideRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!guideRef.current || !threadRef.current || !needleRef.current || !containerRef.current) return;

      const pathLength = guideRef.current.getTotalLength();

      gsap.set(threadRef.current, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          end: 'bottom 15%',
          scrub: 0.8,
        },
      });

      tl.to(needleRef.current, {
        motionPath: {
          path: guideRef.current,
          align: guideRef.current,
          alignOrigin: [1, 0.5],
          autoRotate: true,
        },
        ease: 'none',
      }, 0);

      tl.to(threadRef.current, {
        strokeDashoffset: 0,
        ease: 'none',
      }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Real running stitch: needle goes DOWN through hole, travels under fabric, comes UP at next hole
  // Visible on top = straight stitch line, invisible underneath = gap
  // Holes are on the CENTER line (y=40). Thread goes: above-line stitch visible, then dips below briefly at each hole
  const HOLE_SPACING = 45;
  const NUM_HOLES = 25;
  const CENTER_Y = 40;

  // Generate hole positions along center line
  const holes = Array.from({ length: NUM_HOLES }, (_, i) => ({
    x: 10 + i * HOLE_SPACING,
    y: CENTER_Y,
  }));

  // Build a running-stitch path: the thread pierces DOWN at odd holes, comes UP at even holes
  // Visible stitch on top of fabric between pairs, hidden underneath between pairs
  let stitchPath = `M ${holes[0].x} ${holes[0].y}`;
  for (let i = 1; i < holes.length; i++) {
    if (i % 2 === 1) {
      // Visible stitch on top: slight arc upward between holes
      const midX = (holes[i - 1].x + holes[i].x) / 2;
      stitchPath += ` Q ${midX} ${CENTER_Y - 14}, ${holes[i].x} ${holes[i].y}`;
    } else {
      // Hidden stitch underneath: slight arc downward (will be shown as dotted/faint)
      const midX = (holes[i - 1].x + holes[i].x) / 2;
      stitchPath += ` Q ${midX} ${CENTER_Y + 14}, ${holes[i].x} ${holes[i].y}`;
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden pointer-events-none z-30"
      style={{ height: '80px' }}
      aria-hidden="true"
    >
      {/* Fabric strip background with woven texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'hsl(var(--card))',
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect width='10' height='10' fill='none'/%3E%3Cline x1='0' y1='0' x2='10' y2='0' stroke='%23000' stroke-width='0.3' opacity='0.04'/%3E%3Cline x1='0' y1='5' x2='10' y2='5' stroke='%23000' stroke-width='0.3' opacity='0.04'/%3E%3Cline x1='0' y1='0' x2='0' y2='10' stroke='%23000' stroke-width='0.3' opacity='0.03'/%3E%3Cline x1='5' y1='0' x2='5' y2='10' stroke='%23000' stroke-width='0.3' opacity='0.03'/%3E%3C/svg%3E")
          `,
          backgroundSize: '10px 10px',
        }}
      />

      {/* Top border stitch marks */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--border)) 0px, hsl(var(--border)) 4px, transparent 4px, transparent 10px)',
      }} />
      {/* Bottom border stitch marks */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{
        backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--border)) 0px, hsl(var(--border)) 4px, transparent 4px, transparent 10px)',
      }} />

      <svg
        viewBox={`0 0 ${10 + (NUM_HOLES - 1) * HOLE_SPACING + 10} 80`}
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
          {/* Radial gradient for realistic puncture holes */}
          <radialGradient id="st-hole-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(20, 10%, 8%)" />
            <stop offset="60%" stopColor="hsl(20, 10%, 15%)" />
            <stop offset="100%" stopColor="hsl(20, 10%, 25%)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Guide path (faint dotted) */}
        <path
          ref={guideRef}
          d={stitchPath}
          stroke="hsl(var(--border))"
          strokeWidth="1"
          strokeDasharray="2 5"
          strokeLinecap="round"
          opacity="0.25"
        />

        {/* Thread (drawn on scroll) */}
        <path
          ref={threadRef}
          d={stitchPath}
          stroke="hsl(var(--terracotta, 12 76% 52%))"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Stitch holes — realistic puncture marks */}
        {holes.map((hole, i) => (
          <g key={i}>
            {/* Outer shadow ring — fabric pushed down around hole */}
            <circle
              cx={hole.x} cy={hole.y} r="4"
              fill="none"
              stroke="hsl(20, 8%, 30%)"
              strokeWidth="0.6"
              opacity="0.15"
            />
            {/* Fabric depression ring */}
            <circle
              cx={hole.x} cy={hole.y} r="2.8"
              fill="none"
              stroke="hsl(20, 8%, 20%)"
              strokeWidth="0.5"
              opacity="0.2"
            />
            {/* Dark puncture hole */}
            <circle
              cx={hole.x} cy={hole.y} r="1.8"
              fill="url(#st-hole-grad)"
              opacity="0.7"
            />
            {/* Tiny highlight on hole rim (light catching the edge) */}
            <circle
              cx={hole.x - 0.5} cy={hole.y - 0.5} r="0.6"
              fill="hsl(40, 20%, 70%)"
              opacity="0.15"
            />
          </g>
        ))}

        {/* Needle group */}
        <g ref={needleRef} filter="url(#st-needle-drop)">
          {/* Needle shaft — long tapered shape */}
          <path
            d="M -3 -1.5 L 18 -0.8 Q 24 0 24 0 Q 24 0 18 0.8 L -3 1.5 Q -5 0 -3 -1.5 Z"
            fill="url(#st-needle-metal)"
          />
          {/* Needle eye — elongated oval near the blunt end */}
          <ellipse
            cx="-1" cy="0" rx="2" ry="0.7"
            fill="hsl(209, 30%, 12%)"
            opacity="0.8"
          />
          {/* Subtle shine line along the shaft */}
          <line
            x1="2" y1="-0.6"
            x2="16" y2="-0.3"
            stroke="hsl(210, 20%, 88%)"
            strokeWidth="0.4"
            opacity="0.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};

export default StitchTransition;
