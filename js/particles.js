/**
 * HALO Music - Particles & Visual Effects
 * 背景动态连线粒子系统与水波纹点击特效
 */

export function setupParticles(audioLevelProvider) {
  if (typeof document === 'undefined') return;
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const parts = [];
  const N = window.matchMedia('(max-width: 760px)').matches ? 45 : 90;
  for (let i = 0; i < N; i++) {
    parts.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 1 + Math.random() * 2.5,
      baseR: 1 + Math.random() * 2.5,
      hue: 120 + Math.random() * 60,
      a: 0.22 + Math.random() * 0.3
    });
  }

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  let frameId = null;

  function start() {
    if (frameId === null && !document.hidden) {
      frameId = requestAnimationFrame(tick);
    }
  }

  function stop() {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  }

  function tick() {
    frameId = null;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const currentLevel = typeof audioLevelProvider === 'function'
      ? Number(audioLevelProvider()) || 0
      : Number(audioLevelProvider) || 0;

    const pulse = 1 + currentLevel * 2.2;
    for (const p of parts) {
      p.x += p.vx;
      p.y += p.vy;
      p.hue += 0.08;
      if (p.x < -40) p.x = window.innerWidth + 40;
      if (p.x > window.innerWidth + 40) p.x = -40;
      if (p.y < -40) p.y = window.innerHeight + 40;
      if (p.y > window.innerHeight + 40) p.y = -40;

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const push = Math.max(0, 140 - dist) / 140;
      p.x += dx * 0.011 * push;
      p.y += dy * 0.011 * push;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.baseR * pulse, 0, Math.PI * 2);
      const light = Math.min(80, 60 + currentLevel * 40);
      ctx.fillStyle = `hsla(${p.hue},70%,${light}%,${p.a})`;
      ctx.fill();
    }

    ctx.lineWidth = 0.45;
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const a = parts[i];
        const b = parts[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          const al = 0.10 * (1 - d / 100) * (0.6 + currentLevel * 1.5);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(127,166,143,${al})`;
          ctx.stroke();
        }
      }
    }

    if (!document.hidden) {
      frameId = requestAnimationFrame(tick);
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  reduceMotion.addEventListener?.('change', (event) => {
    if (event.matches) {
      stop();
      canvas.style.display = 'none';
    } else {
      canvas.style.display = '';
      resize();
      start();
    }
  });

  start();
}

/**
 * 按钮与歌曲条目水波纹动画
 */
export function setupRipple() {
  if (typeof document === 'undefined') return;
  document.addEventListener('pointerdown', (e) => {
    const target = e.target.closest('.ripple-target, .btn, .track-item, .search-mini-item');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const max = Math.max(rect.width, rect.height);

    const outer = document.createElement('span');
    outer.className = 'ripple-circle';
    outer.style.left = `${x}px`;
    outer.style.top = `${y}px`;
    outer.style.width = outer.style.height = `${max * 2}px`;

    const inner = document.createElement('span');
    inner.className = 'ripple-circle-inner';
    inner.style.left = `${x}px`;
    inner.style.top = `${y}px`;
    inner.style.width = inner.style.height = `${max * 1.4}px`;

    target.appendChild(outer);
    target.appendChild(inner);

    outer.addEventListener('animationend', () => outer.remove());
    inner.addEventListener('animationend', () => inner.remove());
  });
}
