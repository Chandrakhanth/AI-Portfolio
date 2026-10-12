/**
 * Production-Ready Calm Ambient Neural Canvas
 * High-performance, cross-device particle & constellation network
 * Supports Touchscreens (iOS/Android), High-DPR Retina displays, Mouse, and Autonomous Motion
 */
class CalmAmbientCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { alpha: true });

    this.currentMode = 'constellation';
    this.particles = [];
    this.ripples = [];
    this.mouse = { x: null, y: null, radius: 140, active: false };
    this.animationFrameId = null;
    this.isVisible = true;
    this.lastTime = 0;
    this.resizeTimeout = null;

    this.init();
  }

  getThemeColors() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      return {
        particle: 'rgba(14, 165, 233, 0.55)',
        secondary: 'rgba(99, 102, 241, 0.42)',
        accent: 'rgba(20, 184, 166, 0.48)',
        lineBase: '14, 165, 233',
        glow: 'rgba(14, 165, 233, 0.28)'
      };
    } else {
      return {
        particle: 'rgba(56, 189, 248, 0.72)',
        secondary: 'rgba(167, 139, 250, 0.62)',
        accent: 'rgba(45, 212, 191, 0.68)',
        lineBase: '56, 189, 248',
        glow: 'rgba(56, 189, 248, 0.45)'
      };
    }
  }

  init() {
    this.handleResize();
    this.createParticles();
    this.bindEvents();
    this.start();

    // Secondary measurement check after styles and fonts finish loading
    window.addEventListener('load', () => this.handleResize(), { once: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this.handleResize());
    }
  }

  handleResize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const parent = this.canvas.parentElement;
    
    // Robust dimension calculation with reliable fallbacks
    const w = Math.round(rect.width || (parent ? parent.clientWidth : 0) || window.innerWidth || 360);
    const h = Math.round(rect.height || (parent ? parent.clientHeight : 0) || window.innerHeight || 640);
    
    this.width = w;
    this.height = h;

    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    // Strictly reset transformation matrix to prevent compounding DPR scale
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isMobile = w < 640;
    const isTablet = w >= 640 && w < 1024;
    const count = isMobile ? 38 : (isTablet ? 54 : 70);
    this.maxDistance = isMobile ? 105 : (isTablet ? 125 : 145);
    this.mouse.radius = isMobile ? 110 : 150;

    if (this.particles.length === 0 || Math.abs(this.particles.length - count) > 10) {
      this.particleCount = count;
      this.createParticles();
    }
  }

  createParticles() {
    this.particles = [];
    const count = this.particleCount || 60;
    const w = this.width || 360;
    const h = this.height || 640;

    if (this.currentMode === 'constellation') {
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          baseRadius: Math.random() * 2.2 + 1.2,
          radius: Math.random() * 2.2 + 1.2,
          colorType: Math.random() > 0.45 ? 'particle' : 'secondary',
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.015 + Math.random() * 0.02
        });
      }
    } else if (this.currentMode === 'flowing') {
      const flowCount = Math.round(count * 1.2);
      for (let i = 0; i < flowCount; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.random() * 0.75 + 0.35,
          vy: Math.sin(Math.random() * Math.PI * 2) * 0.2,
          radius: Math.random() * 2.4 + 1.1,
          colorType: Math.random() > 0.4 ? 'accent' : 'particle',
          amplitude: Math.random() * 16 + 6,
          freq: Math.random() * 0.018 + 0.006,
          initialY: Math.random() * h
        });
      }
    } else if (this.currentMode === 'orbit') {
      const cx = w / 2;
      const cy = h / 2;
      for (let i = 0; i < count; i++) {
        const radius = Math.random() * Math.min(w, h) * 0.4 + 25;
        const angle = Math.random() * Math.PI * 2;
        this.particles.push({
          cx,
          cy,
          orbitRadius: radius,
          angle,
          speed: (Math.random() * 0.004 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
          radius: Math.random() * 2.2 + 1,
          colorType: Math.random() > 0.5 ? 'secondary' : 'accent'
        });
      }
    }
  }

  addRipple(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      this.ripples.push({
        x: clientX - rect.left,
        y: clientY - rect.top,
        radius: 6,
        maxRadius: Math.min(this.width, 220),
        opacity: 0.75
      });
    }
  }

  bindEvents() {
    // Window resize & orientation change with lightweight debouncing
    const onResize = () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.handleResize(), 80);
    };
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });

    const heroSection = document.getElementById('hero') || this.canvas.parentElement || window;

    // Helper to update pointer coords
    const updatePointer = (clientX, clientY, active = true) => {
      const rect = this.canvas.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        this.mouse.x = clientX - rect.left;
        this.mouse.y = clientY - rect.top;
        this.mouse.active = active;
      } else {
        this.mouse.x = null;
        this.mouse.y = null;
        this.mouse.active = false;
      }
    };

    const clearPointer = () => {
      this.mouse.x = null;
      this.mouse.y = null;
      this.mouse.active = false;
    };

    // Modern Pointer Events (Unified Mouse, Touch, Stylus)
    heroSection.addEventListener('pointermove', (e) => {
      updatePointer(e.clientX, e.clientY, true);
    }, { passive: true });

    heroSection.addEventListener('pointerdown', (e) => {
      if (e.target && e.target.closest('a, button, input, textarea, kbd')) return;
      updatePointer(e.clientX, e.clientY, true);
      this.addRipple(e.clientX, e.clientY);
    }, { passive: true });

    heroSection.addEventListener('pointerup', clearPointer, { passive: true });
    heroSection.addEventListener('pointercancel', clearPointer, { passive: true });
    heroSection.addEventListener('pointerleave', clearPointer, { passive: true });

    // Touch fallbacks for older devices
    heroSection.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY, true);
      }
    }, { passive: true });

    heroSection.addEventListener('touchstart', (e) => {
      if (e.target && e.target.closest('a, button, input, textarea, kbd')) return;
      if (e.touches && e.touches[0]) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY, true);
        this.addRipple(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    heroSection.addEventListener('touchend', clearPointer, { passive: true });
    heroSection.addEventListener('touchcancel', clearPointer, { passive: true });

    // Page visibility to pause RAF in background tabs
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (this.isVisible) this.start();
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries && entries[0]) {
          this.isVisible = entries[0].isIntersecting;
          if (this.isVisible) this.start();
        }
      }, { threshold: 0.01 });
      observer.observe(this.canvas);
    }
  }

  setMode(mode) {
    if (this.currentMode === mode) return;
    this.currentMode = mode;
    this.createParticles();
  }

  render() {
    if (!this.isVisible) {
      this.animationFrameId = null;
      return;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);
    const colors = this.getThemeColors();

    if (this.currentMode === 'constellation') {
      this.renderConstellation(colors);
    } else if (this.currentMode === 'flowing') {
      this.renderFlowing(colors);
    } else if (this.currentMode === 'orbit') {
      this.renderOrbit(colors);
    }

    this.renderRipples(colors);

    this.animationFrameId = requestAnimationFrame(() => this.render());
  }

  renderConstellation(colors) {
    const maxDist = this.maxDistance;
    const hasPointer = this.mouse.x !== null && this.mouse.y !== null;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Autonomous organic ambient motion: subtle undulating drift
      p.phase += p.phaseSpeed;
      p.x += p.vx + Math.cos(p.phase * 0.7) * 0.16;
      p.y += p.vy + Math.sin(p.phase) * 0.2;

      // Screen boundary wrap
      if (p.x < -15) p.x = this.width + 15;
      if (p.x > this.width + 15) p.x = -15;
      if (p.y < -15) p.y = this.height + 15;
      if (p.y > this.height + 15) p.y = -15;

      // Pointer interactive physics (repel gently on touch/mouse)
      if (hasPointer) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius && dist > 0) {
          const force = (1 - dist / this.mouse.radius) * 0.42;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;

          // Tactile laser thread from pointer to nearby particle
          if (dist < this.mouse.radius * 0.85) {
            const threadAlpha = (1 - dist / (this.mouse.radius * 0.85)) * 0.4;
            this.ctx.beginPath();
            this.ctx.moveTo(this.mouse.x, this.mouse.y);
            this.ctx.lineTo(p.x, p.y);
            this.ctx.strokeStyle = `rgba(${colors.lineBase}, ${threadAlpha.toFixed(3)})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
          }
        }
      }

      // Constellation node links
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.32;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(${colors.lineBase}, ${alpha.toFixed(3)})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }

      // Dynamic pulsing node circle
      const dynamicRadius = p.baseRadius + Math.sin(p.phase) * 0.55;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, dynamicRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = colors[p.colorType];
      this.ctx.fill();
    }
  }

  renderFlowing(colors) {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y = p.initialY + Math.sin(p.x * p.freq) * p.amplitude;

      if (p.x > this.width + 20) {
        p.x = -20;
        p.initialY = Math.random() * this.height;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = colors[p.colorType];
      this.ctx.fill();
    }
  }

  renderOrbit(colors) {
    const cx = this.width / 2;
    const cy = this.height / 2;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.angle += p.speed;

      const px = cx + Math.cos(p.angle) * p.orbitRadius;
      const py = cy + Math.sin(p.angle) * (p.orbitRadius * 0.45);

      this.ctx.beginPath();
      this.ctx.arc(px, py, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = colors[p.colorType];
      this.ctx.fill();
    }
  }

  renderRipples(colors) {
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += 2.4;
      r.opacity -= 0.018;

      if (r.opacity <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(${colors.lineBase}, ${Math.max(0, r.opacity).toFixed(3)})`;
      this.ctx.lineWidth = 1.6;
      this.ctx.stroke();
    }
  }

  start() {
    if (!this.animationFrameId) {
      this.render();
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}

window.initNeuralCanvas = function (canvasId = 'hero-canvas') {
  return new CalmAmbientCanvas(canvasId);
};
