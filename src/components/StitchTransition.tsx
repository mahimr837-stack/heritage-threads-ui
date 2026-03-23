import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll } from 'framer-motion';

const HOLE_SPACING = 45;
const NUM_HOLES = 25;
const CENTER_Y = 40;
const SVG_HEIGHT = 80;
const SVG_WIDTH = 10 + (NUM_HOLES - 1) * HOLE_SPACING + 10;

const StitchTransition: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 90%', 'end 20%'],
  });

  const [pathLength, setPathLength] = useState(1);
  const dashOffset = useMotionValue(9999);
  const needleX = useMotionValue(10);
  const needleY = useMotionValue(CENTER_Y);
  const needleAngle = useMotionValue(0);

  const gradientScope = useId().replace(/:/g, '');
  const needleGradientId = `${gradientScope}-st-needle-metal`;
  const needleDropId = `${gradientScope}-st-needle-drop`;
  const holeGradientId = `${gradientScope}-st-hole-grad`;

  const holes = useMemo(
    () =>
      Array.from({ length: NUM_HOLES }, (_, i) => ({
        x: 10 + i * HOLE_SPACING,
        y: CENTER_Y,
      })),
    []
  );

  const stitchPath = useMemo(() => {
    let path = `M ${holes[0].x} ${holes[0].y}`;

    for (let i = 1; i < holes.length; i++) {
      const midX = (holes[i - 1].x + holes[i].x) / 2;
      const controlY = i % 2 === 1 ? CENTER_Y - 14 : CENTER_Y + 14;
      path += ` Q ${midX} ${controlY}, ${holes[i].x} ${holes[i].y}`;
    }

    return path;
  }, [holes]);

  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;

    if (!path || !svg) return;

    const totalLength = path.getTotalLength();
    setPathLength(totalLength);

    const updateNeedleAndThread = (progress: number) => {
      const clampedProgress = Math.max(0, Math.min(1, progress));
      const currentLength = clampedProgress * totalLength;
      const prevLength = Math.max(0, currentLength - 1.5);
      const nextLength = Math.min(totalLength, currentLength + 1.5);
      const point = path.getPointAtLength(currentLength);
      const prevPoint = path.getPointAtLength(prevLength);
      const nextPoint = path.getPointAtLength(nextLength);
      const scaleX = svg.clientWidth / SVG_WIDTH || 1;
      const scaleY = svg.clientHeight / SVG_HEIGHT || 1;
      const dx = (nextPoint.x - prevPoint.x) * scaleX;
      const dy = (nextPoint.y - prevPoint.y) * scaleY;

      dashOffset.set(totalLength - currentLength);
      needleX.set(point.x);
      needleY.set(point.y);
      needleAngle.set((Math.atan2(dy, dx) * 180) / Math.PI);
    };

    updateNeedleAndThread(scrollYProgress.get());
    const unsubscribe = scrollYProgress.on('change', updateNeedleAndThread);

    const handleResize = () => updateNeedleAndThread(scrollYProgress.get());
    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
  }, [dashOffset, needleAngle, needleX, needleY, scrollYProgress, stitchPath]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden pointer-events-none z-30"
      style={{ height: '80px' }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'hsl(var(--card))',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect width='10' height='10' fill='none'/%3E%3Cline x1='0' y1='0' x2='10' y2='0' stroke='%23000' stroke-width='0.3' opacity='0.04'/%3E%3Cline x1='0' y1='5' x2='10' y2='5' stroke='%23000' stroke-width='0.3' opacity='0.04'/%3E%3Cline x1='0' y1='0' x2='0' y2='10' stroke='%23000' stroke-width='0.3' opacity='0.03'/%3E%3Cline x1='5' y1='0' x2='5' y2='10' stroke='%23000' stroke-width='0.3' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundSize: '10px 10px',
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, hsl(var(--border)) 0px, hsl(var(--border)) 4px, transparent 4px, transparent 10px)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, hsl(var(--border)) 0px, hsl(var(--border)) 4px, transparent 4px, transparent 10px)',
        }}
      />

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={needleGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--background))" />
            <stop offset="45%" stopColor="hsl(var(--muted-foreground) / 0.7)" />
            <stop offset="100%" stopColor="hsl(var(--foreground) / 0.65)" />
          </linearGradient>
          <filter id={needleDropId} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow
              dx="0.5"
              dy="1.5"
              stdDeviation="1.5"
              floodOpacity="0.35"
              floodColor="hsl(var(--foreground))"
            />
          </filter>
          <radialGradient id={holeGradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--foreground) / 0.2)" />
            <stop offset="60%" stopColor="hsl(var(--foreground) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--foreground) / 0)" />
          </radialGradient>
        </defs>

        <path ref={pathRef} d={stitchPath} stroke="transparent" strokeWidth="0" fill="none" />

        <path
          d={stitchPath}
          stroke="hsl(var(--border))"
          strokeWidth="1"
          strokeDasharray="2 5"
          strokeLinecap="round"
          opacity="0.25"
        />

        <motion.path
          d={stitchPath}
          stroke="hsl(var(--primary))"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={pathLength}
          style={{ strokeDashoffset: dashOffset }}
        />

        {holes.map((hole, i) => (
          <g key={i}>
            <circle cx={hole.x} cy={hole.y} r="4" fill="none" stroke="hsl(var(--foreground) / 0.12)" strokeWidth="0.6" />
            <circle cx={hole.x} cy={hole.y} r="2.8" fill="none" stroke="hsl(var(--foreground) / 0.18)" strokeWidth="0.5" />
            <circle cx={hole.x} cy={hole.y} r="1.8" fill={`url(#${holeGradientId})`} opacity="0.7" />
            <circle cx={hole.x - 0.5} cy={hole.y - 0.5} r="0.6" fill="hsl(var(--background) / 0.25)" />
          </g>
        ))}

        <motion.g filter={`url(#${needleDropId})`} style={{ x: needleX, y: needleY, rotate: needleAngle }}>
          <g transform="translate(13, 0)">
            <path
              d="M -3 -1.5 L 18 -0.8 Q 24 0 24 0 Q 24 0 18 0.8 L -3 1.5 Q -5 0 -3 -1.5 Z"
              fill={`url(#${needleGradientId})`}
              transform="translate(-12, 0)"
            />
            <ellipse cx="-13" cy="0" rx="2" ry="0.7" fill="hsl(var(--foreground) / 0.75)" />
            <line
              x1="-10"
              y1="-0.6"
              x2="4"
              y2="-0.3"
              stroke="hsl(var(--background) / 0.7)"
              strokeWidth="0.4"
              strokeLinecap="round"
            />
          </g>
        </motion.g>
      </svg>
    </div>
  );
};

export default StitchTransition;
