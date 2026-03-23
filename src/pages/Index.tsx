import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import DepartmentGrid from '../components/DepartmentGrid';
import StatsSection from '../components/StatsSection';
import WovenShowcase from '../components/WovenShowcase';
import EventsSection from '../components/EventsSection';
import FooterSection from '../components/FooterSection';
import StitchTransition from '../components/StitchTransition';
import StitchingWave from '../components/StitchingWave';
import ScrollNeedleThread from '../components/ScrollNeedleThread';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Scroll-driven needle & thread animation */}
      <ScrollNeedleThread />

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

      {/* Decorative Stitching Wave along left side */}

      <Navbar />
      <HeroSection />

      <StitchTransition />

      <DepartmentGrid />

      <StitchTransition />

      <StatsSection />

      <StitchTransition />

      <WovenShowcase />

      <StitchTransition />

      {/* Events section with scattered dye jars */}
      <EventsSection />

      <FooterSection />
    </div>
  );
};

export default Index;
