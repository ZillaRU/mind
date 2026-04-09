import { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
}

export function useParticleCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  hueMin = 240,
  hueMax = 300
) {
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const createParticle = useCallback((width: number, height: number): Particle => {
    const hue = hueMin + Math.random() * (hueMax - hueMin);
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      size: Math.random() * 2 + 0.5,
      opacity: 0,
      hue,
      life: 0,
      maxLife: 200 + Math.random() * 300,
    };
  }, [hueMin, hueMax]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      timeRef.current++;

      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Fade in/out
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.1) {
          p.opacity = lifeRatio / 0.1;
        } else if (lifeRatio > 0.7) {
          p.opacity = (1 - lifeRatio) / 0.3;
        } else {
          p.opacity = 1;
        }
        p.opacity *= 0.6; // overall dimness

        // Remove dead particles
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Wrap around
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) {
          p.y = h + 10;
          return;
        }

        // Draw with glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `hsla(${p.hue}, 60%, 70%, ${p.opacity * 0.8})`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 50%, 50%, ${p.opacity * 0.3})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 40%, 30%, 0)`);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 80%, ${p.opacity})`;
        ctx.fill();
      }

      // Occasionally add new particles
      if (timeRef.current % 30 === 0 && particles.length < 80) {
        particles.push(createParticle(w, h));
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [canvasRef, createParticle]);
}
