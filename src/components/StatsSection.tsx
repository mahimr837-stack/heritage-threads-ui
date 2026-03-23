import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Building2, Globe2, Trophy } from 'lucide-react';
import WarpBeamAnimation from './WarpBeamAnimation';


const stats = [
  { label: 'Batches Graduated', value: 51, suffix: '+', icon: Trophy },
  { label: 'Departments', value: 12, suffix: '+', icon: Building2 },
  { label: 'Global Alumni', value: 25000, suffix: '+', icon: Globe2 },
  { label: 'Faculty Members', value: 380, suffix: '+', icon: Users },
];

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(value / (duration * 60));
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const StatsSection: React.FC = () => {
  return (
    <section id="stats" className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: 'hsl(209, 30%, 26%)' }}>
      {/* Subtle woven pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #F5F5DC 0px, #F5F5DC 1px, transparent 1px, transparent 8px),
                          repeating-linear-gradient(-45deg, #F5F5DC 0px, #F5F5DC 1px, transparent 1px, transparent 8px)`,
      }} />

      {/* Transparent Sewing Machine Blueprint Animation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none z-[1]">
        <SewingMachineBlueprint />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase mb-3 block"
                style={{ color: 'hsl(85, 25%, 48%)' }}>
            Our Heritage
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-balance leading-tight"
              style={{ color: '#F5F5DC' }}>
            A Century of Excellence
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                     style={{ backgroundColor: 'hsla(9, 70%, 62%, 0.15)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'hsl(9, 70%, 62%)' }} />
                </div>
                <div className="font-display text-3xl md:text-4xl font-bold mb-2"
                     style={{ color: '#F5F5DC' }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="font-body text-sm font-medium" style={{ color: 'hsla(60, 56%, 91%, 0.6)' }}>
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
