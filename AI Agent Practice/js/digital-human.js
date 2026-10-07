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

    this.isSpeaking = false;
    this.synthSpeaking = false;
    this.hasSpokenOnce = false;
    this.greetingText = "Welcome to my portfolio. I’m an AI assistant designed to help you explore my experience, projects, and technical expertise.";

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
  }

  bindEvents() {
    
    window.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      this.mouseX = (e.clientX - centerX) / centerX;
      this.mouseY = (e.clientY - centerY) / centerY;

      this.targetRotY = this.mouseX * 6.5;
      this.targetRotX = -this.mouseY * 4.5;
    }, { passive: true });

    if (this.card) {
      this.card.addEventListener('click', () => {
        this.speakGreeting();
      });
    }

    if (this.voiceBtn) {
      this.voiceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.speakGreeting();
      });
    }

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
      });
    }

    const firstGestureHandler = () => {
      if (!this.hasSpokenOnce) {
        this.speakGreeting();
      }
      window.removeEventListener('click', firstGestureHandler);
    };
    window.addEventListener('click', firstGestureHandler, { once: true });
  }

  initSpeechEngine() {
    this.synth = window.speechSynthesis;
    if (this.synth && typeof this.synth.onvoiceschanged !== 'undefined') {
      this.synth.onvoiceschanged = () => {
        
      };
    }

    setTimeout(() => {
      this.speakGreeting();
    }, 400);
  }

  speakGreeting() {
    this.hasSpokenOnce = true;
    this.isSpeaking = true;

    if (this.voiceBubble) this.voiceBubble.classList.add('speaking');
    if (this.soundWave) this.soundWave.classList.add('active');
    if (this.lipSyncOverlay) this.lipSyncOverlay.classList.add('active');

    clearTimeout(this.speechTimer);
    this.speechTimer = setTimeout(() => {
      if (!this.synthSpeaking) {
        this.stopSpeaking();
      }
    }, 2800);

    if (!this.synth) return;

    try {
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(this.greetingText);
      utterance.rate = 1.08;
      utterance.pitch = 1.02;

      const voices = this.synth.getVoices();
      const preferredVoice = voices.find(v => (v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Male')))) || voices.find(v => v.lang.startsWith('en'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        this.synthSpeaking = true;
        this.isSpeaking = true;
      };

      utterance.onboundary = () => {
        if (this.lipSyncOverlay) {
          this.lipSyncOverlay.style.setProperty('--lip-pulse', (0.7 + Math.random() * 0.5).toFixed(2));
        }
      };

      utterance.onend = () => {
        this.synthSpeaking = false;
        this.stopSpeaking();
      };

      utterance.onerror = (err) => {
        this.synthSpeaking = false;
        console.log('Speech synthesis event:', err.error || err);
      };

      this.synth.speak(utterance);
    } catch (err) {
      console.log('Speech synthesis exception:', err);
    }

    if (window.playSfx) window.playSfx('blip');
  }

  stopSpeaking() {
    this.isSpeaking = false;
    this.synthSpeaking = false;
    if (this.voiceBubble) this.voiceBubble.classList.remove('speaking');
    if (this.soundWave) this.soundWave.classList.remove('active');
    if (this.lipSyncOverlay) this.lipSyncOverlay.classList.remove('active');
  }

  startBlinkCycle() {
    const triggerBlink = () => {
      if (this.eyeBlinkOverlay) {
        this.eyeBlinkOverlay.classList.add('blinking');
        setTimeout(() => {
          this.eyeBlinkOverlay.classList.remove('blinking');
        }, 160); 
      }

      const nextBlinkDelay = 3500 + Math.random() * 2200;
      setTimeout(triggerBlink, nextBlinkDelay);
    };

    setTimeout(triggerBlink, 2800);
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
