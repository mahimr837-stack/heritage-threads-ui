import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, Bell, BookOpen } from 'lucide-react';

const notices = [
  {
    title: 'ICTSE 2026 International Conference',
    date: 'July 15-17, 2026',
    desc: 'International Conference on Textile Science & Engineering — call for papers now open.',
    tag: 'Conference',
    icon: BookOpen,
  },
  {
    title: 'Spring 2026 Admission Open',
    date: 'May 1, 2026',
    desc: 'Applications are now being accepted for B.Sc. in Textile Engineering programs.',
    tag: 'Admission',
    icon: Bell,
  },
  {
    title: 'Annual Textile Innovation Expo',
    date: 'August 22, 2026',
    desc: 'Showcasing student projects, industry partnerships & cutting-edge research.',
    tag: 'Event',
    icon: Calendar,
  },
  {
    title: 'Research Grant: Sustainable Fibers',
    date: 'Ongoing',
    desc: 'Funded research initiative for biodegradable textile fiber development.',
    tag: 'Research',
    icon: ExternalLink,
  },
];

const EventsSection: React.FC = () => {
  return (
    <section id="events" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3 block">
            Stay Updated
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground text-balance leading-tight">
            Notices & Events
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {notices.map((notice, i) => {
            const Icon = notice.icon;
            return (
              <motion.div
                key={notice.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group bg-card linen-texture rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-300 cursor-pointer"
                style={{
                  boxShadow: '0 2px 8px hsla(209, 30%, 26%, 0.05)',
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold tracking-wider uppercase bg-accent/15 text-accent px-2 py-0.5 rounded-full">
                        {notice.tag}
                      </span>
                      <span className="text-xs text-muted-foreground font-body">
                        {notice.date}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-300">
                      {notice.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                      {notice.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
