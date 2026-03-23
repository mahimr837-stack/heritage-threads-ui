import React from 'react';
import { motion } from 'framer-motion';
import PhulkariEmbroidery from './PhulkariEmbroidery';
import sewingMachineArt from '@/assets/sewing-machine-art.png';
import textileWomanArt from '@/assets/textile-woman-art.png';
import vogueWomanArt from '@/assets/vogue-woman-art.png';
import weaversTapestryArt from '@/assets/weavers-tapestry-art.png';

const WovenShowcase: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative sewing machine art - top left */}
      <motion.img
        src={sewingMachineArt}
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 0.18, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-6 left-6 w-36 md:w-52 pointer-events-none select-none z-0"
      />
      {/* Decorative textile woman art - top right */}
      <motion.img
        src={textileWomanArt}
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 0.18, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-6 right-6 w-36 md:w-52 pointer-events-none select-none z-0"
      />
      {/* Vogue woman art - left side */}
      <motion.img
        src={vogueWomanArt}
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 0.22, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 w-40 md:w-56 pointer-events-none select-none z-0"
      />
      {/* Weavers tapestry art - center */}
      <motion.img
        src={weaversTapestryArt}
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 0.12, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 pointer-events-none select-none z-0"
      />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-3 block">
            Crafted Identity
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground text-balance leading-tight">
            Woven Into Every Thread
          </h2>
        </motion.div>

        {/* Phulkari Embroidery Animation */}
        <PhulkariEmbroidery />
      </div>
    </section>
  );
};

export default WovenShowcase;
