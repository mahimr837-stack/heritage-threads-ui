import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import DepartmentGrid from '../components/DepartmentGrid';
import StatsSection from '../components/StatsSection';
import WovenShowcase from '../components/WovenShowcase';
import EventsSection from '../components/EventsSection';
import FooterSection from '../components/FooterSection';
import ZipperTransition from '../components/ZipperTransition';
import DyeJars from '../components/DyeJars';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Parchment aged-edge texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[60] opacity-30"
        style={{
          background: `
            linear-gradient(to right, hsla(47, 40%, 70%, 0.4) 0%, transparent 3%, transparent 97%, hsla(47, 40%, 70%, 0.4) 100%),
            linear-gradient(to bottom, hsla(47, 40%, 70%, 0.3) 0%, transparent 2%, transparent 98%, hsla(47, 40%, 70%, 0.3) 100%)
          `,
        }}
      />

      <Navbar />
      <HeroSection />

      {/* Zipper unzip: Hero → Departments */}
      <ZipperTransition direction="unzip" />

      <DepartmentGrid />

      {/* Zipper transition: Departments → Stats */}
      <ZipperTransition direction="unzip" />

      <StatsSection />

      {/* Zipper transition: Stats → Showcase */}
      <ZipperTransition direction="unzip" />

      <WovenShowcase />

      {/* Zipper transition: Showcase → Events */}
      <ZipperTransition direction="unzip" />

      {/* Events section with scattered dye jars */}
      <EventsSection />

      <FooterSection />
    </div>
  );
};

export default Index;
