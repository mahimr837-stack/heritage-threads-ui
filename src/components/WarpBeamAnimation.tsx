import React, { useEffect, useRef } from 'react';

const WarpBeamAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef(0);
  const targetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas!.parentElement;
      W = parent?.clientWidth || window.innerWidth;
      H = parent?.clientHeight || window.innerHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + 'px';
      canvas!.style.height = H + 'px';
      ctx!.scale(dpr, dpr);
    }

    function onScroll() {
      const el = canvas!.closest('section');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Progress from 0 to 1 as section scrolls through viewport
      const raw = 1 - (rect.bottom / (viewH + rect.height));
      targetRef.current = Math.max(0, Math.min(1, raw));
    }

    // Colors
    const STEEL = '#b8b4a8';
    const STEEL_HI = '#e8e4d8';
    const STEEL_LO = '#686460';
    const YARN = '#d4a862';
    const YARN_HI = '#f0c880';
    const YARN_LO = '#8a6830';
    const GOLD = '#c8943a';

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      const p = progressRef.current;
      const cx = W / 2;
      const cy = H / 2;

      // Beam parameters
      const beamRadius = Math.min(W, H) * 0.18;
      const beamWidth = W * 0.55;
      const yarnRadius = beamRadius * (1 - p * 0.5); // shrinks as "unrolled"

      // Draw beam end-caps (circles)
      const leftX = cx - beamWidth / 2;
      const rightX = cx + beamWidth / 2;

      // Yarn layers on beam (concentric arcs)
      const layers = 12;
      for (let i = layers; i >= 0; i--) {
        const r = beamRadius * 0.35 + (yarnRadius - beamRadius * 0.35) * (i / layers);
        const alpha = 0.08 + (i / layers) * 0.12;
        
        ctx.beginPath();
        ctx.ellipse(leftX, cy, r * 0.3, r, 0, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? YARN : YARN_LO;
        ctx.globalAlpha = alpha;
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(rightX, cy, r * 0.3, r, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Warp threads stretching across
      const threadCount = 40;
      const threadSpread = beamRadius * 1.6;
      
      for (let i = 0; i < threadCount; i++) {
        const t = i / (threadCount - 1);
        const yOff = (t - 0.5) * threadSpread;
        const baseY = cy + yOff;

        // Thread tension based on scroll progress
        const sag = Math.sin(t * Math.PI) * (1 - p) * 20;
        const wave = Math.sin(p * Math.PI * 4 + i * 0.5) * 2 * (1 - p);
        
        ctx.beginPath();
        ctx.moveTo(leftX, baseY);
        
        // Bezier curve for thread with sag
        const cp1x = cx - beamWidth * 0.15;
        const cp2x = cx + beamWidth * 0.15;
        ctx.bezierCurveTo(
          cp1x, baseY + sag + wave,
          cp2x, baseY + sag - wave,
          rightX, baseY
        );
        
        const threadAlpha = 0.06 + Math.abs(Math.sin(t * Math.PI)) * 0.14;
        ctx.strokeStyle = i % 3 === 0 ? YARN_HI : YARN;
        ctx.globalAlpha = threadAlpha;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Beam axle (horizontal bar)
      ctx.beginPath();
      ctx.moveTo(leftX, cy);
      ctx.lineTo(rightX, cy);
      ctx.strokeStyle = STEEL_LO;
      ctx.globalAlpha = 0.08;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Beam flanges (left and right discs)
      for (const bx of [leftX, rightX]) {
        // Outer ring
        ctx.beginPath();
        ctx.ellipse(bx, cy, beamRadius * 0.35, beamRadius, 0, 0, Math.PI * 2);
        ctx.strokeStyle = STEEL;
        ctx.globalAlpha = 0.12;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner ring
        ctx.beginPath();
        ctx.ellipse(bx, cy, beamRadius * 0.12, beamRadius * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = STEEL_HI;
        ctx.globalAlpha = 0.06;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Center hub
        ctx.beginPath();
        ctx.arc(bx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = STEEL;
        ctx.globalAlpha = 0.1;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Tension lines radiating from beam (decorative engineering marks)
      const markCount = 8;
      for (let i = 0; i < markCount; i++) {
        const angle = (i / markCount) * Math.PI * 2 + p * Math.PI * 0.5;
        const r1 = beamRadius * 1.05;
        const r2 = beamRadius * 1.15;

        for (const bx of [leftX, rightX]) {
          ctx.beginPath();
          ctx.moveTo(
            bx + Math.cos(angle) * r1 * 0.35,
            cy + Math.sin(angle) * r1
          );
          ctx.lineTo(
            bx + Math.cos(angle) * r2 * 0.35,
            cy + Math.sin(angle) * r2
          );
          ctx.strokeStyle = GOLD;
          ctx.globalAlpha = 0.06;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // Floating specs text (very subtle)
      ctx.font = '10px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = GOLD;
      ctx.globalAlpha = 0.08;
      ctx.textAlign = 'right';
      const specs = ['warp threads · 3,840', 'tension · ' + (p * 2.4).toFixed(1) + ' cN/tex', 'beam Ø 800 mm'];
      specs.forEach((s, i) => {
        ctx.fillText(s, W - 30, H - 40 + i * 16);
      });
      ctx.globalAlpha = 1;
    }

    function animate() {
      progressRef.current += (targetRef.current - progressRef.current) * 0.06;
      draw();
      rafRef.current = requestAnimationFrame(animate);
    }

    resize();
    onScroll();
    animate();

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default WarpBeamAnimation;
