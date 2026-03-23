import React from 'react';
import { motion } from 'framer-motion';

const PhulkariEmbroidery: React.FC = () => {
  // Letter paths for B-U-T-E-X
  const letters = [
    { id: 'b', d: 'M 45 20 V 100 M 45 20 H 70 Q 85 20 85 40 Q 85 60 70 60 H 45 M 45 60 H 73 Q 90 60 90 80 Q 90 100 73 100 H 45', delay: 0 },
    { id: 'u', d: 'M 110 20 V 75 Q 110 100 135 100 Q 160 100 160 75 V 20', delay: 1 },
    { id: 't', d: 'M 185 20 H 235 M 210 20 V 100', delay: 2 },
    { id: 'e', d: 'M 280 20 H 255 V 100 H 280 M 255 60 H 275', delay: 3 },
    { id: 'x', d: 'M 300 20 L 345 100 M 345 20 L 300 100', delay: 4 },
  ];

  // Phulkari geometric pattern elements
  const phulkariStitches = Array.from({ length: 24 }).map((_, i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    return (
      <motion.g
        key={`phulkari-${i}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.12, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
      >
        {/* Diamond stitch pattern */}
        <path
          d={`M ${45 + col * 40} ${15 + row * 40} l 6 6 l -6 6 l -6 -6 z`}
          fill="none"
          stroke="hsl(43, 96%, 56%)"
          strokeWidth="0.8"
        />
        <line
          x1={42 + col * 40} y1={21 + row * 40}
          x2={48 + col * 40} y2={21 + row * 40}
          stroke="hsl(9, 70%, 62%)"
          strokeWidth="0.5"
        />
      </motion.g>
    );
  });

  return (
    <div className="flex justify-center items-center w-full my-10 pointer-events-none">
      <svg
        viewBox="0 0 380 120"
        className="w-full max-w-3xl h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Phulkari thread gradient - warm silk colors */}
          <linearGradient id="phulkari-thread" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(9, 70%, 68%)" />
            <stop offset="40%" stopColor="hsl(9, 70%, 58%)" />
            <stop offset="100%" stopColor="hsl(9, 70%, 48%)" />
          </linearGradient>
          {/* Gold needle spark */}
          <linearGradient id="phulkari-spark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(43, 96%, 56%)" stopOpacity="0" />
            <stop offset="70%" stopColor="hsl(43, 96%, 56%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(60, 56%, 96%)" stopOpacity="1" />
          </linearGradient>
          {/* Fabric background pattern */}
          <pattern id="khadi-weave" width="8" height="8" patternUnits="userSpaceOnUse">
            <line x1="0" y1="4" x2="8" y2="4" stroke="hsl(47, 30%, 82%)" strokeWidth="0.3" opacity="0.4" />
            <line x1="4" y1="0" x2="4" y2="8" stroke="hsl(47, 30%, 82%)" strokeWidth="0.3" opacity="0.3" />
          </pattern>
          {/* Dashed border pattern for embroidery hoop */}
          <pattern id="running-stitch" width="12" height="1" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0.5" x2="6" y2="0.5" stroke="hsl(9, 70%, 62%)" strokeWidth="1.5" />
          </pattern>
        </defs>

        {/* Khadi fabric background */}
        <rect x="10" y="2" width="360" height="116" rx="4" fill="url(#khadi-weave)" opacity="0.6" />

        {/* Embroidery border - running stitch */}
        <motion.rect
          x="12" y="4" width="356" height="112" rx="3"
          fill="none"
          stroke="hsl(43, 96%, 56%)"
          strokeWidth="1.5"
          strokeDasharray="8 4"
          initial={{ strokeDashoffset: 100, opacity: 0 }}
          animate={{ strokeDashoffset: 0, opacity: 0.4 }}
          transition={{ duration: 3, ease: 'linear' }}
        />

        {/* Inner decorative border */}
        <motion.rect
          x="18" y="10" width="344" height="100" rx="2"
          fill="none"
          stroke="hsl(9, 70%, 62%)"
          strokeWidth="0.8"
          strokeDasharray="4 6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Phulkari background stitches */}
        {phulkariStitches}

        {/* Chalk trace / stencil */}
        {letters.map((letter) => (
          <motion.path
            key={`stencil-${letter.id}`}
            d={letter.d}
            fill="transparent"
            stroke="hsl(209, 30%, 26%)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="3 3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          />
        ))}

        {/* Main embroidered yarn strokes */}
        {letters.map((letter) => (
          <motion.path
            key={`yarn-${letter.id}`}
            d={letter.d}
            fill="transparent"
            stroke="url(#phulkari-thread)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 100, opacity: 1 }}
            transition={{
              duration: 2.5,
              delay: 1.2 + letter.delay * 0.35,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            style={{ filter: 'drop-shadow(0px 2px 2px hsla(209, 30%, 26%, 0.25))' }}
          />
        ))}

        {/* Highlight thread for 3D volume */}
        {letters.map((letter) => (
          <motion.path
            key={`highlight-${letter.id}`}
            d={letter.d}
            fill="transparent"
            stroke="hsl(9, 70%, 78%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 100, opacity: 0.5 }}
            transition={{
              duration: 2.5,
              delay: 1.22 + letter.delay * 0.35,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          />
        ))}

        {/* Golden needle spark following each letter */}
        {letters.map((letter) => (
          <motion.path
            key={`spark-${letter.id}`}
            d={letter.d}
            fill="transparent"
            stroke="url(#phulkari-spark)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 100, opacity: 0 }}
            transition={{
              duration: 2.5,
              delay: 1.2 + letter.delay * 0.35,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            style={{ filter: 'drop-shadow(0px 0px 5px hsla(43, 96%, 56%, 0.7))' }}
          />
        ))}

        {/* Animated needle that moves across */}
        <motion.g
          initial={{ x: 30, opacity: 1 }}
          animate={{
            x: [30, 95, 160, 230, 295, 360],
            opacity: [1, 1, 1, 1, 1, 0],
          }}
          transition={{ duration: 6, ease: 'linear', repeat: Infinity, repeatDelay: 1 }}
        >
          <motion.g
            animate={{ y: [-8, 5, -8], rotate: [8, -3, 8] }}
            transition={{ duration: 0.3, ease: 'easeInOut', repeat: Infinity }}
          >
            {/* Needle body */}
            <line x1="0" y1="55" x2="18" y2="45" stroke="hsl(209, 15%, 65%)" strokeWidth="2" strokeLinecap="round" />
            <polygon points="18,45 20,43 22,47" fill="hsl(209, 15%, 55%)" />
            {/* Needle eye */}
            <circle cx="3" cy="57" r="1.2" fill="none" stroke="hsl(209, 15%, 55%)" strokeWidth="0.8" />
            {/* Gold thread trailing */}
            <path d="M 3 57 Q -8 65 -15 58" fill="none" stroke="hsl(43, 96%, 56%)" strokeWidth="1" strokeLinecap="round" />
          </motion.g>
        </motion.g>

        {/* Corner embroidery motifs */}
        {[[22, 14], [352, 14], [22, 104], [352, 104]].map(([cx, cy], i) => (
          <motion.g
            key={`corner-${i}`}
            initial={{ opacity: 0, scale: 0, originX: cx, originY: cy }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
          >
            <path
              d={`M ${cx} ${cy - 5} l 5 5 l -5 5 l -5 -5 z`}
              fill="none"
              stroke="hsl(43, 96%, 56%)"
              strokeWidth="1"
            />
            <circle cx={cx} cy={cy} r="1.5" fill="hsl(9, 70%, 62%)" opacity="0.5" />
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

export default PhulkariEmbroidery;
