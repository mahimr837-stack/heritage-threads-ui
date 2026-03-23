import React, { useEffect, useRef } from 'react';

const ScrollNeedleThread: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const rafRef = useRef<number>(0);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      dimensionsRef.current = { width: w, height: h };
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.scale(dpr, dpr);
    }

    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      targetProgressRef.current = docHeight > 0 ? Math.max(0, Math.min(1, scrollTop / docHeight)) : 0;
    }

    function getPoint(t: number) {
      const { height } = dimensionsRef.current;
      const startY = 50;
      const endY = height - 120;
      const y = startY + t * (endY - startY);
      const waves = height / 100;
      const amplitude = 30;
      const centerX = 40;
      const x = centerX + Math.sin(t * Math.PI * waves) * amplitude;
      return { x, y };
    }

    function drawNeedle(x: number, y: number, angle: number) {
      if (!ctx) return;

      // Needle body — tip points forward (in direction of travel)
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      const nLen = 90;
      const nWidth = 6;

      // Draw needle with tip at top (positive direction of travel)
      // The needle tip leads, eye trails behind connecting to thread
      ctx.beginPath();
      ctx.moveTo(-nWidth / 2, 0);          // eye end (connects to thread)
      ctx.lineTo(-nWidth / 2 + 1, -nLen + 20); // shaft
      ctx.lineTo(0, -nLen);                 // sharp tip (leading edge)
      ctx.lineTo(nWidth / 2 - 1, -nLen + 20);
      ctx.lineTo(nWidth / 2, 0);
      ctx.arc(0, 0, nWidth / 2, 0, Math.PI, false);

      const grad = ctx.createLinearGradient(-nWidth / 2, 0, nWidth / 2, 0);
      grad.addColorStop(0, '#888');
      grad.addColorStop(0.3, '#ffffff');
      grad.addColorStop(0.7, '#aaa');
      grad.addColorStop(1, '#555');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Needle eye (at the base, near thread connection)
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.ellipse(0, -3, 1.2, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function draw() {
      if (!ctx) return;
      const { width, height } = dimensionsRef.current;
      ctx.clearRect(0, 0, width, height);

      const progress = progressRef.current;

      // Draw thread
      ctx.beginPath();
      ctx.strokeStyle = 'hsl(12, 76%, 52%)'; // terracotta
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;

      const steps = Math.max(2, Math.floor(progress * 400));
      const start = getPoint(0);
      ctx.moveTo(start.x, start.y);
      let currentPoint = start;

      for (let i = 1; i <= steps; i++) {
        const t = (i / steps) * progress;
        currentPoint = getPoint(t);
        ctx.lineTo(currentPoint.x, currentPoint.y);
      }
      ctx.stroke();

      // Reset shadows
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Needle — place it slightly ahead of the thread tip
      const tAhead = Math.min(1, progress + 0.012);
      const needlePos = getPoint(tAhead);
      const t1 = Math.max(0, tAhead - 0.002);
      const t2 = Math.min(1, tAhead + 0.002);
      const p1 = getPoint(t1);
      const p2 = getPoint(t2);
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) - Math.PI / 2;

      drawNeedle(needlePos.x, needlePos.y, angle);
    }

    function animate() {
      progressRef.current += (targetProgressRef.current - progressRef.current) * 0.08;
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
    <>
      {/* Seam line on left */}
      <div
        className="fixed top-0 left-10 w-0 h-screen z-[4] pointer-events-none"
        style={{ borderLeft: '2px dashed hsla(0, 0%, 100%, 0.08)' }}
      />
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-screen z-[5] pointer-events-none"
      />
    </>
  );
};

export default ScrollNeedleThread;
