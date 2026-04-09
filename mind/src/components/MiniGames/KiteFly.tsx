import { useRef, useEffect, useCallback } from 'react';

const poems = [
  '风筝不知道线的另一头是你',
  '风来了就跟着走',
  '天空很大，不用飞到哪',
  '线还在，就还在',
  '有些自由是有方向的',
  '云在慢慢走',
  '你抬头的时候，世界也在看你',
  '今天的风，刚好',
];

interface Cloud { x: number; y: number; w: number; h: number; speed: number; opacity: number }
interface Bird { x: number; y: number; speed: number; wingPhase: number; size: number }

export default function KiteFly() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const mouse = mouseRef.current;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.getBoundingClientRect().width;
    const H = () => canvas.getBoundingClientRect().height;

    // Kite state
    const kite = { x: 0, y: 0, vx: 0, vy: 0, angle: 0 };

    // Tail segments (2 ribbons)
    const TAIL_LEN = 18;
    const tail1: { x: number; y: number }[] = [];
    const tail2: { x: number; y: number }[] = [];
    for (let i = 0; i < TAIL_LEN; i++) {
      tail1.push({ x: 0, y: 0 });
      tail2.push({ x: 0, y: 0 });
    }

    // Clouds
    const clouds: Cloud[] = [];
    for (let i = 0; i < 6; i++) {
      clouds.push({
        x: Math.random() * 1.4 - 0.2,
        y: 0.05 + Math.random() * 0.35,
        w: 60 + Math.random() * 100,
        h: 25 + Math.random() * 35,
        speed: 0.00005 + Math.random() * 0.0001,
        opacity: 0.3 + Math.random() * 0.4,
      });
    }

    // Birds
    const birds: Bird[] = [];
    for (let i = 0; i < 4; i++) {
      birds.push({
        x: Math.random(),
        y: 0.1 + Math.random() * 0.25,
        speed: 0.0002 + Math.random() * 0.0003,
        wingPhase: Math.random() * Math.PI * 2,
        size: 3 + Math.random() * 3,
      });
    }

    // Wind
    let windForce = 0;
    let windTarget = 0;
    let windChangeTimer = 0;

    // Poem
    let poem = poems[Math.floor(Math.random() * poems.length)];
    let poemOpacity = 0.5;
    let poemTimer = 0;

    // Init kite position
    const initKite = () => {
      const cw = W(), ch = H();
      kite.x = cw * 0.5;
      kite.y = ch * 0.3;
      mouse.x = cw * 0.5;
      mouse.y = ch * 0.25;
      for (const t of [...tail1, ...tail2]) { t.x = kite.x; t.y = kite.y; }
    };
    initKite();

    let prev = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - prev) / 16.67, 3);
      prev = now;
      const cw = W(), ch = H();
      const t = now * 0.001;
      const groundY = ch * 0.82;

      // Wind
      windChangeTimer += dt;
      if (windChangeTimer > 120 + Math.random() * 200) {
        windChangeTimer = 0;
        windTarget = (Math.random() - 0.5) * 0.4;
      }
      windForce += (windTarget - windForce) * 0.005 * dt;

      // Kite physics
      const anchorX = cw * 0.5;
      const anchorY = groundY;

      if (mouse.active) {
        const targetX = mouse.x;
        const targetY = Math.min(mouse.y, groundY - 40);
        kite.vx += (targetX - kite.x) * 0.018 * dt;
        kite.vy += (targetY - kite.y) * 0.018 * dt;
      } else {
        // Gentle auto-float
        kite.vx += (cw * 0.5 + Math.sin(t * 0.3) * 80 - kite.x) * 0.003 * dt;
        kite.vy += (ch * 0.3 + Math.sin(t * 0.2) * 40 - kite.y) * 0.003 * dt;
      }

      // Wind
      kite.vx += windForce * dt;
      // Gravity
      kite.vy += 0.03 * dt;
      // Damping
      kite.vx *= Math.pow(0.96, dt);
      kite.vy *= Math.pow(0.96, dt);

      kite.x += kite.vx * dt;
      kite.y += kite.vy * dt;

      // Keep in bounds
      kite.x = Math.max(30, Math.min(cw - 30, kite.x));
      kite.y = Math.max(30, Math.min(groundY - 30, kite.y));

      // Kite angle
      kite.angle += (Math.atan2(kite.vy, kite.vx) * 0.3 - kite.angle) * 0.05 * dt;

      // Update tails
      const updateTail = (tail: { x: number; y: number }[], offsetX: number) => {
        tail[0].x = kite.x + offsetX;
        tail[0].y = kite.y + 20;
        for (let i = 1; i < tail.length; i++) {
          const prev = tail[i - 1];
          const curr = tail[i];
          const dx = prev.x - curr.x;
          const dy = prev.y - curr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 8;
          if (dist > maxDist) {
            curr.x += (dx / dist) * (dist - maxDist);
            curr.y += (dy / dist) * (dist - maxDist);
          }
          // Wave
          curr.x += Math.sin(t * 3 + i * 0.6 + offsetX) * 0.4 * dt;
          curr.y += 0.15 * dt; // gravity on tail
        }
      };
      updateTail(tail1, -6);
      updateTail(tail2, 6);

      // ===== Draw =====
      ctx.clearRect(0, 0, cw, ch);

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, groundY);
      sky.addColorStop(0, '#4a7ab5');
      sky.addColorStop(0.4, '#6a9ac8');
      sky.addColorStop(0.7, '#8ab8d8');
      sky.addColorStop(1, '#b0d4e8');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, cw, groundY);

      // Sun glow (top right)
      const sunX = cw * 0.85, sunY = ch * 0.08;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 150);
      sunGlow.addColorStop(0, 'rgba(255,240,200,0.25)');
      sunGlow.addColorStop(0.5, 'rgba(255,230,180,0.08)');
      sunGlow.addColorStop(1, 'rgba(255,230,180,0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath(); ctx.arc(sunX, sunY, 150, 0, Math.PI * 2); ctx.fill();

      // Clouds
      for (const c of clouds) {
        c.x += c.speed * dt;
        if (c.x > 1.3) c.x = -0.3;
        const cx = c.x * cw, cy = c.y * ch;
        ctx.fillStyle = `rgba(255,255,255,${c.opacity})`;
        // Cloud shape: overlapping ellipses
        ctx.beginPath();
        ctx.ellipse(cx, cy, c.w * 0.5, c.h * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx - c.w * 0.25, cy + c.h * 0.1, c.w * 0.35, c.h * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + c.w * 0.3, cy + c.h * 0.05, c.w * 0.3, c.h * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Birds
      for (const b of birds) {
        b.x += b.speed * dt;
        b.wingPhase += 0.08 * dt;
        if (b.x > 1.2) { b.x = -0.1; b.y = 0.1 + Math.random() * 0.25; }
        const bx = b.x * cw, by = b.y * ch;
        const wing = Math.sin(b.wingPhase) * b.size;
        ctx.strokeStyle = 'rgba(40,50,60,0.3)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(bx - b.size, by + wing);
        ctx.quadraticCurveTo(bx - b.size * 0.3, by - Math.abs(wing) * 0.3, bx, by);
        ctx.quadraticCurveTo(bx + b.size * 0.3, by - Math.abs(wing) * 0.3, bx + b.size, by + wing);
        ctx.stroke();
      }

      // Ground / hills
      const hillGrad = ctx.createLinearGradient(0, groundY - 20, 0, ch);
      hillGrad.addColorStop(0, '#6aaa5a');
      hillGrad.addColorStop(0.3, '#5a9a4a');
      hillGrad.addColorStop(1, '#4a8a3a');
      ctx.fillStyle = hillGrad;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      // Rolling hills
      for (let x = 0; x <= cw; x += 5) {
        const y = groundY + Math.sin(x * 0.008) * 12 + Math.sin(x * 0.003 + 1) * 8;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(cw, ch); ctx.lineTo(0, ch); ctx.closePath(); ctx.fill();

      // Grass blades
      ctx.strokeStyle = 'rgba(70,140,60,0.3)';
      ctx.lineWidth = 1;
      for (let x = 0; x < cw; x += 12) {
        const baseY = groundY + Math.sin(x * 0.008) * 12 + Math.sin(x * 0.003 + 1) * 8;
        const sway = Math.sin(t * 1.5 + x * 0.05) * 3 + windForce * 15;
        ctx.beginPath();
        ctx.moveTo(x, baseY);
        ctx.quadraticCurveTo(x + sway, baseY - 8, x + sway * 1.2, baseY - 12 - Math.random() * 5);
        ctx.stroke();
      }

      // String
      ctx.strokeStyle = 'rgba(80,70,60,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(anchorX, anchorY);
      // Catenary-like curve
      const midX = (anchorX + kite.x) / 2 + windForce * 30;
      const midY = (anchorY + kite.y) / 2 + 20;
      ctx.quadraticCurveTo(midX, midY, kite.x, kite.y);
      ctx.stroke();

      // Kite body
      ctx.save();
      ctx.translate(kite.x, kite.y);
      ctx.rotate(kite.angle);

      const kw = 22, kh = 28;
      // Upper left
      ctx.beginPath();
      ctx.moveTo(0, -kh);
      ctx.lineTo(-kw, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = '#a090ff';
      ctx.fill();
      // Upper right
      ctx.beginPath();
      ctx.moveTo(0, -kh);
      ctx.lineTo(kw, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = '#80c0ff';
      ctx.fill();
      // Lower left
      ctx.beginPath();
      ctx.moveTo(0, kh);
      ctx.lineTo(-kw, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = '#80c0ff';
      ctx.fill();
      // Lower right
      ctx.beginPath();
      ctx.moveTo(0, kh);
      ctx.lineTo(kw, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = '#ffe0b8';
      ctx.fill();

      // Cross spars
      ctx.strokeStyle = 'rgba(60,50,40,0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -kh); ctx.lineTo(0, kh);
      ctx.moveTo(-kw, 0); ctx.lineTo(kw, 0);
      ctx.stroke();

      // Kite outline
      ctx.strokeStyle = 'rgba(60,50,40,0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -kh); ctx.lineTo(-kw, 0); ctx.lineTo(0, kh); ctx.lineTo(kw, 0); ctx.closePath();
      ctx.stroke();

      ctx.restore();

      // Tails
      const drawTail = (tail: { x: number; y: number }[], color: string) => {
        if (tail.length < 2) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tail[0].x, tail[0].y);
        for (let i = 1; i < tail.length; i++) {
          ctx.lineTo(tail[i].x, tail[i].y);
        }
        ctx.stroke();
        // Ribbon width variation
        for (let i = 0; i < tail.length - 1; i++) {
          const width = 2.5 - (i / tail.length) * 1.5;
          ctx.strokeStyle = color;
          ctx.lineWidth = width;
          ctx.beginPath();
          ctx.moveTo(tail[i].x, tail[i].y);
          ctx.lineTo(tail[i + 1].x, tail[i + 1].y);
          ctx.stroke();
        }
      };
      drawTail(tail1, 'rgba(160,144,255,0.6)');
      drawTail(tail2, 'rgba(255,200,140,0.6)');

      // Small flowers on ground
      const flowerSeed = 42;
      let fs = flowerSeed;
      const frand = () => { fs = (fs * 16807) % 2147483647; return (fs - 1) / 2147483646; };
      for (let i = 0; i < 20; i++) {
        const fx = frand() * cw;
        const fBaseY = groundY + Math.sin(fx * 0.008) * 12 + Math.sin(fx * 0.003 + 1) * 8;
        const fy = fBaseY + 2 + frand() * 8;
        const fr = 1.5 + frand() * 1.5;
        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fillStyle = frand() < 0.5 ? 'rgba(255,220,180,0.4)' : 'rgba(220,180,255,0.35)';
        ctx.fill();
      }

      // Poem
      poemTimer += dt;
      if (poemTimer > 600 && poemOpacity <= 0) {
        poem = poems[Math.floor(Math.random() * poems.length)];
        poemOpacity = 0; poemTimer = 0;
      }
      if (poemOpacity > 0 || poemTimer < 60) {
        if (poemTimer < 60) poemOpacity = Math.min(poemOpacity + 0.006 * dt, 0.5);
        else if (poemTimer > 400) poemOpacity -= 0.005 * dt;
        if (poemOpacity > 0) {
          ctx.font = '15px system-ui, -apple-system, "PingFang SC", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(40,50,70,${Math.max(0, poemOpacity)})`;
          ctx.fillText(poem, cw / 2, ch * 0.92);
        }
      }

      // Custom cursor: wind swirl
      if (mouse.active) {
        const wx = mouse.x, wy = mouse.y;
        // Wind lines
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        for (let i = 0; i < 3; i++) {
          const angle = t * 2 + i * (Math.PI * 2 / 3);
          const r = 10 + i * 4;
          ctx.beginPath();
          ctx.arc(wx, wy, r, angle, angle + 1.2);
          ctx.stroke();
        }
        // Center dot
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath(); ctx.arc(wx, wy, 2.5, 0, Math.PI * 2); ctx.fill();
        // Soft glow
        const wg = ctx.createRadialGradient(wx, wy, 0, wx, wy, 30);
        wg.addColorStop(0, 'rgba(255,255,255,0.06)');
        wg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = wg;
        ctx.beginPath(); ctx.arc(wx, wy, 30, 0, Math.PI * 2); ctx.fill();
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    const src = 'touches' in e ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ cursor: 'none' }}
      onMouseMove={(e) => { const p = getPos(e); mouseRef.current = { x: p.x, y: p.y, active: true }; }}
      onMouseLeave={() => { mouseRef.current.active = false; }}
      onTouchMove={(e) => { e.preventDefault(); const p = getPos(e); mouseRef.current = { x: p.x, y: p.y, active: true }; }}
      onTouchEnd={() => { mouseRef.current.active = false; }}
    />
  );
}
