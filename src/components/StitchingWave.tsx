import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

interface StitchingWaveProps {
  className?: string;
  scrub?: number | boolean;
}

const StitchingWave: React.FC<StitchingWaveProps> = ({
  className = "w-full max-w-[150px] opacity-80",
  scrub = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const guidePathRef = useRef<SVGPathElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const needleRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!guidePathRef.current || !threadRef.current || !needleRef.current || !containerRef.current) return;

      const pathLength = guidePathRef.current.getTotalLength();

      gsap.set(threadRef.current, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: scrub,
        },
      });

      tl.to(needleRef.current, {
        motionPath: {
          path: guidePathRef.current,
          align: guidePathRef.current,
          alignOrigin: [0.1, 0.5],
          autoRotate: true,
        },
        ease: "none",
      }, 0);

      tl.to(threadRef.current, {
        strokeDashoffset: 0,
        ease: "none",
      }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, [scrub]);

  const pathData = `
    M 100 50
    C 170 150, 170 250, 100 350
    C 30 450, 30 550, 100 650
    C 170 750, 170 850, 100 950
    C 30 1050, 30 1150, 100 1250
    C 170 1350, 170 1450, 100 1550
    C 30 1650, 30 1750, 100 1850
    C 170 1950, 170 2050, 100 2150
    C 30 2250, 30 2350, 100 2400
  `;

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <svg
        viewBox="0 0 200 2400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible"
      >
        <defs>
          <linearGradient id="silver-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(210, 40%, 96%)" />
            <stop offset="50%" stopColor="hsl(215, 16%, 62%)" />
            <stop offset="100%" stopColor="hsl(215, 20%, 37%)" />
          </linearGradient>
          <filter id="needle-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.25" floodColor="hsl(209, 30%, 10%)" />
          </filter>
        </defs>

        {/* Guide path */}
        <path
          ref={guidePathRef}
          d={pathData}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          strokeDasharray="4 8"
          strokeLinecap="round"
        />

        {/* Thread */}
        <path
          ref={threadRef}
          d={pathData}
          stroke="hsl(var(--terracotta))"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Needle */}
        <g id="needle" ref={needleRef} filter="url(#needle-shadow)">
          <path
            d="M 5 3 Q 2 3 2 5 Q 2 7 5 7 L 35 7 Q 45 5 45 5 Q 45 5 35 3 Z"
            fill="url(#silver-metal)"
          />
          <line
            x1="6" y1="5"
            x2="14" y2="5"
            stroke="hsl(209, 30%, 10%)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};

export default StitchingWave;
