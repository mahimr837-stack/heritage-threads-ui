import React from 'react';
import { motion } from 'framer-motion';
import PhulkariEmbroidery from './PhulkariEmbroidery';
import SewingMachineBlueprint from './SewingMachineBlueprint';
import DyeJars from './DyeJars';

const WovenShowcase: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
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

        {/* Phulkari Embroidery Animation (replaces old WovenTypography) */}
        <PhulkariEmbroidery />

        {/* Dye Jars Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 mb-16"
        >
          <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground text-center mb-8">
            Natural Dye Laboratory
          </h3>
          <DyeJars />
        </motion.div>

        {/* Animated Sewing Machine Blueprint */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto mt-12"
        >
          <SewingMachineBlueprint />
        </motion.div>
      </div>
    </section>
  );
};

export default WovenShowcase;
