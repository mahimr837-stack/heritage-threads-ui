import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ZipperTransitionProps {
  direction?: 'unzip' | 'zip';
}

const ZipperTransition: React.FC<ZipperTransitionProps> = ({ direction = 'unzip' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // How far the teeth separate
  const separation = useTransform(
    scrollYProgress,
    direction === 'unzip' ? [0, 0.3, 0.7, 1] : [0, 0.3, 0.7, 1],
    direction === 'unzip' ? [0, 0, 1, 1] : [1, 1, 0, 0]
  );

  const topY = useTransform(separation, [0, 1], [0, -28]);
  const bottomY = useTransform(separation, [0, 1], [0, 28]);
  const opacity = useTransform(separation, [0, 0.5, 1], [0.8, 1, 0.8]);
  const sliderX = useTransform(scrollYProgress, [0, 1], ['5%', '95%']);

  const TEETH_COUNT = 28;

  return (
    <div ref={ref} className="relative h-16 w-full overflow-hidden z-30 pointer-events-none">
      {/* Tape top */}
      <motion.div
        className="absolute left-0 right-0 h-8"
        style={{
          y: topY,
          opacity,
          background: 'linear-gradient(to bottom, hsl(209, 30%, 22%), hsl(209, 30%, 18%))',
          borderBottom: '1px solid hsl(209, 30%, 30%)',
        }}
      />

      {/* Tape bottom */}
      <motion.div
        className="absolute left-0 right-0 h-8 bottom-0"
        style={{
          y: bottomY,
          opacity,
          background: 'linear-gradient(to top, hsl(209, 30%, 22%), hsl(209, 30%, 18%))',
          borderTop: '1px solid hsl(209, 30%, 30%)',
        }}
      />

      {/* Teeth */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full flex justify-around px-2">
          {Array.from({ length: TEETH_COUNT }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-0">
              <motion.div
                className="w-2 h-3 rounded-b-sm"
                style={{
                  y: topY,
                  backgroundColor: 'hsl(209, 15%, 30%)',
                  boxShadow: 'inset 0 0 2px hsla(0,0%,100%,0.08), 0 1px 3px hsla(0,0%,0%,0.5)',
                }}
              />
              <motion.div
                className="w-2 h-3 rounded-t-sm"
                style={{
                  y: bottomY,
                  backgroundColor: 'hsl(209, 15%, 30%)',
                  boxShadow: 'inset 0 0 2px hsla(0,0%,100%,0.08), 0 -1px 3px hsla(0,0%,0%,0.5)',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Slider mechanism */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 z-10"
        style={{ left: sliderX }}
      >
        <div
          className="w-10 h-7 rounded-sm flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, hsl(209, 15%, 25%), hsl(209, 15%, 15%))',
            border: '1px solid hsl(209, 15%, 35%)',
            boxShadow: '0 3px 10px hsla(0,0%,0%,0.6), inset 1px 1px 2px hsla(0,0%,100%,0.1)',
          }}
        >
          <div className="w-5 h-px" style={{ backgroundColor: 'hsl(209, 15%, 12%)' }} />
        </div>
        {/* Pull tab */}
        <div
          className="absolute -left-6 top-1/2 -translate-y-1/2 w-7 h-3 rounded-sm"
          style={{
            background: 'linear-gradient(to bottom, hsl(209, 15%, 22%), hsl(209, 15%, 12%))',
            border: '1px solid hsl(209, 15%, 32%)',
            boxShadow: '0 3px 6px hsla(0,0%,0%,0.5)',
          }}
        />
      </motion.div>
    </div>
  );
};

export default ZipperTransition;
