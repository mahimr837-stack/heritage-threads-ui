import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Volume2, VolumeX } from 'lucide-react';
import butexLogo from '@/assets/butex-logo.png';
import { toggleSound } from '@/hooks/usePianoSound';

const navLinks = [
  { label: 'Academics', href: '#departments' },
  { label: 'Research', href: '#stats' },
  { label: 'Admissions', href: '#events' },
  { label: 'Campus Life', href: '#events' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setIsSoundOn(newState);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-parchment/80 backdrop-blur-md shadow-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="#" className="flex items-center gap-3 group">
          <img src={butexLogo} alt="BUTEX Logo" className="w-10 h-10 object-contain" />
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            BUTEX
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-body text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={handleToggleSound}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-foreground/20 text-foreground/70 hover:text-primary hover:border-primary transition-all duration-300 active:scale-[0.97]"
            title={isSoundOn ? 'Sound Off' : 'Sound On'}
          >
            {isSoundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="text-xs">{isSoundOn ? 'Sound On' : 'Sound Off'}</span>
          </button>
          <a
            href="#events"
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]"
          >
            Apply Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground p-2 active:scale-95"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-parchment/95 backdrop-blur-md border-t border-border overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-base font-medium text-foreground/80 hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={handleToggleSound}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium border border-foreground/20 text-foreground/70 active:scale-[0.97]"
              >
                {isSoundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>{isSoundOn ? 'Sound On' : 'Sound Off'}</span>
              </button>
              <a
                href="#events"
                className="bg-primary text-primary-foreground px-5 py-3 rounded-lg text-sm font-semibold text-center"
              >
                Apply Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
