import React, { useEffect, useRef } from 'react';

const THREAD_COUNT = 240;

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }
function easeIO(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function easeO3(t: number) { return 1 - Math.pow(1 - t, 3); }
function mapRange(v: number, a: number, b: number, c: number, d: number) {
  return c + (d - c) * clamp((v - a) / (b - a), 0, 1);
}

interface Thread {
  t: number; bAngle: number; targetY: number;
  hue: number; sat: number; lig: number;
  thick: number; phase: number; speed: number;
}

function initThreads(): Thread[] {
  const threads: Thread[] = [];
  for (let i = 0; i < THREAD_COUNT; i++) {
    const t = i / (THREAD_COUNT - 1);
    threads.push({
      t,
      bAngle: lerp(-Math.PI * 0.42, Math.PI * 0.42, t),
      targetY: lerp(0.08, 0.92, t),
      hue: lerp(32, 42, Math.random()),
      sat: lerp(42, 58, Math.random()),
      lig: lerp(50, 72, Math.random()),
      thick: lerp(0.5, 1.4, Math.random()),
      phase: Math.random() * Math.PI * 2,
      speed: lerp(0.6, 1.4, Math.random()),
    });
  }
  return threads;
}

const WarpBeamAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, cx = 0, cy = 0;
    const threads = initThreads();
    let time = 0;
    // Use continuous time-based progress that oscillates
    let scrollP = 0;

    function resize() {
      const parent = canvas!.parentElement;
      W = parent?.clientWidth || window.innerWidth;
      H = parent?.clientHeight || window.innerHeight;
      canvas!.width = W;
      canvas!.height = H;
      canvas!.style.width = W + 'px';
      canvas!.style.height = H + 'px';
      cx = W / 2;
      cy = H / 2;
    }

    function getBeam() {
      const bx = cx * 0.32;
      const by = cy;
      const outerR = Math.min(W, H) * 0.175;
      const innerR = outerR * 0.58;
      return { bx, by, outerR, innerR };
    }

    function getLoomX() {
      return cx + W * 0.34;
    }

    function drawFlange(bx: number, by: number, outerR: number, rotation: number, alpha: number, brightness: number) {
      ctx!.save();
      ctx!.globalAlpha = alpha;
      ctx!.translate(bx, by);

      const discGrad = ctx!.createRadialGradient(-outerR * 0.2, -outerR * 0.25, 0, 0, 0, outerR);
      discGrad.addColorStop(0, `rgba(${Math.round(200 * brightness)},${Math.round(192 * brightness)},${Math.round(176 * brightness)},0.9)`);
      discGrad.addColorStop(0.4, `rgba(${Math.round(152 * brightness)},${Math.round(148 * brightness)},${Math.round(136 * brightness)},0.85)`);
      discGrad.addColorStop(0.85, `rgba(${Math.round(100 * brightness)},${Math.round(96 * brightness)},${Math.round(88 * brightness)},0.8)`);
      discGrad.addColorStop(1, `rgba(60,56,50,0.6)`);
      ctx!.fillStyle = discGrad;
      ctx!.beginPath(); ctx!.arc(0, 0, outerR, 0, Math.PI * 2); ctx!.fill();

      ctx!.strokeStyle = `rgba(${Math.round(220 * brightness)},${Math.round(215 * brightness)},${Math.round(200 * brightness)},0.5)`;
      ctx!.lineWidth = 2;
      ctx!.beginPath(); ctx!.arc(0, 0, outerR - 1, 0, Math.PI * 2); ctx!.stroke();

      const SPOKES = 8;
      for (let s = 0; s < SPOKES; s++) {
        const a = rotation + (s / SPOKES) * Math.PI * 2;
        const r0 = outerR * 0.12, r1 = outerR * 0.88;
        ctx!.strokeStyle = `rgba(${Math.round(80 * brightness)},${Math.round(78 * brightness)},${Math.round(72 * brightness)},0.7)`;
        ctx!.lineWidth = 2.5;
        ctx!.lineCap = 'round';
        ctx!.beginPath();
        ctx!.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
        ctx!.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx!.stroke();
        ctx!.strokeStyle = `rgba(${Math.round(180 * brightness)},${Math.round(175 * brightness)},${Math.round(160 * brightness)},0.2)`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(Math.cos(a) * r0 + 0.5, Math.sin(a) * r0 + 0.5);
        ctx!.lineTo(Math.cos(a) * r1 + 0.5, Math.sin(a) * r1 + 0.5);
        ctx!.stroke();
      }

      const BOLTS = 6;
      const boltR = outerR * 0.72;
      for (let b = 0; b < BOLTS; b++) {
        const a = rotation * 0.5 + (b / BOLTS) * Math.PI * 2;
        const bx2 = Math.cos(a) * boltR, by2 = Math.sin(a) * boltR;
        ctx!.fillStyle = `rgba(50,48,44,0.9)`;
        ctx!.beginPath(); ctx!.arc(bx2, by2, outerR * 0.038, 0, Math.PI * 2); ctx!.fill();
        ctx!.strokeStyle = `rgba(160,155,140,0.5)`; ctx!.lineWidth = 1;
        ctx!.beginPath(); ctx!.arc(bx2, by2, outerR * 0.038, 0, Math.PI * 2); ctx!.stroke();
      }

      const innerShadow = ctx!.createRadialGradient(0, 0, outerR * 0.5, 0, 0, outerR);
      innerShadow.addColorStop(0, 'transparent');
      innerShadow.addColorStop(1, 'rgba(6,4,2,0.4)');
      ctx!.fillStyle = innerShadow;
      ctx!.beginPath(); ctx!.arc(0, 0, outerR, 0, Math.PI * 2); ctx!.fill();

      ctx!.restore();
    }

    function drawBeamFull(bx: number, by: number, outerR: number, yarnR: number, rotation: number, p: number) {
      const establish = easeO3(clamp(p / 0.12, 0, 1));
      const flangeDepth = outerR * 0.18;

      drawFlange(bx - flangeDepth * 0.5, by, outerR, rotation, establish, 0.85);
      drawFlange(bx + flangeDepth * 0.5, by, outerR, rotation, establish, 1.0);

      ctx!.save();
      ctx!.globalAlpha = establish;
      const axleR = outerR * 0.08;
      const axleGrad = ctx!.createRadialGradient(bx - axleR * 0.3, by - axleR * 0.3, 0, bx, by, axleR);
      axleGrad.addColorStop(0, '#f0ece0');
      axleGrad.addColorStop(0.5, '#b8b4a8');
      axleGrad.addColorStop(1, '#505048');
      ctx!.fillStyle = axleGrad;
      ctx!.beginPath(); ctx!.arc(bx, by, axleR, 0, Math.PI * 2); ctx!.fill();
      ctx!.restore();

      if (yarnR > outerR * 0.1) {
        ctx!.save();
        ctx!.globalAlpha = establish * 0.9;
        const layers = 8;
        for (let l = layers; l >= 0; l--) {
          const lr = yarnR * (0.5 + l * 0.065);
          if (lr > yarnR) break;
          const lt = l / layers;
          ctx!.beginPath(); ctx!.arc(bx, by, lr, 0, Math.PI * 2);
          ctx!.strokeStyle = `hsl(${lerp(30, 40, lt)}, ${lerp(45, 55, lt)}%, ${lerp(40, 62, lt)}%)`;
          ctx!.lineWidth = yarnR * 0.065;
          ctx!.stroke();
        }
        const yarnSurfGrad = ctx!.createRadialGradient(bx - yarnR * 0.3, by - yarnR * 0.4, 0, bx, by, yarnR);
        yarnSurfGrad.addColorStop(0, 'rgba(240,200,128,0.35)');
        yarnSurfGrad.addColorStop(0.6, 'rgba(180,140,80,0.1)');
        yarnSurfGrad.addColorStop(1, 'rgba(100,70,30,0)');
        ctx!.fillStyle = yarnSurfGrad;
        ctx!.beginPath(); ctx!.arc(bx, by, yarnR, 0, Math.PI * 2); ctx!.fill();
        ctx!.restore();
      }
    }

    function drawThreads(bx: number, by: number, outerR: number, yarnR: number, beamRotation: number, loomX: number, p: number, unrollProgress: number) {
      const t0 = clamp(mapRange(p, 0.08, 0.22, 0, 1), 0, 1);
      if (t0 <= 0) return;

      threads.forEach((th, i) => {
        const threadStart = (i / THREAD_COUNT) * 0.35;
        const threadP = clamp((unrollProgress - threadStart) / (1 - threadStart * 0.5), 0, 1);
        if (threadP <= 0) return;

        const te = easeO3(threadP);
        const deptAngle = beamRotation * (1 + th.phase * 0.05) + th.bAngle;
        const deptX = bx + Math.cos(deptAngle) * yarnR;
        const deptY = by + Math.sin(deptAngle) * yarnR;

        const targetY = H * th.targetY;
        const endX = lerp(bx + Math.cos(deptAngle) * yarnR * 2.5, loomX, easeIO(te));
        const endY = lerp(by + Math.sin(deptAngle) * yarnR * 2.5, targetY, easeIO(te));

        const cpX = lerp(bx + Math.cos(deptAngle) * (outerR * 1.3), cx * 0.75, te);
        const cpY = lerp(deptY, (deptY + endY) * 0.5, te);

        const wave = te > 0.8 ? Math.sin(time * th.speed + th.phase) * 1.2 * (1 - te) * 3 : 0;
        const alpha = lerp(0, 0.82, easeO3(threadP)) * lerp(1, 0.7, Math.abs(th.t - 0.5) * 2);

        ctx!.save();
        ctx!.globalAlpha = alpha;
        ctx!.strokeStyle = `hsl(${th.hue},${th.sat}%,${th.lig}%)`;
        ctx!.lineWidth = th.thick * lerp(2.2, 1.0, te);
        ctx!.lineCap = 'round';
        ctx!.beginPath();
        ctx!.moveTo(deptX, deptY);
        ctx!.quadraticCurveTo(cpX, cpY, endX, endY + wave);
        ctx!.stroke();

        if (te > 0.5) {
          ctx!.globalAlpha = alpha * 0.25;
          ctx!.strokeStyle = `hsl(${th.hue + 5},${th.sat - 10}%,${th.lig + 18}%)`;
          ctx!.lineWidth = th.thick * 0.4;
          ctx!.stroke();
        }
        ctx!.restore();
      });
    }

    function drawReed(loomX: number, alpha: number, _p: number) {
      const reedH = H * 0.78;
      const reedY0 = cy - reedH / 2;
      const reedW = 18;

      ctx!.save();
      ctx!.globalAlpha = alpha;
      ctx!.fillStyle = 'rgba(100,95,85,0.9)';
      const frameH = 12;
      ctx!.fillRect(loomX - reedW / 2 - 2, reedY0 - frameH, reedW + 4, frameH);
      ctx!.fillRect(loomX - reedW / 2 - 2, reedY0 + reedH, reedW + 4, frameH);

      const DENTS = 48;
      for (let d = 0; d < DENTS; d++) {
        const dy = reedY0 + (d / (DENTS - 1)) * reedH;
        ctx!.fillStyle = d % 3 === 0 ? 'rgba(180,175,160,0.6)' : 'rgba(120,116,106,0.35)';
        ctx!.fillRect(loomX - 1, dy, 2, reedH / DENTS * 0.7);
      }

      ctx!.fillStyle = 'rgba(220,215,200,0.08)';
      ctx!.fillRect(loomX - reedW / 2, reedY0, reedW * 0.3, reedH);
      ctx!.restore();
    }

    function drawTensionGuides(bx: number, _by: number, loomX: number, _p: number, unrollProgress: number) {
      const alpha = Math.min(unrollProgress * 2, 1) * 0.12;
      [0.28, 0.5, 0.72].forEach(frac => {
        const y = H * frac;
        ctx!.save();
        ctx!.globalAlpha = alpha;
        ctx!.strokeStyle = 'rgba(200,148,58,0.5)';
        ctx!.lineWidth = 0.5;
        ctx!.setLineDash([4, 8]);
        ctx!.beginPath(); ctx!.moveTo(bx, y); ctx!.lineTo(loomX, y); ctx!.stroke();
        ctx!.restore();
      });
    }

    function drawFibreParticles(p: number, t: number) {
      if (p < 0.1) return;
      const alpha = Math.min((p - 0.1) * 3, 1) * 0.4;
      for (let i = 0; i < 18; i++) {
        const seed = i * 137.508;
        const px = ((seed * 0.37 + t * 0.015 * (i % 3 === 0 ? 1 : -1)) % 1) * W;
        const py = ((seed * 0.61 + t * 0.008) % 1) * H;
        const size = lerp(0.6, 2.2, seed % 1);
        ctx!.save();
        ctx!.globalAlpha = alpha * lerp(0.3, 0.8, (seed * 0.13) % 1);
        ctx!.fillStyle = `hsl(${35 + (seed % 12)},${40 + (seed % 18)}%,${65 + (seed % 15)}%)`;
        ctx!.beginPath(); ctx!.arc(px, py, size, 0, Math.PI * 2); ctx!.fill();
        ctx!.restore();
      }
    }

    function drawFrame() {
      ctx!.clearRect(0, 0, W, H);
      const p = scrollP;
      time += 0.016;

      const { bx, by, outerR, innerR } = getBeam();
      const loomX = getLoomX();

      // Background vignette
      const vg = ctx!.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
      vg.addColorStop(0, 'rgba(22,16,8,0)');
      vg.addColorStop(1, 'rgba(6,4,2,0.7)');
      ctx!.fillStyle = vg;
      ctx!.fillRect(0, 0, W, H);

      const unrollProgress = clamp(mapRange(p, 0.08, 0.9, 0, 1), 0, 1);
      const beamRotation = unrollProgress * Math.PI * 14;
      const yarnR = lerp(innerR, innerR * 0.35, easeIO(unrollProgress));

      drawBeamFull(bx, by, outerR, yarnR, beamRotation, p);
      drawThreads(bx, by, outerR, yarnR, beamRotation, loomX, p, unrollProgress);

      if (p > 0.6) {
        const reedAlpha = easeO3(mapRange(p, 0.6, 0.85, 0, 1));
        drawReed(loomX, reedAlpha, p);
      }

      if (p > 0.3 && p < 0.95) {
        drawTensionGuides(bx, by, loomX, p, unrollProgress);
      }

      drawFibreParticles(p, time);

      rafRef.current = requestAnimationFrame(drawFrame);
    }

    // Use time-based continuous animation (oscillates 0→1→0)
    function updateProgress() {
      // Slow continuous cycle so animation always runs
      scrollP = (Math.sin(time * 0.15) + 1) / 2;
    }

    // Override drawFrame to update scrollP from time
    const originalDrawFrame = drawFrame;
    const wrappedDrawFrame = () => {
      updateProgress();
      originalDrawFrame();
    };

    resize();
    // Kick off with wrapped version
    const startAnimation = () => {
      ctx!.clearRect(0, 0, W, H);
      updateProgress();
      time += 0.016;

      const p = scrollP;
      const { bx, by, outerR, innerR } = getBeam();
      const loomX = getLoomX();

      const vg = ctx!.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
      vg.addColorStop(0, 'rgba(22,16,8,0)');
      vg.addColorStop(1, 'rgba(6,4,2,0.7)');
      ctx!.fillStyle = vg;
      ctx!.fillRect(0, 0, W, H);

      const unrollProgress = clamp(mapRange(p, 0.08, 0.9, 0, 1), 0, 1);
      const beamRotation = unrollProgress * Math.PI * 14;
      const yarnR = lerp(innerR, innerR * 0.35, easeIO(unrollProgress));

      drawBeamFull(bx, by, outerR, yarnR, beamRotation, p);
      drawThreads(bx, by, outerR, yarnR, beamRotation, loomX, p, unrollProgress);

      if (p > 0.6) {
        const reedAlpha = easeO3(mapRange(p, 0.6, 0.85, 0, 1));
        drawReed(loomX, reedAlpha, p);
      }

      if (p > 0.3 && p < 0.95) {
        drawTensionGuides(bx, by, loomX, p, unrollProgress);
      }

      drawFibreParticles(p, time);

      rafRef.current = requestAnimationFrame(startAnimation);
    };

    rafRef.current = requestAnimationFrame(startAnimation);
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
