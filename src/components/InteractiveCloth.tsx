import React, { useRef, useEffect } from 'react';

const InteractiveCloth: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const SPACING = window.innerWidth < 768 ? 25 : 35;
    const cols = Math.floor(width / SPACING) + 2;
    const rows = Math.floor(height / SPACING) + 2;
    const GRAVITY = 0.2;
    const FRICTION = 0.98;
    const MOUSE_RADIUS = 120;
    const MOUSE_FORCE = 1.5;

    const mouse = { x: -1000, y: -1000, px: -1000, py: -1000 };

    interface Point { x: number; y: number; ox: number; oy: number; pinned: boolean; }
    interface Constraint { p1: Point; p2: Point; length: number; }

    let points: Point[] = [];
    let constraints: Constraint[] = [];

    const initCloth = () => {
      points = [];
      constraints = [];
      const startX = (width - (cols - 1) * SPACING) / 2;
      const startY = -20;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          points.push({
            x: startX + x * SPACING,
            y: startY + y * SPACING,
            ox: startX + x * SPACING,
            oy: startY + y * SPACING,
            pinned: y === 0,
          });
        }
      }

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          if (x < cols - 1) constraints.push({ p1: points[i], p2: points[i + 1], length: SPACING });
          if (y < rows - 1) constraints.push({ p1: points[i], p2: points[i + cols], length: SPACING });
        }
      }
    };

    initCloth();

    let animId: number;

    const update = () => {
      for (const p of points) {
        if (p.pinned) continue;
        const vx = (p.x - p.ox) * FRICTION;
        const vy = (p.y - p.oy) * FRICTION;
        p.ox = p.x;
        p.oy = p.y;
        p.x += vx;
        p.y += vy + GRAVITY;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          const mx = mouse.x - mouse.px;
          const my = mouse.y - mouse.py;
          p.x += mx * force * 0.5 + (dx / dist) * force * MOUSE_FORCE;
          p.y += my * force * 0.5 + (dy / dist) * force * MOUSE_FORCE;
        }
        p.x += Math.sin(Date.now() * 0.001 + p.y * 0.05) * 0.15;
      }

      for (let i = 0; i < 4; i++) {
        for (const c of constraints) {
          const dx = c.p2.x - c.p1.x;
          const dy = c.p2.y - c.p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const diff = (c.length - dist) / dist;
          const ox = dx * diff * 0.5;
          const oy = dy * diff * 0.5;
          if (!c.p1.pinned) { c.p1.x -= ox; c.p1.y -= oy; }
          if (!c.p2.pinned) { c.p2.x += ox; c.p2.y += oy; }
        }
      }
      mouse.px = mouse.x;
      mouse.py = mouse.y;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      for (const c of constraints) {
        ctx.moveTo(c.p1.x, c.p1.y);
        ctx.lineTo(c.p2.x, c.p2.y);
      }
      ctx.strokeStyle = 'rgba(138, 154, 91, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const loop = () => {
      update();
      draw();
      animId = requestAnimationFrame(loop);
    };
    loop();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; };
    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    };
    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-10"
    />
  );
};

export default InteractiveCloth;
