import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import InteractiveCloth from './InteractiveCloth';

const VIDEO_URL = 'https://raw.githubusercontent.com/mahimr837-stack/butex/main/Gen-4%20Turbo%20a%20drone%20shot%203860136260.mp4';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-indigo-deep/60 z-[1]" style={{ backgroundColor: 'hsla(209, 30%, 26%, 0.65)' }} />

      {/* Interactive Cloth Physics */}
      <InteractiveCloth />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <span className="inline-block font-body text-sm font-semibold tracking-[0.2em] uppercase text-gold-thread mb-4"
                style={{ color: 'hsl(43, 96%, 56%)' }}>
            Bangladesh University of Textiles
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-6"
          style={{ color: '#F5F5DC' }}
        >
          Interweaving<br />
          <span style={{ color: 'hsl(9, 70%, 62%)' }}>Technology</span> & Tradition
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'hsla(60, 56%, 91%, 0.8)' }}
        >
          South Asia's premier institution for textile engineering & technology, 
          weaving innovation into every thread of education since 1921.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#departments"
            className="bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-body font-semibold text-base hover:opacity-90 transition-opacity active:scale-[0.97]"
          >
            Explore Departments
          </a>
          <a
            href="#stats"
            className="border-2 px-8 py-3.5 rounded-lg font-body font-semibold text-base transition-all active:scale-[0.97]"
            style={{ borderColor: 'hsla(60, 56%, 91%, 0.4)', color: '#F5F5DC' }}
          >
            Our Legacy
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <a href="#departments" className="animate-float inline-block">
            <ArrowDown size={28} style={{ color: 'hsla(60, 56%, 91%, 0.5)' }} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
