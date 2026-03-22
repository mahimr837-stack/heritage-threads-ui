import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers, Shirt, Droplets, Scissors, Cog, Cpu,
  Palette, Leaf, BarChart3, Zap, Factory, Globe,
} from 'lucide-react';

const departments = [
  { name: 'Yarn Engineering', desc: 'Spinning science, fiber technology & yarn production systems.', icon: Layers },
  { name: 'Fabric Engineering', desc: 'Weaving, knitting & nonwoven fabric design and analysis.', icon: Factory },
  { name: 'Wet Processing', desc: 'Dyeing, printing, finishing & sustainable chemical processes.', icon: Droplets },
  { name: 'Apparel Engineering', desc: 'Garment design, production management & quality control.', icon: Shirt },
  { name: 'Textile Machinery', desc: 'Design & maintenance of textile manufacturing machinery.', icon: Cog },
  { name: 'Industrial & Production', desc: 'Industrial engineering applied to textile manufacturing.', icon: BarChart3 },
  { name: 'Dyes & Chemical', desc: 'Textile chemistry, dye synthesis & color science.', icon: Palette },
  { name: 'Environmental Science', desc: 'Sustainability, waste management & eco-friendly textiles.', icon: Leaf },
  { name: 'Computer Science', desc: 'Software, AI & automation in textile industries.', icon: Cpu },
  { name: 'Electrical Engineering', desc: 'Power systems & electronics for textile automation.', icon: Zap },
  { name: 'Fashion Design', desc: 'Creative fashion, styling & trend forecasting.', icon: Scissors },
  { name: 'Textile Engineering Mgmt', desc: 'Business strategy, supply chain & global trade.', icon: Globe },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const DepartmentGrid: React.FC = () => {
  return (
    <section id="departments" className="py-24 md:py-32 bg-secondary/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-3 block">
            Academic Excellence
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground text-balance leading-tight">
            Departments & Disciplines
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">
            Twelve specialized departments, each a thread in the fabric of world-class textile education.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <motion.div
                key={dept.name}
                variants={cardVariants}
                className="group relative bg-card linen-texture rounded-xl p-6 border border-border hover:border-primary/40 transition-all duration-300 cursor-pointer"
                style={{
                  boxShadow: '0 2px 8px hsla(209, 30%, 26%, 0.06), 0 1px 3px hsla(209, 30%, 26%, 0.04)',
                }}
                whileHover={{
                  y: -4,
                  boxShadow: '0 8px 24px hsla(209, 30%, 26%, 0.1), 0 2px 6px hsla(209, 30%, 26%, 0.06)',
                }}
              >
                <div className="w-11 h-11 rounded-lg bg-accent/15 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-accent group-hover:text-primary transition-colors duration-300" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground mb-2">
                  {dept.name}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {dept.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default DepartmentGrid;
