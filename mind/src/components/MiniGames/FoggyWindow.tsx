import { useRef, useEffect, useCallback } from 'react';

// Seeded PRNG — same day = same scene
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

const poems = [
  '窗外的世界一直在那里',
  '你擦开一点，它就露出一点',
  '冬天很安静',
  '雪不知道自己在落',
  '玻璃上的雾是呼吸留下的',
  '有些风景要慢慢才能看见',
  '远处的灯是谁家的',
  '树在等春天',
];

interface Snow { x: number; y: number; speed: number; r: number; drift: number; opacity: number }

export default function FoggyWindow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const mouseRef = useRef({ x: -200, y: -200, prevX: -200, prevY: -200, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const mouse = mouseRef.current;

    // Seed from today's date
    const d = new Date();
    const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    const rand = seeded(seed);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const W = () => canvas.getBoundingClientRect().width;
    const H = () => canvas.getBoundingClientRect().height;

    // Offscreen canvases
    const sceneCanvas = document.createElement('canvas');
    const sceneCtx = sceneCanvas.getContext('2d')!;
    const fogCanvas = document.createElement('canvas');
    const fogCtx = fogCanvas.getContext('2d')!;

    // Snow particles
    const snowflakes: Snow[] = [];
    for (let i = 0; i < 60; i++) {
      snowflakes.push({
        x: Math.random(), y: Math.random(),
        speed: 0.0003 + Math.random() * 0.0008,
        r: 1 + Math.random() * 2.5,
        drift: (Math.random() - 0.5) * 0.0003,
        opacity: 0.4 + Math.random() * 0.5,
      });
    }

    let poem = poems[Math.floor(rand() * poems.length)];
    let poemOpacity = 0.5;
    let poemTimer = 0;
    let fogReformTimer = 0;

    // Generate winter scene
    const drawScene = () => {
      const cw = W(), ch = H();
      sceneCanvas.width = cw;
      sceneCanvas.height = ch;
      fogCanvas.width = cw;
      fogCanvas.height = ch;
      const sc = sceneCtx;

      // Sky
      const sky = sc.createLinearGradient(0, 0, 0, ch * 0.6);
      sky.addColorStop(0, '#0a1628');
      sky.addColorStop(0.5, '#152540');
      sky.addColorStop(1, '#1e3050');
      sc.fillStyle = sky;
      sc.fillRect(0, 0, cw, ch);

      // Stars
      for (let i = 0; i < 40; i++) {
        sc.beginPath();
        sc.arc(rand() * cw, rand() * ch * 0.35, 0.5 + rand() * 1.2, 0, Math.PI * 2);
        sc.fillStyle = `rgba(200,210,230,${0.3 + rand() * 0.5})`;
        sc.fill();
      }

      // Moon
      const moonX = cw * (0.7 + rand() * 0.2);
      const moonY = ch * (0.08 + rand() * 0.12);
      const moonR = 18 + rand() * 12;
      const mg = sc.createRadialGradient(moonX, moonY, moonR * 0.5, moonX, moonY, moonR * 4);
      mg.addColorStop(0, 'rgba(200,210,230,0.15)');
      mg.addColorStop(1, 'rgba(200,210,230,0)');
      sc.fillStyle = mg;
      sc.beginPath(); sc.arc(moonX, moonY, moonR * 4, 0, Math.PI * 2); sc.fill();
      sc.beginPath(); sc.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      sc.fillStyle = 'rgba(220,225,240,0.85)'; sc.fill();
      sc.beginPath(); sc.arc(moonX + moonR * 0.35, moonY - moonR * 0.1, moonR * 0.85, 0, Math.PI * 2);
      sc.fillStyle = '#0e1a2e'; sc.fill();

      // Mountains
      const drawMtns = (baseY: number, peakH: number, color: string, snowA: number) => {
        sc.beginPath(); sc.moveTo(0, baseY);
        let x = 0;
        const pts: [number, number][] = [];
        while (x < cw + 50) {
          const px = x + rand() * 120 + 40;
          const py = baseY - peakH * (0.5 + rand() * 0.5);
          pts.push([px, py]);
          sc.lineTo(px, py);
          x = px + rand() * 80 + 20;
          sc.lineTo(x, baseY - peakH * rand() * 0.2);
        }
        sc.lineTo(cw, baseY); sc.closePath();
        sc.fillStyle = color; sc.fill();
        // Snow caps
        if (snowA > 0) {
          sc.save(); sc.clip();
          sc.beginPath(); sc.moveTo(0, baseY);
          for (const [px, py] of pts) {
            sc.lineTo(px, py);
            sc.lineTo(px - 15, py + peakH * 0.15);
            sc.lineTo(px + 15, py + peakH * 0.15);
          }
          sc.lineTo(cw, baseY); sc.closePath();
          sc.fillStyle = `rgba(210,220,235,${snowA})`; sc.fill();
          sc.restore();
        }
      };
      drawMtns(ch * 0.55, ch * 0.25, '#141e30', 0.3);
      drawMtns(ch * 0.62, ch * 0.18, '#1a2838', 0.4);

      // Snow ground
      const groundY = ch * 0.68;
      const gnd = sc.createLinearGradient(0, groundY, 0, ch);
      gnd.addColorStop(0, '#c8d4e0');
      gnd.addColorStop(0.3, '#b8c8d8');
      gnd.addColorStop(1, '#a0b0c4');
      sc.fillStyle = gnd;
      sc.beginPath(); sc.moveTo(0, groundY);
      for (let x = 0; x <= cw; x += 20) {
        sc.lineTo(x, groundY + Math.sin(x * 0.02 + rand() * 0.5) * 8 + rand() * 4);
      }
      sc.lineTo(cw, ch); sc.lineTo(0, ch); sc.closePath(); sc.fill();

      // Pine trees
      const drawPine = (tx: number, ty: number, h: number) => {
        sc.fillStyle = '#2a1a0e';
        sc.fillRect(tx - 2, ty - h * 0.2, 4, h * 0.2);
        for (let i = 0; i < 4; i++) {
          const ly = ty - h * 0.2 - i * h * 0.2;
          const lw = h * 0.3 * (1 - i * 0.18);
          sc.beginPath();
          sc.moveTo(tx, ly - h * 0.25);
          sc.lineTo(tx - lw, ly);
          sc.lineTo(tx + lw, ly);
          sc.closePath();
          sc.fillStyle = `rgb(${18 + i * 5},${38 + i * 8},${28 + i * 5})`;
          sc.fill();
          sc.beginPath();
          sc.moveTo(tx, ly - h * 0.25);
          sc.lineTo(tx - lw * 0.55, ly - h * 0.08);
          sc.lineTo(tx + lw * 0.55, ly - h * 0.08);
          sc.closePath();
          sc.fillStyle = `rgba(210,220,235,${0.5 + rand() * 0.2})`;
          sc.fill();
        }
      };
      for (let i = 0; i < 8 + Math.floor(rand() * 8); i++) {
        drawPine(rand() * cw, groundY + 5 + rand() * 15, 40 + rand() * 70);
      }

      // Cottage
      const cx = cw * (0.3 + rand() * 0.4);
      const cy = groundY + 2;
      const cW = 50 + rand() * 30;
      const cH = 35 + rand() * 15;
      sc.fillStyle = '#3a2a1e';
      sc.fillRect(cx - cW / 2, cy - cH, cW, cH);
      // Roof
      sc.beginPath();
      sc.moveTo(cx, cy - cH - 25);
      sc.lineTo(cx - cW / 2 - 8, cy - cH + 2);
      sc.lineTo(cx + cW / 2 + 8, cy - cH + 2);
      sc.closePath();
      sc.fillStyle = '#2a1a10'; sc.fill();
      sc.beginPath();
      sc.moveTo(cx, cy - cH - 25);
      sc.lineTo(cx - cW / 2 - 5, cy - cH + 5);
      sc.lineTo(cx + cW / 2 + 5, cy - cH + 5);
      sc.closePath();
      sc.fillStyle = 'rgba(210,220,235,0.7)'; sc.fill();
      // Window glow
      const wg = sc.createRadialGradient(cx, cy - cH + 17, 2, cx, cy - cH + 17, 60);
      wg.addColorStop(0, 'rgba(255,200,100,0.2)');
      wg.addColorStop(1, 'rgba(255,200,100,0)');
      sc.fillStyle = wg;
      sc.beginPath(); sc.arc(cx, cy - cH + 17, 60, 0, Math.PI * 2); sc.fill();
      sc.fillStyle = 'rgba(255,210,120,0.8)';
      sc.fillRect(cx - 6, cy - cH + 10, 12, 14);
      sc.strokeStyle = '#2a1a10'; sc.lineWidth = 1.5;
      sc.beginPath();
      sc.moveTo(cx, cy - cH + 10); sc.lineTo(cx, cy - cH + 24);
      sc.moveTo(cx - 6, cy - cH + 17); sc.lineTo(cx + 6, cy - cH + 17);
      sc.stroke();
      // Chimney + smoke
      const chimX = cx + cW * 0.25;
      sc.fillStyle = '#2a1a10';
      sc.fillRect(chimX - 4, cy - cH - 15, 8, 20);
      sc.fillStyle = 'rgba(210,220,235,0.6)';
      sc.fillRect(chimX - 6, cy - cH - 18, 12, 5);
      sc.strokeStyle = 'rgba(150,160,180,0.15)'; sc.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        sc.beginPath();
        sc.moveTo(chimX, cy - cH - 20);
        sc.quadraticCurveTo(chimX + 8 + i * 5, cy - cH - 35 - i * 10, chimX + 15 + i * 8, cy - cH - 50 - i * 12);
        sc.stroke();
      }

      // Frozen pond
      const pX = cw * (0.1 + rand() * 0.3);
      const pY = groundY + 20 + rand() * 20;
      sc.beginPath();
      sc.ellipse(pX, pY, 40 + rand() * 50, 10 + rand() * 12, 0, 0, Math.PI * 2);
      sc.fillStyle = 'rgba(140,160,190,0.2)'; sc.fill();
      sc.strokeStyle = 'rgba(180,195,215,0.15)'; sc.lineWidth = 1; sc.stroke();

      // Init fog
      fogCtx.fillStyle = 'rgba(180,190,205,0.82)';
      fogCtx.fillRect(0, 0, cw, ch);
      for (let i = 0; i < 200; i++) {
        const fx = rand() * cw, fy = rand() * ch, fr = 20 + rand() * 60;
        const fg = fogCtx.createRadialGradient(fx, fy, 0, fx, fy, fr);
        fg.addColorStop(0, `rgba(180,190,205,${rand() * 0.08})`);
        fg.addColorStop(1, 'rgba(180,190,205,0)');
        fogCtx.fillStyle = fg;
        fogCtx.beginPath(); fogCtx.arc(fx, fy, fr, 0, Math.PI * 2); fogCtx.fill();
      }
      for (let i = 0; i < 15; i++) {
        const dx = rand() * cw, dy = rand() * ch, dl = 30 + rand() * 80;
        fogCtx.strokeStyle = `rgba(160,170,190,${0.05 + rand() * 0.08})`;
        fogCtx.lineWidth = 1 + rand() * 2;
        fogCtx.beginPath();
        fogCtx.moveTo(dx, dy);
        fogCtx.quadraticCurveTo(dx + (rand() - 0.5) * 10, dy + dl * 0.5, dx + (rand() - 0.5) * 5, dy + dl);
        fogCtx.stroke();
      }
    };

    drawScene();

    const onResize = () => { resize(); drawScene(); };
    window.addEventListener('resize', onResize);

    let prev = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - prev) / 16.67, 3);
      prev = now;
      const cw = W(), ch = H();
      const t = now * 0.001;

      // Wipe fog
      if (mouse.active) {
        const dx = mouse.x - mouse.prevX;
        const dy = mouse.y - mouse.prevY;
        if (dx * dx + dy * dy > 1) {
          fogCtx.globalCompositeOperation = 'destination-out';
          const wr = 30;
          const g = fogCtx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, wr);
          g.addColorStop(0, 'rgba(0,0,0,0.6)');
          g.addColorStop(0.6, 'rgba(0,0,0,0.3)');
          g.addColorStop(1, 'rgba(0,0,0,0)');
          fogCtx.fillStyle = g;
          fogCtx.beginPath(); fogCtx.arc(mouse.x, mouse.y, wr, 0, Math.PI * 2); fogCtx.fill();
          fogCtx.globalCompositeOperation = 'source-over';
          mouse.prevX = mouse.x;
          mouse.prevY = mouse.y;
        }
      }

      // Fog reforms slowly
      fogReformTimer += dt;
      if (fogReformTimer > 100) {
        fogReformTimer = 0;
        fogCtx.fillStyle = 'rgba(180,190,205,0.006)';
        fogCtx.fillRect(0, 0, cw, ch);
      }

      // Draw
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(sceneCanvas, 0, 0, cw, ch);

      // Animated snow
      for (const sf of snowflakes) {
        sf.y += sf.speed * dt;
        sf.x += sf.drift * dt + Math.sin(t + sf.x * 10) * 0.0001 * dt;
        if (sf.y > 1.05) { sf.y = -0.02; sf.x = Math.random(); }
        if (sf.x > 1.05) sf.x = -0.02;
        if (sf.x < -0.05) sf.x = 1.02;
        ctx.beginPath();
        ctx.arc(sf.x * cw, sf.y * ch, sf.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,228,240,${sf.opacity})`;
        ctx.fill();
      }

      // Fog overlay
      ctx.drawImage(fogCanvas, 0, 0, cw, ch);

      // Window frame
      ctx.strokeStyle = 'rgba(60,65,75,0.4)';
      ctx.lineWidth = 3;
      ctx.strokeRect(1.5, 1.5, cw - 3, ch - 3);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cw / 2, 0); ctx.lineTo(cw / 2, ch);
      ctx.moveTo(0, ch / 2); ctx.lineTo(cw, ch / 2);
      ctx.stroke();

      // Custom cursor: pointing finger
      if (mouse.active) {
        const fx = mouse.x, fy = mouse.y;
        ctx.save();
        ctx.translate(fx, fy);
        // Finger
        ctx.fillStyle = 'rgba(230,220,210,0.6)';
        ctx.beginPath();
        ctx.roundRect(-4, -18, 8, 22, 3);
        ctx.fill();
        // Fingernail
        ctx.fillStyle = 'rgba(240,235,230,0.5)';
        ctx.beginPath();
        ctx.roundRect(-3, -18, 6, 6, [2, 2, 0, 0]);
        ctx.fill();
        // Wipe glow
        const wg = ctx.createRadialGradient(0, -8, 0, 0, -8, 35);
        wg.addColorStop(0, 'rgba(255,255,255,0.08)');
        wg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = wg;
        ctx.beginPath(); ctx.arc(0, -8, 35, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Poem
      poemTimer += dt;
      if (poemTimer > 600 && poemOpacity <= 0) {
        poem = poems[Math.floor(Math.random() * poems.length)];
        poemOpacity = 0; poemTimer = 0;
      }
      if (poemOpacity > 0 || poemTimer < 60) {
        if (poemTimer < 60) poemOpacity = Math.min(poemOpacity + 0.006 * dt, 0.55);
        else if (poemTimer > 400) poemOpacity -= 0.005 * dt;
        if (poemOpacity > 0) {
          ctx.font = '15px system-ui, -apple-system, "PingFang SC", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(210,220,235,${Math.max(0, poemOpacity)})`;
          ctx.fillText(poem, cw / 2, ch - 35);
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', onResize); };
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const r = canvasRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    const src = 'touches' in e ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }, []);

  const updateMouse = useCallback((active: boolean, x: number, y: number) => {
    const m = mouseRef.current;
    if (active) { m.prevX = m.x; m.prevY = m.y; m.x = x; m.y = y; }
    m.active = active;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ cursor: 'none' }}
      onMouseMove={(e) => { const p = getPos(e); updateMouse(true, p.x, p.y); }}
      onMouseLeave={() => updateMouse(false, 0, 0)}
      onTouchMove={(e) => { e.preventDefault(); const p = getPos(e); updateMouse(true, p.x, p.y); }}
      onTouchEnd={() => updateMouse(false, 0, 0)}
    />
  );
}
