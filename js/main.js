class CalmSoundFX {
  constructor() {
    this.enabled = localStorage.getItem('portfolio_audio_enabled') === 'true';
    this.ctx = null;
  }

  initContext() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('portfolio_audio_enabled', this.enabled);
    if (this.enabled) {
      this.initContext();
      this.play('blip');
    }
    return this.enabled;
  }

  play(type) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'keystroke') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700 + Math.random() * 80, now);
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.linearRampToValueAtTime(480, now + 0.05);
        gain.gain.setValueAtTime(0.012, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'blip') {
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); 
        osc.frequency.setValueAtTime(659.25, now + 0.06); 
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
      }
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }
}

const sfx = new CalmSoundFX();
window.playSfx = (type) => sfx.play(type);

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  initThemeToggle();
  initNavbarAndAudio();
  initDynamicTyping();
  initCanvas();
  initAvatar();
  initArchitecture();
  initTerminal();
  renderCertifications();
  renderProjects();
  renderSkills();
  renderExperience();
  init3DTilt();
  initCommandPalette();
  initContactForm();
  initScrollAnimations();

  const heroVideo = document.querySelector('video.hero-video-art');
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroVideo && heroCanvas) {
    heroVideo.addEventListener('error', () => {
      heroVideo.style.display = 'none';
      heroCanvas.style.display = 'block';
      if (window.portfolioCanvas && typeof window.portfolioCanvas.handleResize === 'function') {
        window.portfolioCanvas.handleResize();
      }
    });
  }
}

