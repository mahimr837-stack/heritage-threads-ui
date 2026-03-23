import React from 'react';
import { motion } from 'framer-motion';
import vcPortrait from '@/assets/vc-portrait.jpg';

const stats = [
  { num: '80%+', label: 'of national export earnings' },
  { num: '2010', label: 'Year BUTEX was established' },
  { num: '22 Dec', label: 'University founding date' },
];

const VCMessageSection: React.FC = () => {
  return (
    <section id="vc-message" className="py-16 md:py-24 bg-[hsl(42,45%,93%)] relative overflow-hidden">
      {/* Woven texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-100"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(160,130,60,0.04) 3px, rgba(160,130,60,0.04) 4px),
            repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(140,110,50,0.03) 3px, rgba(140,110,50,0.03) 4px)
          `,
          backgroundSize: '4px 4px',
        }}
      />

      <div className="container mx-auto px-6 relative z-[2] max-w-[1100px]">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pb-6 md:pb-8 border-b"
          style={{ borderColor: 'rgba(196,152,32,0.3)' }}
        >
          <span className="block text-[11px] font-semibold tracking-[0.32em] uppercase mb-2.5"
            style={{ color: '#b83018', fontFamily: "'Hind Siliguri', sans-serif" }}>
            Bangladesh University of Textiles
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-2xl md:text-4xl font-bold leading-tight"
          >
            Bangladesh University of{' '}
            <span style={{ color: '#b83018' }}>Textiles</span>
          </h2>
          <span className="block text-sm mt-1.5 tracking-wide"
            style={{ color: 'rgba(28,20,12,0.45)', fontFamily: "'Hind Siliguri', sans-serif" }}>
            বাংলাদেশ টেক্সটাইল বিশ্ববিদ্যালয়
          </span>
        </motion.header>

        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 md:gap-8 py-8 md:py-12"
        >
          {/* Ornament */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rotate-45" style={{ background: '#b83018' }} />
            <div className="w-px h-12 md:h-16" style={{ background: 'linear-gradient(to bottom, #b83018, rgba(196,152,32,0.3))' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c49820' }} />
          </div>
          <div>
            <span className="block text-[10px] font-semibold tracking-[0.35em] uppercase mb-2"
              style={{ color: '#8a6c10', fontFamily: "'Hind Siliguri', sans-serif" }}>
              Office of the Vice Chancellor
            </span>
            <h3 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-2xl md:text-4xl font-medium italic leading-tight text-[hsl(30,30%,8%)]">
              Message from the<br />Vice Chancellor
            </h3>
          </div>
        </motion.div>

        {/* Layout: Card + Message */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-[clamp(200px,28vw,300px)_1fr] gap-7 md:gap-14 items-start pb-12 md:pb-20"
        >
          {/* VC Card */}
          <div className="md:sticky md:top-6">
            <div className="relative">
              {/* Gold corner accents */}
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 z-[2]"
                style={{ borderColor: '#c49820' }} />
              <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 z-[2]"
                style={{ borderColor: '#c49820' }} />
              <div className="w-full aspect-[3/4] overflow-hidden border"
                style={{ borderColor: '#d8cca8', background: '#f0e8d4' }}>
                <img src={vcPortrait} alt="Vice Chancellor" className="w-full h-full object-cover object-top" />
              </div>
            </div>
            <h4 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-base md:text-lg font-semibold mt-4 leading-tight text-[hsl(30,30%,8%)]">
              Prof. Dr. Engr.<br />Md. Zulhash Uddin
            </h4>
            <p className="text-sm italic mt-1.5 leading-relaxed" style={{ color: '#b83018', fontFamily: "'Cormorant Garamond', serif" }}>
              Vice Chancellor<br />Bangladesh University of Textiles
            </p>
            <a href="mailto:vc@butex.edu.bd"
              className="inline-flex items-center gap-1.5 mt-3 text-xs tracking-wide no-underline pb-0.5 transition-colors duration-200 hover:text-[#b83018]"
              style={{ color: '#8a6c10', borderBottom: '1px solid rgba(138,108,16,0.3)', fontFamily: "'Hind Siliguri', sans-serif" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="2.5" width="10" height="7" rx="1" />
                <path d="M1 3.5l5 3.5 5-3.5" />
              </svg>
              vc@butex.edu.bd
            </a>
            {/* Thread decoration */}
            <div className="flex items-center gap-1.5 mt-5">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#c49820' }} />
              <div className="h-0.5 flex-1 rounded-sm" style={{ background: '#b83018', opacity: 0.6 }} />
              <div className="h-0.5 flex-1 rounded-sm" style={{ background: '#c49820', opacity: 0.5 }} />
              <div className="h-0.5 flex-1 rounded-sm" style={{ background: '#4a6878', opacity: 0.4 }} />
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#c49820' }} />
            </div>
          </div>

          {/* Message Body */}
          <div>
            <span className="block text-7xl md:text-8xl font-bold leading-none select-none mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: '#d8cca8' }}>"</span>

            <div className="text-base md:text-lg leading-[1.9]"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: '#2e2218' }}>
              <p className="mb-5 first-letter:float-left first-letter:text-5xl md:first-letter:text-6xl first-letter:font-bold first-letter:mr-2.5 first-letter:mt-1 first-letter:leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <span className="float-left text-5xl md:text-6xl font-bold mr-2.5 mt-1 leading-none"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#b83018' }}>E</span>
                ducation builds a strong foundation for a nation and technology based education is an essential for a country like ours. Textile engineering is a very prospective field of education in our country as textile, jute and Ready-Made Garments sector are the largest industrial sectors of our country.
              </p>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row gap-4 my-7">
                {stats.map((s) => (
                  <div key={s.label} className="flex-1 min-w-[120px] p-4 border relative overflow-hidden"
                    style={{ borderColor: '#b8a880', background: '#f0e8d4' }}>
                    <div className="absolute top-0 left-0 right-0 h-0.5"
                      style={{ background: 'linear-gradient(to right, #b83018, #c49820)' }} />
                    <span className="block text-2xl md:text-3xl font-bold leading-none"
                      style={{ fontFamily: "'Playfair Display', serif", color: '#b83018' }}>{s.num}</span>
                    <span className="block text-[10px] tracking-[0.12em] uppercase mt-1.5"
                      style={{ color: 'rgba(28,20,12,0.45)', fontFamily: "'Hind Siliguri', sans-serif" }}>{s.label}</span>
                  </div>
                ))}
              </div>

              <p className="mb-5">
                Textile, jute &amp; RMG sectors are also most important sectors for creating employment opportunity and socio-economic development of our country. Bangladesh University of Textiles started its journey on 22nd December 2010 by upgrading the College of Textile Technology, with a view to create new opportunities for higher studies, research and development in this sector.
              </p>

              {/* Pull quote */}
              <div className="my-7 py-4 px-5 md:px-6 italic text-lg md:text-xl leading-relaxed relative"
                style={{
                  borderLeft: '3px solid #b83018',
                  background: 'rgba(184,48,24,0.04)',
                  color: '#1c140c',
                }}>
                <div className="absolute top-0 right-0 bottom-0 w-px"
                  style={{ background: 'linear-gradient(to bottom, transparent, #c49820, transparent)', opacity: 0.3 }} />
                "I believe that Bangladesh University of Textiles will play a very remarkable role to upgrade textile education which will be compatible with the era of globalization."
              </div>

              <p className="mb-5">
                It is a thriving university which focuses on the generation and dissemination of knowledge and attaches equal importance to classroom teaching and research. It embraces global quality assurance mechanisms to boost the power and professionalism of the teaching and non-teaching staff with a view to ensuring quality education and research through the deployment of ICT facilities. New curriculum of international standard has been developed.
              </p>

              <p className="mb-5">
                On the way to internationalization, BUTEX looks forward to forming partnerships and fostering relationships with universities across the globe. We are making great strides in quest for quality culture and academic excellence. We are determined to transform our beloved BUTEX into a world class university — an ideal institution with international recognition that meets the requirements of our textile industry.
              </p>
            </div>

            {/* Regards */}
            <p className="italic text-sm md:text-base mt-8"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: 'rgba(28,20,12,0.45)' }}>
              With warm regards,
            </p>

            {/* Signature */}
            <div className="mt-9 pt-7 grid grid-cols-[auto_1fr] gap-6 items-center"
              style={{ borderTop: '1px solid rgba(196,152,32,0.3)' }}>
              <div className="w-[52px] h-[52px] border flex items-center justify-center rotate-45 shrink-0"
                style={{ borderColor: '#b8a880' }}>
                <div className="w-[34px] h-[34px] flex items-center justify-center"
                  style={{ background: '#b83018' }}>
                  <span className="-rotate-45 text-white text-[13px] font-bold tracking-wide"
                    style={{ fontFamily: "'Playfair Display', serif" }}>VC</span>
                </div>
              </div>
              <div>
                <div className="text-base md:text-lg font-semibold leading-tight text-[hsl(30,30%,8%)]"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  Prof. Dr. Engr. Md. Zulhash Uddin
                </div>
                <div className="text-sm italic mt-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: 'rgba(28,20,12,0.45)' }}>
                  Vice Chancellor
                </div>
                <div className="text-xs mt-1 tracking-wide"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif", color: '#8a6c10' }}>
                  Bangladesh University of Textiles · vc@butex.edu.bd
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VCMessageSection;
