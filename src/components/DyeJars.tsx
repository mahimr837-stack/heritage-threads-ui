import React from 'react';
import { motion } from 'framer-motion';

interface JarProps {
  title: string;
  subtitle: string;
  percentage: number;
  fillLevel: number; // translateY target (lower = more full)
  lightColor: string;
  darkColor: string;
  textColor: string;
  delay: number;
}

const Jar: React.FC<JarProps> = ({ title, subtitle, percentage, fillLevel, lightColor, darkColor, textColor, delay }) => {
  const jarMaskId = `jar-mask-${title.replace(/\s/g, '')}`;
  const waveId = `wave-${title.replace(/\s/g, '')}`;

  return (
    <div className="flex flex-col items-center w-40">
      <svg className="w-[120px] h-[160px]" viewBox="0 0 120 160" style={{ filter: 'drop-shadow(0 10px 10px hsla(209,30%,26%,0.1))' }}>
        <defs>
          <clipPath id={jarMaskId}>
            <path d="M 45,25 L 45,35 C 45,35 20,50 20,95 C 20,135 35,150 60,150 C 85,150 100,135 100,95 C 100,50 75,35 75,35 L 75,25 Z" />
          </clipPath>
        </defs>

        <g clipPath={`url(#${jarMaskId})`}>
          <motion.g
            initial={{ y: 160 }}
            whileInView={{ y: fillLevel }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 3, delay, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {/* Back wave */}
            <motion.path
              fill={lightColor}
              opacity={0.8}
              d="M 0,10 Q 25,0 50,10 T 100,10 T 150,10 T 200,10 L 200,150 L 0,150 Z"
              animate={{ x: [0, -100] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            {/* Front wave */}
            <motion.path
              fill={darkColor}
              d="M 0,15 Q 25,5 50,15 T 100,15 T 150,15 T 200,15 L 200,150 L 0,150 Z"
              animate={{ x: [0, -100] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            {/* Bubbles */}
            <circle cx="40" cy="50" r="2" fill="white" opacity={0.3}>
              <animate attributeName="cy" from="120" to="20" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="70" cy="80" r="1.5" fill="white" opacity={0.4}>
              <animate attributeName="cy" from="140" to="30" dur="3s" repeatCount="indefinite" />
            </circle>
          </motion.g>
        </g>

        {/* Glass body */}
        <path
          d="M 45,25 L 45,35 C 45,35 20,50 20,95 C 20,135 35,150 60,150 C 85,150 100,135 100,95 C 100,50 75,35 75,35 L 75,25"
          fill="hsla(0,0%,100%,0.05)"
          stroke="hsla(0,0%,100%,0.8)"
          strokeWidth="3"
        />
        {/* Left reflection */}
        <path d="M 25,95 C 25,120 35,142 50,145" fill="none" stroke="hsla(0,0%,100%,0.7)" strokeWidth="5" strokeLinecap="round" />
        {/* Right shadow */}
        <path d="M 95,95 C 95,120 85,142 70,145" fill="none" stroke="hsla(0,0%,0%,0.1)" strokeWidth="4" strokeLinecap="round" />
        {/* Top rim */}
        <ellipse cx="60" cy="25" rx="18" ry="4" fill="none" stroke="hsla(0,0%,100%,0.9)" strokeWidth="3" />
      </svg>

      <div className="text-center mt-4">
        <h3 className="font-display text-sm font-bold text-foreground">{title}</h3>
        <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{subtitle}</p>
        <div className="font-body text-lg font-bold mt-1" style={{ color: textColor }}>{percentage}%</div>
      </div>
    </div>
  );
};

const DyeJars: React.FC = () => {
  const jars: JarProps[] = [
    {
      title: 'Vat Dyeing',
      subtitle: 'Module 1',
      percentage: 85,
      fillLevel: 45,
      lightColor: 'hsl(209, 40%, 50%)',
      darkColor: 'hsl(209, 45%, 36%)',
      textColor: 'hsl(209, 45%, 36%)',
      delay: 0.2,
    },
    {
      title: 'Mordanting',
      subtitle: 'Module 2',
      percentage: 60,
      fillLevel: 75,
      lightColor: 'hsl(9, 55%, 50%)',
      darkColor: 'hsl(9, 60%, 35%)',
      textColor: 'hsl(9, 60%, 35%)',
      delay: 0.5,
    },
    {
      title: 'Color Fastness',
      subtitle: 'Module 3',
      percentage: 35,
      fillLevel: 115,
      lightColor: 'hsl(43, 80%, 52%)',
      darkColor: 'hsl(43, 75%, 40%)',
      textColor: 'hsl(43, 75%, 40%)',
      delay: 0.8,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="flex justify-around items-end flex-wrap gap-6 py-8 px-4 border-b-4 border-border relative"
    >
      {jars.map((jar) => (
        <Jar key={jar.title} {...jar} />
      ))}
    </motion.div>
  );
};

export default DyeJars;
