import React from 'react';
import { motion } from 'framer-motion';
import WovenTypography from '../components/WovenTypography';

const LOTTIE_URL = 'https://lottie.host/embed/861bb6ce-96c1-46b9-9ad8-b3f90df146d4/CCzk3CfSrd.lottie';

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

        <WovenTypography />

        {/* Lottie Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto mt-12"
        >
          <iframe
            src={LOTTIE_URL}
            className="w-full aspect-square border-0"
            title="Textile Lottie Animation"
            style={{ background: 'transparent' }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default WovenShowcase;
