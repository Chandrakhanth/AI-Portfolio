class CalmAmbientCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.currentMode = 'constellation';
    this.particles = [];
    this.ripples = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.animationFrameId = null;
    this.isVisible = true;

    this.init();
  }

  getThemeColors() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      return {
        particle: 'rgba(14, 165, 233, 0.45)',
        secondary: 'rgba(99, 102, 241, 0.35)',
        accent: 'rgba(20, 184, 166, 0.4)',
        line: 'rgba(14, 165, 233, 0.12)',
        glow: 'rgba(14, 165, 233, 0.25)'
      };
    } else {
      return {
        particle: 'rgba(56, 189, 248, 0.65)',
        secondary: 'rgba(167, 139, 250, 0.55)',
        accent: 'rgba(45, 212, 191, 0.6)',
        line: 'rgba(56, 189, 248, 0.14)',
        glow: 'rgba(56, 189, 248, 0.4)'
      };
    }
  }

  init() {
    this.handleResize();
    this.createParticles();
    this.bindEvents();
    this.start();
  }

  handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);

    const count = this.width < 768 ? 32 : 65;
    this.maxDistance = this.width < 768 ? 95 : 135;
    if (this.particles.length === 0 || Math.abs(this.particles.length - count) > 10) {
      this.particleCount = count;
      this.createParticles();
    }
  }

  createParticles() {
    this.particles = [];
    const colors = this.getThemeColors();

    if (this.currentMode === 'constellation') {
      for (let i = 0; i < (this.particleCount || 60); i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          baseRadius: Math.random() * 2.2 + 1.2,
          radius: Math.random() * 2.2 + 1.2,
          colorType: Math.random() > 0.5 ? 'particle' : 'secondary',
          phase: Math.random() * Math.PI * 2
        });
      }
    } else if (this.currentMode === 'flowing') {
      
      for (let i = 0; i < (this.particleCount || 60) * 1.3; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: Math.random() * 0.8 + 0.3,
          vy: Math.sin(Math.random() * Math.PI * 2) * 0.2,
          radius: Math.random() * 2.5 + 1,
          colorType: Math.random() > 0.4 ? 'accent' : 'particle',
          amplitude: Math.random() * 15 + 5,
          freq: Math.random() * 0.02 + 0.005,
          initialY: Math.random() * this.height
        });
      }
    } else if (this.currentMode === 'orbit') {
      
      const cx = this.width / 2;
      const cy = this.height / 2;
      for (let i = 0; i < (this.particleCount || 60); i++) {
        const radius = Math.random() * Math.min(this.width, this.height) * 0.4 + 30;
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

  bindEvents() {
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 5,
        maxRadius: 160,
        opacity: 0.6
      });
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        this.isVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
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
      this.animationFrameId = requestAnimationFrame(() => this.render());
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

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.height + 10;
      if (p.y > this.height + 10) p.y = -10;

      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius && dist > 0) {
          const force = (1 - dist / this.mouse.radius) * 0.4;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }
      }

      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.35;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = colors.line.replace('0.14', alpha.toFixed(3)).replace('0.12', alpha.toFixed(3));
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }

      p.phase += 0.02;
      const dynamicRadius = p.baseRadius + Math.sin(p.phase) * 0.5;

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
      r.radius += 2.2;
      r.opacity -= 0.015;

      if (r.opacity <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(14, 165, 233, ${r.opacity})`;
      this.ctx.lineWidth = 1.5;
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
