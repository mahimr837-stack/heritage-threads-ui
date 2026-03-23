import React from 'react';
import { motion } from 'framer-motion';
import PhulkariEmbroidery from './PhulkariEmbroidery';

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

        {/* Phulkari Embroidery Animation */}
        <PhulkariEmbroidery />
      </div>
    </section>
  );
};

export default WovenShowcase;
