import React, { useEffect, useRef } from 'react';

const WarpBeamAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
    let dpr = 1;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      const parent = canvas!.parentElement;
      W = parent?.clientWidth || window.innerWidth;
      H = parent?.clientHeight || window.innerHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + 'px';
      canvas!.style.height = H + 'px';
    }

    const STEEL = '#b8b4a8';
    const STEEL_HI = '#e8e4d8';
    const STEEL_LO = '#686460';
    const YARN = '#d4a862';
    const YARN_HI = '#f0c880';
    const YARN_LO = '#8a6830';
    const GOLD = '#c8943a';

    let startTime = performance.now();

    function draw(time: number) {
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const elapsed = (time - startTime) / 1000;
      // Slow oscillating progress for continuous animation
      const p = (Math.sin(elapsed * 0.3) + 1) / 2; // 0 to 1 oscillation

      const cx = W / 2;
      const cy = H / 2;

      const beamRadius = Math.min(W, H) * 0.22;
      const beamWidth = W * 0.6;
      const coreRadius = beamRadius * 0.3;
      const yarnRadius = coreRadius + (beamRadius - coreRadius) * (1 - p * 0.4);

      const leftX = cx - beamWidth / 2;
      const rightX = cx + beamWidth / 2;

      // Beam flanges (large discs at each end)
      for (const bx of [leftX, rightX]) {
        // Flange disc
        ctx.beginPath();
        ctx.ellipse(bx, cy, beamRadius * 0.4, beamRadius * 1.1, 0, 0, Math.PI * 2);
        ctx.strokeStyle = STEEL;
        ctx.globalAlpha = 0.15;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Flange inner ring
        ctx.beginPath();
        ctx.ellipse(bx, cy, beamRadius * 0.25, beamRadius * 0.7, 0, 0, Math.PI * 2);
        ctx.strokeStyle = STEEL_HI;
        ctx.globalAlpha = 0.08;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Radial spokes on flanges (rotating)
        const spokeCount = 6;
        for (let s = 0; s < spokeCount; s++) {
          const angle = (s / spokeCount) * Math.PI * 2 + elapsed * 0.4;
          ctx.beginPath();
          ctx.moveTo(
            bx + Math.cos(angle) * coreRadius * 0.4,
            cy + Math.sin(angle) * coreRadius
          );
          ctx.lineTo(
            bx + Math.cos(angle) * beamRadius * 0.38,
            cy + Math.sin(angle) * beamRadius * 1.05
          );
          ctx.strokeStyle = STEEL_LO;
          ctx.globalAlpha = 0.08;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // Center hub
        ctx.beginPath();
        ctx.arc(bx, cy, 5, 0, Math.PI * 2);
        ctx.fillStyle = STEEL_HI;
        ctx.globalAlpha = 0.15;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Yarn wound on beam (concentric layers)
      const layers = 16;
      for (let i = layers; i >= 0; i--) {
        const r = coreRadius + (yarnRadius - coreRadius) * (i / layers);
        const alpha = 0.06 + (i / layers) * 0.15;
        const color = i % 3 === 0 ? YARN_HI : i % 3 === 1 ? YARN : YARN_LO;

        // Left side yarn ellipse
        ctx.beginPath();
        ctx.ellipse(leftX, cy, r * 0.38, r, 0, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        // Right side yarn ellipse
        ctx.beginPath();
        ctx.ellipse(rightX, cy, r * 0.38, r, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Warp threads stretching between the two ends
      const threadCount = 50;
      const threadSpread = yarnRadius * 1.8;

      for (let i = 0; i < threadCount; i++) {
        const t = i / (threadCount - 1);
        const yOff = (t - 0.5) * threadSpread;
        const baseY = cy + yOff;

        // Dynamic wave motion
        const wave1 = Math.sin(elapsed * 2.0 + i * 0.3) * 3;
        const wave2 = Math.sin(elapsed * 1.2 + i * 0.7) * 2;
        const sag = Math.sin(t * Math.PI) * 12;

        ctx.beginPath();
        ctx.moveTo(leftX, baseY);

        const cp1x = cx - beamWidth * 0.2;
        const cp2x = cx + beamWidth * 0.2;
        ctx.bezierCurveTo(
          cp1x, baseY + sag + wave1,
          cp2x, baseY + sag + wave2,
          rightX, baseY
        );

        const threadAlpha = 0.04 + Math.abs(Math.sin(t * Math.PI)) * 0.12;
        ctx.strokeStyle = i % 4 === 0 ? YARN_HI : i % 4 === 2 ? YARN_LO : YARN;
        ctx.globalAlpha = threadAlpha;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Beam axle
      ctx.beginPath();
      ctx.moveTo(leftX, cy);
      ctx.lineTo(rightX, cy);
      ctx.strokeStyle = STEEL_LO;
      ctx.globalAlpha = 0.06;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Tension tick marks rotating around flanges
      const tickCount = 12;
      for (let i = 0; i < tickCount; i++) {
        const angle = (i / tickCount) * Math.PI * 2 + elapsed * 0.5;
        const r1 = beamRadius * 1.12;
        const r2 = beamRadius * 1.22;

        for (const bx of [leftX, rightX]) {
          ctx.beginPath();
          ctx.moveTo(bx + Math.cos(angle) * r1 * 0.4, cy + Math.sin(angle) * r1);
          ctx.lineTo(bx + Math.cos(angle) * r2 * 0.4, cy + Math.sin(angle) * r2);
          ctx.strokeStyle = GOLD;
          ctx.globalAlpha = 0.07;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // Subtle spec text
      ctx.font = '10px Georgia, serif';
      ctx.fillStyle = GOLD;
      ctx.globalAlpha = 0.06;
      ctx.textAlign = 'right';
      const tension = (1.2 + p * 1.2).toFixed(1);
      const specs = ['warp threads · 3,840 ends', `tension · ${tension} cN/tex`, 'beam Ø 800 mm'];
      specs.forEach((s, idx) => {
        ctx.fillText(s, W - 24, H - 36 + idx * 15);
      });
      ctx.globalAlpha = 1;
    }

    function animate(time: number) {
      draw(time);
      rafRef.current = requestAnimationFrame(animate);
    }

    resize();
    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
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
