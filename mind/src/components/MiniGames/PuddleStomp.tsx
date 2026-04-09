import { useRef, useEffect, useCallback } from 'react';

interface Ripple { x: number; y: number; radius: number; opacity: number; speed: number }
interface Splash { x: number; y: number; vx: number; vy: number; r: number; opacity: number }
interface Puddle { x: number; y: number; rx: number; ry: number; depth: number }
interface Rain { x: number; y: number; speed: number; len: number; opacity: number }

const poems = [
  '踩下去，水会记住你的形状',
  '每一圈波纹都在说：你来过',
  '雨不知道自己在下',
  '水坑里有另一片天空',
  '有些事情就像涟漪',
  '扩散了，就消失了',
  '但消失不等于不存在',
  '你听，雨在说话',
  '地上的积水映着路灯',
  '像一小块掉落的天空',
];

export default function PuddleStomp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const state = useRef({
    ripples: [] as Ripple[],
    splashes: [] as Splash[],
    puddles: [] as Puddle[],
    rain: [] as Rain[],
    mouse: { x: -200, y: -200, active: false, inPuddle: false },
    poem: poems[0],
    poemOpacity: 0,
    poemTimer: 0,
    ready: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const s = state.current;

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

    if (!s.ready) {
      s.ready = true;
      const cw = W(), ch = H();
      const n = 7 + Math.floor(Math.random() * 6);
      for (let i = 0; i < n; i++) {
        s.puddles.push({
          x: 50 + Math.random() * (cw - 100),
          y: ch * 0.42 + Math.random() * ch * 0.52,
          rx: 30 + Math.random() * 100,
          ry: 10 + Math.random() * 30,
          depth: 0.3 + Math.random() * 0.7,
        });
      }
      for (let i = 0; i < 140; i++) {
        s.rain.push({
          x: Math.random() * cw * 1.2,
          y: Math.random() * ch,
          speed: 5 + Math.random() * 9,
          len: 10 + Math.random() * 28,
          opacity: 0.06 + Math.random() * 0.14,
        });
      }
      s.poem = poems[Math.floor(Math.random() * poems.length)];
      s.poemOpacity = 0.65;
    }

    let prev = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - prev) / 16.67, 3);
      prev = now;
      const cw = W(), ch = H();
      const t = now * 0.001;

      ctx.clearRect(0, 0, cw, ch);

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, ch * 0.48);
      sky.addColorStop(0, '#08081a');
      sky.addColorStop(1, '#12122a');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, cw, ch * 0.48);

      // Ground
      const gnd = ctx.createLinearGradient(0, ch * 0.38, 0, ch);
      gnd.addColorStop(0, '#18182a');
      gnd.addColorStop(0.4, '#141422');
      gnd.addColorStop(1, '#0c0c18');
      ctx.fillStyle = gnd;
      ctx.fillRect(0, ch * 0.38, cw, ch * 0.62);

      // Wet sheen
      ctx.fillStyle = 'rgba(80,100,140,0.025)';
      ctx.fillRect(0, ch * 0.38, cw, ch * 0.62);

      // Distant buildings silhouette
      ctx.fillStyle = '#0e0e1e';
      const baseY = ch * 0.42;
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      let bx = 0;
      while (bx < cw) {
        const bw = 15 + Math.random() * 40;
        const bh = 10 + Math.random() * 60;
        ctx.lineTo(bx, baseY - bh);
        ctx.lineTo(bx + bw, baseY - bh);
        bx += bw + Math.random() * 8;
      }
      ctx.lineTo(cw, baseY);
      ctx.closePath();
      ctx.fill();

      // Lit windows in buildings
      const winSeed = 42;
      let ws = winSeed;
      const wrand = () => { ws = (ws * 16807) % 2147483647; return (ws - 1) / 2147483646; };
      bx = 0;
      while (bx < cw) {
        const bw = 15 + wrand() * 40;
        const bh = 10 + wrand() * 60;
        for (let wy = baseY - bh + 6; wy < baseY - 4; wy += 8) {
          for (let wx = bx + 4; wx < bx + bw - 4; wx += 7) {
            if (wrand() < 0.3) {
              ctx.fillStyle = `rgba(255,220,140,${0.15 + wrand() * 0.2})`;
              ctx.fillRect(wx, wy, 3, 4);
            }
          }
        }
        bx += bw + wrand() * 8;
      }

      // Street lamp
      const lampX = cw * 0.18;
      const lampTop = ch * 0.12;
      ctx.strokeStyle = 'rgba(70,70,90,0.7)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(lampX, ch * 0.42);
      ctx.lineTo(lampX, lampTop + 18);
      ctx.quadraticCurveTo(lampX, lampTop + 5, lampX + 14, lampTop);
      ctx.stroke();
      // Glow
      const glow = ctx.createRadialGradient(lampX + 14, lampTop + 6, 0, lampX + 14, lampTop + 6, 150);
      glow.addColorStop(0, 'rgba(255,215,140,0.12)');
      glow.addColorStop(0.4, 'rgba(255,200,120,0.04)');
      glow.addColorStop(1, 'rgba(255,200,120,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(lampX + 14, lampTop + 6, 150, 0, Math.PI * 2);
      ctx.fill();
      // Bulb
      ctx.beginPath();
      ctx.arc(lampX + 14, lampTop + 6, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,230,170,0.85)';
      ctx.fill();

      // Puddles
      for (const p of s.puddles) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, Math.PI * 2);
        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.rx);
        pg.addColorStop(0, `rgba(70,90,130,${0.22 * p.depth})`);
        pg.addColorStop(0.7, `rgba(50,70,110,${0.15 * p.depth})`);
        pg.addColorStop(1, 'rgba(40,60,100,0.02)');
        ctx.fillStyle = pg;
        ctx.fill();

        // Shimmer
        ctx.beginPath();
        ctx.ellipse(p.x + Math.sin(t * 0.7 + p.x * 0.01) * 6, p.y - 1, p.rx * 0.45, p.ry * 0.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(130,150,190,${0.035 + Math.sin(t * 1.3 + p.y * 0.01) * 0.015})`;
        ctx.fill();

        // Lamp reflection
        const dl = Math.hypot(p.x - lampX, p.y - ch * 0.3);
        if (dl < 280) {
          const ro = Math.max(0, 0.08 * (1 - dl / 280));
          ctx.beginPath();
          ctx.ellipse(lampX + 14 - p.x + p.x, p.y, 6, 2.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,215,140,${ro})`;
          ctx.fill();
        }
        ctx.restore();
      }

      // Ripples
      for (let i = s.ripples.length - 1; i >= 0; i--) {
        const r = s.ripples[i];
        r.radius += r.speed * dt;
        r.opacity -= 0.007 * dt;
        if (r.opacity <= 0) { s.ripples.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.38, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(155,180,215,${r.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        if (r.radius > 10) {
          ctx.beginPath();
          ctx.ellipse(r.x, r.y, r.radius * 0.55, r.radius * 0.22, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(155,180,215,${r.opacity * 0.35})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // Splashes
      for (let i = s.splashes.length - 1; i >= 0; i--) {
        const sp = s.splashes[i];
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.vy += 0.12 * dt;
        sp.opacity -= 0.018 * dt;
        if (sp.opacity <= 0) { s.splashes.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155,180,215,${sp.opacity})`;
        ctx.fill();
      }

      // Rain
      for (const d of s.rain) {
        d.y += d.speed * dt;
        d.x -= 0.6 * dt;
        if (d.y > ch) {
          d.y = -d.len;
          d.x = Math.random() * cw * 1.2;
          for (const p of s.puddles) {
            const dx = (d.x - p.x) / p.rx;
            const dy = (d.y - p.y) / p.ry;
            if (dx * dx + dy * dy < 1 && Math.random() < 0.015) {
              s.ripples.push({ x: d.x, y: p.y, radius: 1, opacity: 0.18, speed: 0.7 });
            }
          }
        }
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 0.5, d.y + d.len);
        ctx.strokeStyle = `rgba(130,150,190,${d.opacity})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // Mouse → puddle interaction
      if (s.mouse.active) {
        const mx = s.mouse.x, my = s.mouse.y;
        let inAny = false;
        for (const p of s.puddles) {
          const dx = (mx - p.x) / p.rx;
          const dy = (my - p.y) / p.ry;
          if (dx * dx + dy * dy < 1) {
            inAny = true;
            if (Math.random() < 0.22) {
              s.ripples.push({
                x: mx + (Math.random() - 0.5) * 14,
                y: my + (Math.random() - 0.5) * 5,
                radius: 2,
                opacity: 0.45 + Math.random() * 0.3,
                speed: 1 + Math.random() * 0.6,
              });
            }
          }
        }
        if (inAny && !s.mouse.inPuddle) {
          for (let i = 0; i < 10; i++) {
            const a = Math.random() * Math.PI * 2;
            const sp = 1.2 + Math.random() * 3;
            s.splashes.push({
              x: mx, y: my,
              vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2.5,
              r: 1 + Math.random() * 2, opacity: 0.5 + Math.random() * 0.3,
            });
          }
        }
        s.mouse.inPuddle = inAny;

        // Cursor glow on puddle
        if (inAny) {
          const cg = ctx.createRadialGradient(mx, my, 0, mx, my, 30);
          cg.addColorStop(0, 'rgba(160,185,220,0.08)');
          cg.addColorStop(1, 'rgba(160,185,220,0)');
          ctx.fillStyle = cg;
          ctx.beginPath();
          ctx.arc(mx, my, 30, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Custom cursor: cat paw
      if (s.mouse.active) {
        const mx = s.mouse.x, my = s.mouse.y;
        // Paw pad
        ctx.fillStyle = `rgba(180,160,200,${s.mouse.inPuddle ? 0.7 : 0.45})`;
        ctx.beginPath(); ctx.ellipse(mx, my + 2, 7, 6, 0, 0, Math.PI * 2); ctx.fill();
        // Toe beans
        const beans = [[-6, -6], [0, -8], [6, -6], [-8, 0], [8, 0]];
        for (const [bx, by] of beans) {
          ctx.beginPath(); ctx.ellipse(mx + bx, my + by, 3.5, 3, 0, 0, Math.PI * 2); ctx.fill();
        }
        // Subtle glow
        const pg = ctx.createRadialGradient(mx, my, 0, mx, my, 25);
        pg.addColorStop(0, `rgba(180,160,220,${s.mouse.inPuddle ? 0.12 : 0.06})`);
        pg.addColorStop(1, 'rgba(180,160,220,0)');
        ctx.fillStyle = pg;
        ctx.beginPath(); ctx.arc(mx, my, 25, 0, Math.PI * 2); ctx.fill();
      }

      // Poem
      s.poemTimer += dt;
      if (s.poemTimer > 500 && s.poemOpacity <= 0) {
        s.poem = poems[Math.floor(Math.random() * poems.length)];
        s.poemOpacity = 0;
        s.poemTimer = 0;
      }
      if (s.poemOpacity > 0 || s.poemTimer < 60) {
        if (s.poemTimer < 60) s.poemOpacity = Math.min(s.poemOpacity + 0.008 * dt, 0.55);
        else if (s.poemTimer > 350) s.poemOpacity -= 0.006 * dt;
        if (s.poemOpacity > 0) {
          ctx.font = '15px system-ui, -apple-system, "PingFang SC", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(190,200,220,${Math.max(0, s.poemOpacity)})`;
          ctx.fillText(s.poem, cw / 2, ch * 0.1);
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    const touch = 'touches' in e;
    const src = touch ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ cursor: 'none' }}
      onMouseMove={(e) => { const p = getPos(e); state.current.mouse = { ...p, active: true, inPuddle: state.current.mouse.inPuddle }; }}
      onMouseLeave={() => { state.current.mouse.active = false; state.current.mouse.inPuddle = false; }}
      onTouchMove={(e) => { e.preventDefault(); const p = getPos(e); state.current.mouse = { ...p, active: true, inPuddle: state.current.mouse.inPuddle }; }}
      onTouchEnd={() => { state.current.mouse.active = false; state.current.mouse.inPuddle = false; }}
    />
  );
}