function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      sfx.play('blip');
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    const isDark = theme === 'dark';
    themeToggleBtn.innerHTML = isDark
      ? `<svg class="nav-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg class="nav-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    themeToggleBtn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }

  if (window.portfolioCanvas) {
    window.portfolioCanvas.createParticles();
  }
}

function initNavbarAndAudio() {
  const nav = document.querySelector('.site-nav');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileSearchBtn = document.getElementById('mobile-search-btn');

  let lastScrollY = window.pageYOffset;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;

    if (currentScrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    const isMobileOpen = mobileDrawer && mobileDrawer.classList.contains('open');
    if (!isMobileOpen) {
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        
        nav.classList.add('nav-hidden');
      } else if (currentScrollY < lastScrollY || currentScrollY <= 20) {
        
        nav.classList.remove('nav-hidden');
      }
    }

    lastScrollY = Math.max(0, currentScrollY);
  }, { passive: true });

  if (audioToggleBtn) {
    const updateAudioIcon = () => {
      audioToggleBtn.innerHTML = sfx.enabled
        ? `<svg class="nav-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`
        : `<svg class="nav-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      audioToggleBtn.classList.toggle('active', sfx.enabled);
      audioToggleBtn.setAttribute('title', sfx.enabled ? 'Mute Sound Effects' : 'Enable Sound Effects');
      audioToggleBtn.setAttribute('aria-label', sfx.enabled ? 'Mute Sound Effects' : 'Enable Sound Effects');
    };
    updateAudioIcon();

    audioToggleBtn.addEventListener('click', () => {
      sfx.toggle();
      updateAudioIcon();
      if (!sfx.enabled && window.digitalHuman) {
        window.digitalHuman.stopSpeaking();
      }
    });
  }

  if (mobileMenuBtn && mobileDrawer) {
    const closeMobileMenu = () => {
      mobileDrawer.classList.remove('open');
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
    };

    const toggleMobileMenu = () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
      mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
      if (isOpen) sfx.play('blip');
    };

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    if (mobileSearchBtn) {
      mobileSearchBtn.addEventListener('click', () => {
        closeMobileMenu();
        const cmdBtn = document.getElementById('cmd-palette-btn');
        if (cmdBtn) cmdBtn.click();
      });
    }
  }

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 130;
      const sectionId = current.getAttribute('id');
      const desktopLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      const mobileLink = document.querySelector(`.mobile-nav-link[href*="${sectionId}"]`);

      const inSection = scrollY > sectionTop && scrollY <= sectionTop + sectionHeight;
      if (desktopLink) desktopLink.classList.toggle('active', inSection);
      if (mobileLink) mobileLink.classList.toggle('active', inSection);
    });
  });
}

function initDynamicTyping() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const phrases = [
    "Modern Data Platforms",
    "PySpark Lakehouses",
    "Fabric DP-700 Pipelines",
    "Snowflake Data Marts",
    "Real-time ETL Streams",
    "Cloud Architectures"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 18 : 36;

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = 1300;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 200;
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 200);
}

function initCanvas() {
  if (typeof window.initNeuralCanvas === 'function') {
    const neuralCanvas = window.initNeuralCanvas('hero-canvas');
    window.portfolioCanvas = neuralCanvas;

    document.querySelectorAll('.canvas-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.canvas-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.mode;
        if (neuralCanvas) neuralCanvas.setMode(mode);
        sfx.play('click');
      });
    });
  }
}

function initAvatar() {
  if (typeof window.initDigitalHuman === 'function') {
    window.digitalHuman = window.initDigitalHuman();
  }
}

function initArchitecture() {
  if (typeof window.initArchitectureExplorer === 'function') {
    window.archExplorer = window.initArchitectureExplorer('architecture-container');
  }
}

function initTerminal() {
  if (typeof window.initInteractiveTerminal === 'function') {
    window.cliTerminal = window.initInteractiveTerminal('interactive-terminal-container');
  }
}

function renderCertifications() {
  const container = document.getElementById('certifications-grid');
  if (!container || typeof PORTFOLIO_DATA === 'undefined') return;

  const certs = PORTFOLIO_DATA.certifications || [];
  const logos = PORTFOLIO_DATA.companyLogos || {};

  container.innerHTML = certs.map((c) => {
    const logoSvg = logos[c.companyLogoKey] || '';
    const skillsList = Array.isArray(c.skills) ? c.skills : [];

    return `
      <div class="cert-card glass-card">
        <div class="cert-card-header">
          <div class="cert-company-logo" style="background: ${c.color}15; border: 1px solid ${c.color}35;">
            ${logoSvg}
          </div>
          <div class="cert-company-meta">
            <span class="cert-company-name">${c.company}</span>
            <span class="cert-pill" style="color: ${c.color}; border-color: ${c.color}45; background: ${c.color}12;">${c.badge}</span>
          </div>
        </div>

        <div class="cert-info">
          <h3 class="cert-title">${c.title}</h3>
          <div class="cert-issuer">Issued by <strong>${c.issuer}</strong> • <span class="cert-year">${c.year}</span></div>
        </div>

        ${skillsList.length > 0 ? `
          <div class="cert-skills-list">
            ${skillsList.map(s => `<span class="cert-skill-chip">${s}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (!container || typeof PORTFOLIO_DATA === 'undefined') return;

  const projects = PORTFOLIO_DATA.projects || [];

  function draw(filter = 'all') {
    container.innerHTML = '';
    const filtered = filter === 'all' 
      ? projects 
      : projects.filter(p => p.category === filter);

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'project-card glass-card tilt-card';
      card.setAttribute('data-project-id', p.id);

      card.innerHTML = `
        <div class="project-banner-wrap">
          <img src="${p.image}" alt="${p.title}" class="project-banner-img" loading="lazy" />
          <div class="project-badge">${p.categoryLabel}</div>
        </div>
        <div class="project-card-content">
          <h3 class="project-card-title">${p.title}</h3>
          <p class="project-card-summary">${p.summary}</p>
          
          <div class="project-metrics-row">
            ${p.metrics.map(m => `
              <div class="p-metric-item">
                <span class="m-val">${m.value}</span>
                <span class="m-label">${m.label}</span>
              </div>
            `).join('')}
          </div>

          <div class="project-tech-tags">
            ${p.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>

          <div class="project-card-actions">
            <button class="btn btn-sm btn-outline open-deepdive-btn" data-project-id="${p.id}">
              <span class="btn-icon">🔍</span> Architecture Details
            </button>
            <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-ghost" title="View Details">
              <span class="btn-icon">⚡</span> GitHub
            </a>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    init3DTilt();
    bindDeepDiveButtons();
    if (typeof window.refreshScrollAnimations === 'function') {
      window.refreshScrollAnimations();
    }
  }

  draw('all');

  document.querySelectorAll('.proj-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.proj-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      draw(btn.dataset.filter);
      sfx.play('click');
    });
  });
}

function bindDeepDiveButtons() {
  document.querySelectorAll('.open-deepdive-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.projectId;
      openProjectModal(id);
      sfx.play('blip');
    });
  });
}

function openProjectModal(id) {
  if (typeof PORTFOLIO_DATA === 'undefined') return;
  const project = PORTFOLIO_DATA.projects.find(p => p.id === id);
  if (!project) return;

  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-project-content');
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div class="modal-banner-wrap">
      <img src="${project.image}" alt="${project.title}" class="modal-banner-img" />
      <div class="modal-badge">${project.categoryLabel}</div>
    </div>
    <div class="modal-body-pad">
      <h2 class="modal-title">${project.title}</h2>
      <p class="modal-lead">${project.summary}</p>

      <div class="modal-challenge-grid">
        <div class="challenge-box">
          <div class="c-title text-amber">⚠️ Business & Technical Problem</div>
          <p>${project.problem}</p>
        </div>
        <div class="solution-box">
          <div class="c-title text-emerald">✅ Data Engineering Solution</div>
          <p>${project.solution}</p>
        </div>
      </div>

      <div class="modal-section-title">PIPELINE ARCHITECTURE & FLOW</div>
      <div class="arch-flow-diagram">
        ${project.architecture.map((step, idx) => `
          <div class="arch-step">
            <span class="step-num">0${idx + 1}</span>
            <span class="step-text">${step}</span>
          </div>
        `).join('')}
      </div>

      <div class="modal-section-title">VERIFIED RESULTS & METRICS</div>
      <div class="modal-metrics-grid">
        ${project.metrics.map(m => `
          <div class="m-metric-card">
            <div class="m-val text-teal">${m.value}</div>
            <div class="m-label">${m.label}</div>
          </div>
        `).join('')}
      </div>

      <div class="modal-section-title">TECHNOLOGIES USED</div>
      <div class="modal-tags">
        ${project.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>

      <div class="modal-actions-footer">
        <a href="#pipeline" class="btn btn-primary close-and-simulate">
          <span class="btn-icon">▶</span> Test in Airflow Simulator
        </a>
        <a href="${project.githubUrl}" target="_blank" rel="noopener" class="btn btn-ghost">
          <span class="btn-icon">⚡</span> View GitHub Profile
        </a>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('close-modal-btn');
  if (closeBtn) closeBtn.onclick = closeModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
  const simLink = modalBody.querySelector('.close-and-simulate');
  if (simLink) {
    simLink.onclick = () => {
      closeModal();
      setTimeout(() => {
        const triggerBtn = document.getElementById('trigger-dag-btn');
        if (triggerBtn) triggerBtn.click();
      }, 500);
    };
  }
}

function closeModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function init3DTilt() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseenter', () => {
      sfx.play('hover');
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  });
}

function renderSkills() {
  const container = document.getElementById('skills-matrix-container');
  if (!container || typeof PORTFOLIO_DATA === 'undefined') return;

  const categories = PORTFOLIO_DATA.skills || [];

  container.innerHTML = categories.map((cat, idx) => `
    <div class="skills-pillar-card glass-card">
      <div class="pillar-header">
        <span class="pillar-badge">${cat.badge}</span>
        <h3 class="pillar-title">${cat.category}</h3>
        <p class="pillar-desc">${cat.description}</p>
      </div>

      <div class="pillar-skills-list">
        ${cat.skills.map(s => `
          <div class="skill-meter-block">
            <div class="skill-meta">
              <span class="skill-name">${s.name}</span>
              <span class="skill-pct">${s.level}%</span>
            </div>
            <div class="skill-track">
              <div class="skill-fill" style="--target-width: ${s.level}%;"></div>
            </div>
            <div class="skill-tags">
              ${s.tags.map(t => `<span class="mini-tag">${t}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderExperience() {
  const container = document.getElementById('experience-timeline');
  if (!container || typeof PORTFOLIO_DATA === 'undefined') return;

  const timeline = PORTFOLIO_DATA.experience || [];

  container.innerHTML = timeline.map((item, idx) => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-card glass-card">
        <div class="timeline-meta">
          <span class="timeline-period">${item.period}</span>
          <span class="timeline-loc">${item.location}</span>
        </div>
        <h3 class="timeline-role">${item.role}</h3>
        <div class="timeline-company">${item.company}</div>
        ${item.client ? `<div class="timeline-client">${item.client}</div>` : ''}
        <p class="timeline-highlight">${item.highlight}</p>

        <ul class="timeline-bullets">
          ${item.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>

        <div class="timeline-skills">
          ${item.skills.map(s => `<span class="tech-tag">${s}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function initCommandPalette() {
  const palette = document.getElementById('command-palette');
  const openBtn = document.getElementById('cmd-palette-btn');
  const input = document.getElementById('palette-search-input');
  const resultsList = document.getElementById('palette-results');
  if (!palette || !input || !resultsList) return;

  const quickActions = [
    { title: "Explore Data Architecture", desc: "Interactive Medallion Lakehouse & Distributed PySpark platform", action: () => location.hash = '#architecture' },
    { title: "Switch to Light / Dark Mode", desc: "Toggle theme preference", action: () => document.getElementById('theme-toggle-btn')?.click() },
    { title: "Enterprise Data Orchestration Platform", desc: "Explore flagship pipeline & Airflow orchestration project at Systech Solutions", action: () => openProjectModal('data-orchestration-platform') },
    { title: "View Industry Certifications", desc: "Microsoft Fabric, Astronomer Airflow & Databricks credentials", action: () => location.hash = '#certifications' },
    { title: "Ask Chandy's Virtual Assistant", desc: "Chat with the interactive portfolio bot", action: () => location.hash = '#terminal' },
    { title: "Toggle Sound Effects", desc: "Enable or mute subtle audio chimes", action: () => document.getElementById('audio-toggle-btn')?.click() },
    { title: "Jump to Contact Form", desc: "Send Chandrakhanth a direct message", action: () => location.hash = '#contact' }
  ];

  function openPalette() {
    palette.classList.add('active');
    input.value = '';
    renderResults(quickActions);
    input.focus();
    sfx.play('blip');
  }

  function closePalette() {
    palette.classList.remove('active');
  }

  function renderResults(actions) {
    resultsList.innerHTML = actions.map((act, idx) => `
      <div class="palette-item ${idx === 0 ? 'selected' : ''}" data-idx="${idx}">
        <div class="palette-item-title">${act.title}</div>
        <div class="palette-item-desc">${act.desc}</div>
      </div>
    `).join('');

    resultsList.querySelectorAll('.palette-item').forEach((item, i) => {
      item.onclick = () => {
        actions[i].action();
        closePalette();
      };
      item.onmouseenter = () => {
        resultsList.querySelectorAll('.palette-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
      };
    });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (palette.classList.contains('active')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape') {
      closePalette();
      closeModal();
    }
  });

  if (openBtn) openBtn.onclick = openPalette;
  palette.onclick = (e) => {
    if (e.target === palette) closePalette();
  };

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    const matches = quickActions.filter(a => 
      a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)
    );
    renderResults(matches);
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const copyBtn = document.getElementById('copy-email-btn');
  const statusMsg = document.getElementById('form-status-msg');
  const recipientEmail = 'chandrakhanth07@gmail.com';

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = copyBtn.getAttribute('data-email') || recipientEmail;
      navigator.clipboard.writeText(email).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `<span>✓ Email Copied!</span>`;
        sfx.play('blip');
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2200);
      });
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      const nameInput = document.getElementById('contact-name-input');
      const emailInput = document.getElementById('contact-email-input');
      const subjectInput = document.getElementById('contact-subject-input');
      const messageInput = document.getElementById('contact-message-input');

      const name = nameInput ? nameInput.value.trim() : 'Website Visitor';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Contact Inquiry';
      const message = messageInput ? messageInput.value.trim() : '';

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="btn-spinner"></span> Sending to Inbox...`;
      if (statusMsg) statusMsg.innerHTML = '';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      try {
        
        const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          signal: controller.signal,
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: `[Portfolio Inquiry] ${subject} - from ${name}`,
            subject: subject,
            message: message,
            _captcha: 'false',
            _template: 'box'
          })
        });

        clearTimeout(timeoutId);
        const data = await response.json().catch(() => ({}));

        const safeName = String(name).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c] || c));
        if (data.message && data.message.toLowerCase().includes('activate')) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `✓ Activation Sent!`;
          if (statusMsg) {
            statusMsg.innerHTML = `<div class="status-success" style="border-color: var(--accent-cyan); background: rgba(0, 240, 255, 0.12);">📩 <strong>One-time Activation Required:</strong> FormSubmit sent an activation link to <strong>${recipientEmail}</strong>. Please check your inbox and click <em>"Activate Form"</em> once. After that, all visitor messages will arrive directly in your inbox!</div>`;
          }
          form.reset();
          sfx.play('blip');
        } else if (response.ok || data.success === 'true' || data.success === true) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `✓ Message Delivered!`;
          if (statusMsg) {
            statusMsg.innerHTML = `<div class="status-success">✓ Thank you, ${safeName}! Your message has been dispatched directly to <strong>${recipientEmail}</strong>. I will get back to you shortly!</div>`;
          }
          form.reset();
          sfx.play('blip');
        } else {
          throw new Error(data.message || 'Service response unsuccessful');
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.warn('FormSubmit AJAX fallback to mailto:', err);
        const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(`[Portfolio] ${subject}`)}&body=${encodeURIComponent(`Hi Chandrakhanth,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        window.location.href = mailtoUrl;

        submitBtn.disabled = false;
        submitBtn.innerHTML = `✓ Email Client Opened`;
        if (statusMsg) {
          statusMsg.innerHTML = `<div class="status-success">✓ Direct email client opened addressed to <strong>${recipientEmail}</strong>. Please send your message directly!</div>`;
        }
        form.reset();
        sfx.play('blip');
      }

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
      }, 5000);
    });
  }
}

function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.animate-on-scroll, .skills-pillar-card, .timeline-item, .project-card, .cert-card').forEach(el => {
      el.classList.add('in-view');
      el.querySelectorAll('.skill-fill').forEach(fill => {
        fill.style.width = fill.style.getPropertyValue('--target-width') || '85%';
      });
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
          fill.style.width = fill.style.getPropertyValue('--target-width') || '85%';
        });
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  const observeAll = () => {
    document.querySelectorAll('.animate-on-scroll, .skills-pillar-card, .timeline-item, .project-card, .cert-card').forEach(el => {
      observer.observe(el);
    });
  };

  observeAll();
  window.refreshScrollAnimations = observeAll;
}
