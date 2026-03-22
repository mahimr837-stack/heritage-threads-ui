import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Phone, Mail } from 'lucide-react';

const FooterSection: React.FC = () => {
  return (
    <footer className="py-16 border-t border-border bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">BUTEX</span>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-xs">
              Bangladesh University of Textiles — South Asia's premier institution for textile engineering, technology & fashion design.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {['Academics', 'Research', 'Admissions', 'Campus Life', 'Library'].map((link) => (
                <a key={link} href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span className="font-body text-sm text-muted-foreground">92 Shaheed Tajuddin Ahmed Ave, Tejgaon, Dhaka 1208</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span className="font-body text-sm text-muted-foreground">+880 2-9116560</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span className="font-body text-sm text-muted-foreground">info@butex.edu.bd</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bangladesh University of Textiles. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
