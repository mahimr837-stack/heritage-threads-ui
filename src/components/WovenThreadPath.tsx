import React from 'react';
import { motion } from 'framer-motion';

interface WovenThreadPathProps {
  variant?: 'warp' | 'weft';
}

const WovenThreadPath: React.FC<WovenThreadPathProps> = ({ variant = 'warp' }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`thread-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(209, 30%, 26%)" stopOpacity="0" />
            <stop offset="30%" stopColor="hsl(209, 30%, 26%)" stopOpacity="0.08" />
            <stop offset="70%" stopColor="hsl(209, 30%, 26%)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(209, 30%, 26%)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {variant === 'warp' ? (
          <>
            {/* Vertical warp threads */}
            <motion.line
              x1="15%" y1="0" x2="15%" y2="100%"
              stroke={`url(#thread-${variant})`}
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
            <motion.line
              x1="85%" y1="0" x2="85%" y2="100%"
              stroke={`url(#thread-${variant})`}
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
            {/* Needle path - sinusoidal */}
            <motion.path
              d="M 50%,0 Q 55%,25% 50%,50% T 50%,100%"
              fill="none"
              stroke="hsl(43, 96%, 56%)"
              strokeWidth="1"
              strokeDasharray="6 8"
              opacity={0.15}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </>
        ) : (
          <>
            {/* Horizontal weft threads */}
            <motion.line
              x1="0" y1="20%" x2="100%" y2="20%"
              stroke={`url(#thread-${variant})`}
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
            <motion.line
              x1="0" y1="80%" x2="100%" y2="80%"
              stroke={`url(#thread-${variant})`}
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
          </>
        )}
      </svg>
    </div>
  );
};

export default WovenThreadPath;
