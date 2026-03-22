import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import DepartmentGrid from '../components/DepartmentGrid';
import StatsSection from '../components/StatsSection';
import WovenShowcase from '../components/WovenShowcase';
import EventsSection from '../components/EventsSection';
import FooterSection from '../components/FooterSection';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <DepartmentGrid />
      <StatsSection />
      <WovenShowcase />
      <EventsSection />
      <FooterSection />
    </div>
  );
};

export default Index;
