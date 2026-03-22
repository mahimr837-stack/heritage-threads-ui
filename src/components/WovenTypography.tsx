import React from 'react';
import { motion } from 'framer-motion';

const WovenTypography: React.FC = () => {
  const letterPaths = [
    "M 60 25 V 125 M 60 25 H 85 A 25 25 0 0 1 85 75 H 60 M 60 75 H 90 A 25 25 0 0 1 90 125 H 60",
    "M 130 25 V 95 A 30 30 0 0 0 190 95 V 25",
    "M 220 25 H 280 M 250 25 V 125",
    "M 350 25 H 300 V 125 H 350 M 300 75 H 340",
    "M 390 25 L 450 125 M 450 25 L 390 125",
  ];

  const warpLines = Array.from({ length: 45 }).map((_, i) => (
    <motion.line
      key={`warp-${i}`}
      x1={10 + i * 11} y1={0} x2={10 + i * 11} y2={150}
      stroke={i % 3 === 0 ? "rgba(218,165,32,0.12)" : "rgba(138,154,91,0.08)"}
      strokeWidth="1"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, delay: i * 0.02, ease: "easeInOut" }}
    />
  ));

  const weftLines = Array.from({ length: 15 }).map((_, i) => (
    <motion.line
      key={`weft-${i}`}
      x1={0} y1={8 + i * 10} x2={500} y2={8 + i * 10}
      stroke="rgba(46,64,87,0.06)"
      strokeWidth="1"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.4 + i * 0.04, ease: "easeInOut" }}
    />
  ));

  return (
    <div className="flex justify-center items-center w-full my-10 pointer-events-none">
      <svg viewBox="0 0 500 150" className="w-full max-w-4xl h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="silk-terracotta" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(9, 70%, 68%)" />
            <stop offset="50%" stopColor="hsl(9, 70%, 62%)" />
            <stop offset="100%" stopColor="hsl(9, 70%, 52%)" />
          </linearGradient>
          <linearGradient id="gold-spark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(43, 96%, 56%)" stopOpacity="0" />
            <stop offset="80%" stopColor="hsl(43, 96%, 56%)" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="loom-fade" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="loom-mask">
            <rect width="100%" height="100%" fill="url(#loom-fade)" />
          </mask>
        </defs>

        <g mask="url(#loom-mask)">{warpLines}{weftLines}</g>

        {letterPaths.map((path, i) => (
          <motion.path key={`trace-${i}`} d={path} fill="transparent"
            stroke="rgba(46, 64, 87, 0.15)" strokeWidth="1.5" strokeLinecap="round"
            strokeLinejoin="round" strokeDasharray="4 4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          />
        ))}

        {letterPaths.map((path, i) => (
          <motion.path key={`yarn-${i}`} d={path} fill="transparent"
            stroke="url(#silk-terracotta)" strokeWidth="7" strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, delay: 1.5 + i * 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ filter: "drop-shadow(0px 3px 3px rgba(0,0,0,0.25))" }}
          />
        ))}

        {letterPaths.map((path, i) => (
          <motion.path key={`highlight-${i}`} d={path} fill="transparent"
            stroke="hsl(9, 70%, 78%)" strokeWidth="1.5" strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 3, delay: 1.52 + i * 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          />
        ))}

        {letterPaths.map((path, i) => (
          <motion.path key={`spark-${i}`} d={path} fill="transparent"
            stroke="url(#gold-spark)" strokeWidth="4" strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: 0 }}
            transition={{ duration: 3, delay: 1.5 + i * 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ filter: "drop-shadow(0px 0px 6px hsla(43, 96%, 56%, 0.7))" }}
          />
        ))}
      </svg>
    </div>
  );
};

export default WovenTypography;
