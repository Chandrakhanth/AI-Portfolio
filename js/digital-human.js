class DigitalHumanController {
  constructor() {
    this.stage = document.getElementById('hero-avatar-stage');
    this.card = document.getElementById('digital-human-card');
    this.img = document.getElementById('digital-human-img');
    this.lipSyncOverlay = document.getElementById('lip-sync-overlay');
    this.eyeBlinkOverlay = document.getElementById('eye-blink-overlay');
    this.voiceBubble = document.getElementById('avatar-voice-bubble');
    this.voiceBtn = document.getElementById('avatar-voice-btn');
    this.soundWave = document.getElementById('avatar-sound-wave');
    this.floatingDock = document.getElementById('floating-avatar-dock');
    this.voiceHint = document.getElementById('voice-bubble-hint');

    this.isSpeaking = false;
    this.synthSpeaking = false;
    this.hasSpokenGreeting = false;
    this.activeUtterance = null;
    this.preferredVoice = null;
    this.keepAliveInterval = null;
    this.greetingText = "Welcome to my portfolio! I'm an AI assistant designed to help you explore my data engineering experience, projects, and technical certifications.";

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotX = 0;
    this.targetRotY = 0;
    this.currentRotX = 0;
    this.currentRotY = 0;

    this.init();
  }

  init() {
    this.bindEvents();
    this.initSpeechEngine();
    this.startBlinkCycle();
    this.startGazeTrackingLoop();
    this.scheduleAutoGreeting();
  }

  bindEvents() {
    // 3D Parallax Tilt with Mouse
    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      this.mouseX = (e.clientX - centerX) / centerX;
      this.mouseY = (e.clientY - centerY) / centerY;

      this.targetRotY = this.mouseX * 6.5;
      this.targetRotX = -this.mouseY * 4.5;
    }, { passive: true });

    // Interactive Card Click toggles Voice
    if (this.card) {
      this.card.addEventListener('click', (e) => {
        if (e.target.closest('.avatar-chip')) return;
        this.toggleVoiceGreeting();
      });
    }

    // Direct Voice Button Click
    if (this.voiceBtn) {
      this.voiceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleVoiceGreeting();
      });
    }

    // Voice Bubble Click
    if (this.voiceBubble) {
      this.voiceBubble.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleVoiceGreeting();
      });
    }

    // Floating Avatar Dock at page scroll
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (this.floatingDock) {
        if (scrollY > 550) {
          this.floatingDock.classList.add('visible');
        } else {
          this.floatingDock.classList.remove('visible');
        }
      }
    }, { passive: true });

    if (this.floatingDock) {
      this.floatingDock.addEventListener('click', () => {
        const terminalEl = document.getElementById('terminal');
        if (terminalEl) {
          terminalEl.scrollIntoView({ behavior: 'smooth' });
          const input = document.getElementById('chat-input');
          if (input) setTimeout(() => input.focus(), 600);
        }
        if (window.playSfx) window.playSfx('click');
        if (!this.isSpeaking) {
          setTimeout(() => this.speakGreeting(false), 400);
        }
      });
    }

    // Connect Hero CTA pill to AI Assistant Voice
    const heroAiCta = document.getElementById('hero-cta-terminal');
    if (heroAiCta) {
      heroAiCta.addEventListener('click', (e) => {
        const terminalEl = document.getElementById('terminal');
        if (terminalEl) {
          e.preventDefault();
          terminalEl.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            const input = document.getElementById('chat-input');
            if (input) input.focus();
            if (!this.isSpeaking) {
              this.speakGreeting(false);
            }
          }, 500);
        }
      });
    }
  }

  initSpeechEngine() {
    this.synth = window.speechSynthesis;
    if (!this.synth) return;

    this.populateVoices();

    if (typeof this.synth.onvoiceschanged !== 'undefined') {
      this.synth.onvoiceschanged = () => {
        this.populateVoices();
      };
    }
  }

  populateVoices() {
    if (!this.synth) return;
    const allVoices = this.synth.getVoices();
    if (!allVoices || allVoices.length === 0) return;

    // Prioritize natural neural voices across Windows, Edge, Chrome, Apple
    const naturalPriority = [
      'guy online (natural)',
      'jenny online (natural)',
      'stefan online (natural)',
      'christopher online (natural)',
      'google us english',
      'google uk english male',
      'daniel',
      'samantha',
      'karen'
    ];

    let found = null;
    for (const name of naturalPriority) {
      found = allVoices.find(v => v.name.toLowerCase().includes(name));
      if (found) break;
    }

    if (!found) {
      found = allVoices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online')));
    }
    if (!found) {
      found = allVoices.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('desktop'));
    }
    if (!found) {
      found = allVoices.find(v => v.lang.startsWith('en')) || allVoices[0];
    }

    this.preferredVoice = found;
  }

  /**
   * Production-grade auto-greeting on website load:
   * 1. Attempts direct auto-play speech shortly after page load.
   * 2. If the browser blocks 0-click audio autoplay, automatically falls back
   *    to the very first interaction (any click, tap, scroll, or key press).
   */
  scheduleAutoGreeting() {
    if (this.hasSpokenGreeting) return;

    // Direct auto-play attempt after entrance animations start (600ms)
    setTimeout(() => {
      if (!this.hasSpokenGreeting && !this.isSpeaking) {
        this.speakGreeting(true);
      }
    }, 600);

    // Guaranteed fallback: triggers on first user interaction if 0-click autoplay was blocked
    const fallbackHandler = () => {
      if (!this.hasSpokenGreeting && !this.isSpeaking) {
        this.speakGreeting(false);
      }
      this.cleanupFallbackListeners();
    };

    this.fallbackHandler = fallbackHandler;
    this.fallbackEvents = ['click', 'pointerdown', 'keydown', 'scroll', 'touchstart'];
    this.fallbackEvents.forEach(evt => {
      window.addEventListener(evt, this.fallbackHandler, { once: true, passive: true });
    });
  }

  cleanupFallbackListeners() {
    if (!this.fallbackHandler || !this.fallbackEvents) return;
    this.fallbackEvents.forEach(evt => {
      window.removeEventListener(evt, this.fallbackHandler);
    });
  }

  toggleVoiceGreeting() {
    if (this.isSpeaking) {
      this.stopSpeaking();
    } else {
      this.speakGreeting(false);
    }
  }

  speakGreeting(isAutoPlay = false) {
    if (!this.synth) {
      this.synth = window.speechSynthesis;
    }

    if (!this.synth) return;

    // Respect user mute setting if explicitly toggled off
    if (window.sfx && window.sfx.enabled === false && !isAutoPlay) {
      return;
    }

    if (this.isSpeaking) {
      this.stopSpeaking();
      return;
    }

    try {
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(this.greetingText);
      this.activeUtterance = utterance;
      window._activeSpeechUtterance = utterance; // Prevent garbage collection in Chromium

      if (!this.preferredVoice) this.populateVoices();
      if (this.preferredVoice) {
        utterance.voice = this.preferredVoice;
      }

      utterance.rate = 1.02;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        this.synthSpeaking = true;
        this.isSpeaking = true;
        this.hasSpokenGreeting = true;
        this.cleanupFallbackListeners();

        if (this.voiceBubble) this.voiceBubble.classList.add('speaking');
        if (this.soundWave) this.soundWave.classList.add('active');
        if (this.lipSyncOverlay) this.lipSyncOverlay.classList.add('active');
        if (this.voiceBtn) this.voiceBtn.innerHTML = '⏸️';
        if (this.voiceHint) this.voiceHint.textContent = '⏸ Click to pause';
      };

      utterance.onboundary = () => {
        if (this.lipSyncOverlay) {
          const pulse = (0.75 + Math.random() * 0.45).toFixed(2);
          this.lipSyncOverlay.style.setProperty('--lip-pulse', pulse);
        }
      };

      utterance.onend = () => {
        this.activeUtterance = null;
        this.stopSpeaking();
      };

      utterance.onerror = (err) => {
        const errType = err && err.error ? err.error : '';
        if (errType === 'not-allowed') {
          // Browser security policy required an initial user gesture - fallback listener handles it
          console.log('Autoplay audio policy deferred until first user interaction.');
        } else {
          console.log('Speech synthesis ended:', errType);
        }
        this.activeUtterance = null;
        this.stopSpeaking();
      };

      // Periodic keep-alive loop for Chromium long speech bug
      if (this.keepAliveInterval) clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = setInterval(() => {
        if (!this.synthSpeaking || !this.isSpeaking) {
          clearInterval(this.keepAliveInterval);
        } else if (this.synth.paused) {
          this.synth.resume();
        }
      }, 1500);

      // 60ms delay after cancel() for Chromium audio pipeline reset
      setTimeout(() => {
        try {
          this.synth.speak(utterance);
          if (this.synth.paused) this.synth.resume();
        } catch (e) {
          console.warn('Speech synthesis speak error:', e);
          this.stopSpeaking();
        }
      }, 60);

    } catch (err) {
      console.warn('Speech synthesis exception:', err);
      this.stopSpeaking();
    }

    if (!isAutoPlay && window.playSfx) {
      window.playSfx('blip');
    }
  }

  stopSpeaking() {
    this.isSpeaking = false;
    this.synthSpeaking = false;
    this.activeUtterance = null;

    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }

    if (this.voiceBubble) this.voiceBubble.classList.remove('speaking');
    if (this.soundWave) this.soundWave.classList.remove('active');
    if (this.lipSyncOverlay) this.lipSyncOverlay.classList.remove('active');
    if (this.voiceBtn) this.voiceBtn.innerHTML = '🔊';
    if (this.voiceHint) this.voiceHint.textContent = '▶ Click to listen (AI Voice)';
  }

  startBlinkCycle() {
    const triggerBlink = () => {
      if (this.eyeBlinkOverlay) {
        this.eyeBlinkOverlay.classList.add('blinking');
        setTimeout(() => {
          this.eyeBlinkOverlay.classList.remove('blinking');
        }, 160);
      }

      const nextBlinkDelay = 3500 + Math.random() * 2500;
      setTimeout(triggerBlink, nextBlinkDelay);
    };

    setTimeout(triggerBlink, 2200);
  }

  startGazeTrackingLoop() {
    const updateGaze = () => {
      this.currentRotX += (this.targetRotX - this.currentRotX) * 0.08;
      this.currentRotY += (this.targetRotY - this.currentRotY) * 0.08;

      if (this.card) {
        this.card.style.transform = `perspective(1000px) rotateX(${this.currentRotX.toFixed(2)}deg) rotateY(${this.currentRotY.toFixed(2)}deg)`;
      }

      requestAnimationFrame(updateGaze);
    };

    requestAnimationFrame(updateGaze);
  }
}

window.initDigitalHuman = function () {
  return new DigitalHumanController();
};
