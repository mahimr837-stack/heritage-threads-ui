import React, { useRef, useEffect } from 'react';

const SpacetimeCurvature: React.FC = () => {
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

    const influenceRadius = 500;
    const pullStrength = 0.88;
    const springK = 0.12;
    const friction = 0.80;

    const mouse = { x: width / 2, y: height / 2 };
    let autoMove = true;
    let time = 0;

    const spacing = width < 768 ? 22 : 16;
    const cols = Math.floor(width / spacing) + 2;
    const rows = Math.floor(height / spacing) + 2;

    interface Node { restX: number; restY: number; x: number; y: number; vx: number; vy: number; }

    let nodes: Node[][] = [];

    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < cols; i++) {
        nodes[i] = [];
        for (let j = 0; j < rows; j++) {
          const rx = (i - 1) * spacing;
          const ry = (j - 1) * spacing;
          nodes[i][j] = { restX: rx, restY: ry, x: rx, y: ry, vx: 0, vy: 0 };
        }
      }
    };

    initNodes();

    let animId: number;

    const animate = () => {
      if (autoMove) {
        time += 0.015;
        mouse.x = width / 2 + Math.cos(time) * (width * 0.3);
        mouse.y = height / 2 + Math.sin(time * 2) * (height * 0.2);
      }

      // Use heritage palette background - transparent to show section bg
      ctx.clearRect(0, 0, width, height);

      // Update physics
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const p = nodes[i][j];
          const dx = mouse.x - p.restX;
          const dy = mouse.y - p.restY;
          const distSq = dx * dx + dy * dy;
          const pull = Math.exp(-distSq / (influenceRadius * influenceRadius));
          const targetX = p.restX + dx * pull * pullStrength;
          const targetY = p.restY + dy * pull * pullStrength;
          p.vx += (targetX - p.x) * springK;
          p.vy += (targetY - p.y) * springK;
          p.vx *= friction;
          p.vy *= friction;
          p.x += p.vx;
          p.y += p.vy;
        }
      }

      // Draw grid with heritage colors
      ctx.lineWidth = 1.0;
      const gridGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, influenceRadius * 1.5);
      // Using indigo-deep tones
      gridGrad.addColorStop(0, 'hsla(209, 30%, 26%, 0.6)');
      gridGrad.addColorStop(0.15, 'hsla(209, 30%, 26%, 0.4)');
      gridGrad.addColorStop(0.4, 'hsla(85, 25%, 48%, 0.3)');
      gridGrad.addColorStop(0.8, 'hsla(47, 30%, 70%, 0.15)');
      gridGrad.addColorStop(1, 'hsla(47, 30%, 82%, 0.05)');
      ctx.strokeStyle = gridGrad;

      ctx.beginPath();
      for (let j = 0; j < rows; j++) {
        ctx.moveTo(nodes[0][j].x, nodes[0][j].y);
        for (let i = 1; i < cols; i++) {
          ctx.lineTo(nodes[i][j].x, nodes[i][j].y);
        }
      }
      for (let i = 0; i < cols; i++) {
        ctx.moveTo(nodes[i][0].x, nodes[i][0].y);
        for (let j = 1; j < rows; j++) {
          ctx.lineTo(nodes[i][j].x, nodes[i][j].y);
        }
      }
      ctx.stroke();

      // Draw dots at intersections
      ctx.fillStyle = 'hsla(209, 30%, 26%, 0.5)';
      for (let i = 0; i < cols; i += 2) {
        for (let j = 0; j < rows; j += 2) {
          const p = nodes[i][j];
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < influenceRadius * 0.6) {
            const dotSize = 1.5 * (1 - dist / (influenceRadius * 0.6));
            ctx.beginPath();
            ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      autoMove = false;
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      autoMove = false;
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
    canvas.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0"
    />
  );
};

export default SpacetimeCurvature;
