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

      // Needle follows path
      tl.to(needleRef.current, {
        motionPath: {
          path: guideRef.current,
          align: guideRef.current,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        ease: 'none',
      }, 0);

      // Thread draws in sync
      tl.to(threadRef.current, {
        strokeDashoffset: 0,
        ease: 'none',
      }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // A horizontal sinusoidal stitch path across the width
  const stitchPath = `
    M 0 40
    C 30 10, 60 10, 90 40
    C 120 70, 150 70, 180 40
    C 210 10, 240 10, 270 40
    C 300 70, 330 70, 360 40
    C 390 10, 420 10, 450 40
    C 480 70, 510 70, 540 40
    C 570 10, 600 10, 630 40
    C 660 70, 690 70, 720 40
    C 750 10, 780 10, 810 40
    C 840 70, 870 70, 900 40
    C 930 10, 960 10, 990 40
    C 1020 70, 1050 70, 1080 40
  `;

  // Stitch hole positions (peaks and troughs of the sine wave)
  const holePositions = [
    { x: 0, y: 40 }, { x: 90, y: 40 }, { x: 180, y: 40 },
    { x: 270, y: 40 }, { x: 360, y: 40 }, { x: 450, y: 40 },
    { x: 540, y: 40 }, { x: 630, y: 40 }, { x: 720, y: 40 },
    { x: 810, y: 40 }, { x: 900, y: 40 }, { x: 990, y: 40 },
    { x: 1080, y: 40 },
  ];

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
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='8' height='8' fill='%233d2e1e' opacity='0.06'/%3E%3Crect x='0' y='0' width='4' height='1' fill='%23443322' opacity='0.04'/%3E%3Crect x='4' y='4' width='4' height='1' fill='%23443322' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '8px 8px',
        }}
      />

      {/* Top and bottom border stitching lines */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--border)) 0px, hsl(var(--border)) 6px, transparent 6px, transparent 12px)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--border)) 0px, hsl(var(--border)) 6px, transparent 6px, transparent 12px)',
        }}
      />

      <svg
        viewBox="0 0 1080 80"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="stitch-needle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(210, 20%, 92%)" />
            <stop offset="50%" stopColor="hsl(215, 16%, 62%)" />
            <stop offset="100%" stopColor="hsl(215, 20%, 40%)" />
          </linearGradient>
          <filter id="stitch-needle-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.35" floodColor="hsl(209, 30%, 10%)" />
          </filter>
        </defs>

        {/* Guide path (dotted) */}
        <path
          ref={guideRef}
          d={stitchPath}
          stroke="hsl(var(--border))"
          strokeWidth="1.5"
          strokeDasharray="3 6"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Thread drawn on scroll */}
        <path
          ref={threadRef}
          d={stitchPath}
          stroke="hsl(var(--terracotta, 12 76% 52%))"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Stitch holes */}
        {holePositions.map((pos, i) => (
          <g key={i}>
            <circle cx={pos.x} cy={pos.y} r="3" fill="hsl(var(--background))" opacity="0.6" />
            <circle cx={pos.x} cy={pos.y} r="1.5" fill="hsl(209, 30%, 15%)" opacity="0.3" />
          </g>
        ))}

        {/* Needle */}
        <g ref={needleRef} filter="url(#stitch-needle-shadow)">
          {/* Needle body — pointing right */}
          <path
            d="M -4 -2 Q -7 -2 -7 0 Q -7 2 -4 2 L 16 2 Q 22 0 22 0 Q 22 0 16 -2 Z"
            fill="url(#stitch-needle-grad)"
          />
          {/* Needle eye */}
          <line
            x1="-3" y1="0"
            x2="3" y2="0"
            stroke="hsl(209, 30%, 15%)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};

export default StitchTransition;
