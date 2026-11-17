// ==UserScript==
// @name         AetherFin FX Engine — Next-Gen Audio, Ambience & Completion Effects
// @namespace    https://jellyfin.org/
// @version      2.0.0
// @description  Professional UI audio feedback (PS5/Apple TV haptics), ambient hover chords, and cinematic completion celebration for Jellyfin.
// @author       Antigravity Professional Dev
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  // Only run if Jellyfin environment is detected
  const isJellyfin = document.querySelector('meta[name="application-name"][content="Jellyfin"]') || 
                     document.title.includes('Jellyfin') || 
                     document.getElementById('reactRoot') || 
                     document.getElementById('appContent');

  if (!isJellyfin && !window.location.port.includes('8096')) return;

  console.log('%c[AetherFin FX]%c Engine Initialized — Professional Audio & Visual Suite Active', 
              'color: #e50914; font-weight: bold;', 'color: #06b6d4;');

  /* =========================================================================
     1. WEB AUDIO API SYNTHESIZER (Zero Audio Files, Zero Latency)
     ========================================================================= */
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Soft Haptic Hover (PS5-Style Subtle Tick)
  let lastHoverTime = 0;
  function playHoverTick() {
    const now = performance.now();
    if (now - lastHoverTime < 70) return; // Debounce
    lastHoverTime = now;

    const ctx = getAudioCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.028);
    } catch (e) {}
  }

  // Crisp Selection Click (Apple TV-Style Mechanical Click)
  function playSelectClick() {
    const ctx = getAudioCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.038);
    } catch (e) {}
  }

  // Cinematic Ambient Drone on Card Hover
  let ambientOsc1 = null;
  let ambientOsc2 = null;
  let ambientGain = null;
  let ambientTimer = null;

  function startAmbientDrone() {
    stopAmbientDrone();
    const ctx = getAudioCtx();
    if (!ctx) return;

    try {
      ambientGain = ctx.createGain();
      ambientGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 0.8);

      // Low harmonic drone (F# minor chord tones)
      ambientOsc1 = ctx.createOscillator();
      ambientOsc1.type = 'sine';
      ambientOsc1.frequency.setValueAtTime(92.5, ctx.currentTime); // F#2

      ambientOsc2 = ctx.createOscillator();
      ambientOsc2.type = 'triangle';
      ambientOsc2.frequency.setValueAtTime(138.59, ctx.currentTime); // C#3

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      ambientOsc1.connect(filter);
      ambientOsc2.connect(filter);
      filter.connect(ambientGain);
      ambientGain.connect(ctx.destination);

      ambientOsc1.start();
      ambientOsc2.start();
    } catch (e) {}
  }

  function stopAmbientDrone() {
    if (ambientGain && audioCtx) {
      try {
        ambientGain.gain.setValueAtTime(ambientGain.gain.value, audioCtx.currentTime);
        ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
        setTimeout(() => {
          if (ambientOsc1) { ambientOsc1.stop(); ambientOsc1.disconnect(); ambientOsc1 = null; }
          if (ambientOsc2) { ambientOsc2.stop(); ambientOsc2.disconnect(); ambientOsc2 = null; }
          if (ambientGain) { ambientGain.disconnect(); ambientGain = null; }
        }, 360);
      } catch (e) {
        ambientOsc1 = null; ambientOsc2 = null; ambientGain = null;
      }
    }
  }

  // Victory / Completion Fanfare Chord
  function playCompletionFanfare() {
    const ctx = getAudioCtx();
    if (!ctx) return;

    const chords = [220, 277.18, 329.63, 440]; // A Major triad
    chords.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + (idx * 0.08));

        gain.gain.setValueAtTime(0.001, ctx.currentTime + (idx * 0.08));
        gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + (idx * 0.08) + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + (idx * 0.08));
        osc.stop(ctx.currentTime + 2.5);
      } catch (e) {}
    });
  }

  /* =========================================================================
     2. EVENT LISTENERS: HOVER, CLICK, SCROLL
     ========================================================================= */
  document.addEventListener('mouseover', function (e) {
    const card = e.target.closest('.card, .cardBox, .listItem, .emby-button');
    if (card) {
      playHoverTick();
      if (card.classList.contains('card') || card.classList.contains('cardBox')) {
        clearTimeout(ambientTimer);
        ambientTimer = setTimeout(() => {
          startAmbientDrone();
        }, 550);
      }
    }
  }, true);

  document.addEventListener('mouseout', function (e) {
    const card = e.target.closest('.card, .cardBox');
    if (card) {
      clearTimeout(ambientTimer);
      stopAmbientDrone();
    }
  }, true);

  document.addEventListener('click', function (e) {
    const interactive = e.target.closest('button, a, .card, .emby-button, .listItem, .tab-button');
    if (interactive) {
      playSelectClick();
    }
  }, true);

  // Smooth Scroll Haptics
  let lastScrollSound = 0;
  window.addEventListener('scroll', function () {
    const now = performance.now();
    if (now - lastScrollSound > 140) {
      playHoverTick();
      lastScrollSound = now;
    }
  }, { passive: true });

  /* =========================================================================
     3. CINEMATIC COMPLETION CELEBRATION (CANVAS CONFETTI + CELEBRATION MODAL)
     ========================================================================= */
  function triggerCelebration(title = 'Movie Completed!') {
    playCompletionFanfare();

    // Create Canvas for Particle Physics
    const canvas = document.createElement('canvas');
    canvas.id = 'aetherfin-celebration-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      pointer-events: none;
      z-index: 999999;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#e50914', '#ffd700', '#06b6d4', '#ffffff', '#ff3b30', '#a855f7'];
    const particles = [];
    for (let i = 0; i < 160; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.6,
        vx: (Math.random() - 0.5) * 18,
        vy: -Math.random() * 22 - 6,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        decay: Math.random() * 0.007 + 0.004
      });
    }

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.42; // Gravity
        p.vx *= 0.985; // Air resistance
        p.rotation += p.rSpeed;
        p.opacity -= p.decay;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrame);
        canvas.remove();
      }
    }
    render();

    // Cinematic Glass Completion Modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: rgba(10, 12, 16, 0.88);
      backdrop-filter: blur(28px) saturate(190%);
      -webkit-backdrop-filter: blur(28px) saturate(190%);
      border: 1px solid rgba(229, 9, 20, 0.45);
      border-radius: 24px;
      padding: 32px 48px;
      text-align: center;
      color: #fff;
      font-family: inherit;
      box-shadow: 0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(229, 9, 20, 0.35);
      z-index: 1000000;
      opacity: 0;
      transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    modal.innerHTML = `
      <div style="font-size: 42px; margin-bottom: 12px; filter: drop-shadow(0 0 16px rgba(255, 215, 0, 0.6));">🏆</div>
      <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.2em; color: #e50914; font-weight: 800; margin-bottom: 6px;">Finished & Added to History</div>
      <h2 style="font-size: 26px; font-weight: 800; margin: 0 0 12px 0; background: linear-gradient(135deg, #fff, #bbb); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${title}</h2>
      <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0 0 24px 0;">Great watch! Hope you enjoyed the journey.</p>
      <button id="aetherfin-dismiss-btn" style="
        background: linear-gradient(135deg, #e50914, #b20710);
        color: #fff;
        border: none;
        padding: 10px 28px;
        font-size: 14px;
        font-weight: 700;
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(229, 9, 20, 0.4);
        transition: transform 0.2s ease;
      ">Continue Browsing</button>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
      modal.style.opacity = '1';
      modal.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 50);

    const dismiss = () => {
      modal.style.opacity = '0';
      modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
      setTimeout(() => modal.remove(), 400);
    };

    modal.querySelector('#aetherfin-dismiss-btn').onclick = dismiss;
    setTimeout(dismiss, 6500); // Auto dismiss after 6.5s
  }

  // Hook into Jellyfin Video End Events
  setInterval(() => {
    const video = document.querySelector('video');
    if (video && !video.dataset.aetherfinWatched) {
      video.dataset.aetherfinWatched = 'true';
      video.addEventListener('ended', function () {
        const itemTitle = document.querySelector('.videoOsdTitle, .videoTitle, .osdTitle, .itemName')?.textContent || 'Stream Completed!';
        triggerCelebration(itemTitle.trim());
      });
      // Also catch 98% completion
      video.addEventListener('timeupdate', function () {
        if (video.duration && (video.currentTime / video.duration) > 0.985 && !video.dataset.aetherfinCelebrated) {
          video.dataset.aetherfinCelebrated = 'true';
          const itemTitle = document.querySelector('.videoOsdTitle, .videoTitle, .osdTitle, .itemName')?.textContent || 'Stream Completed!';
          triggerCelebration(itemTitle.trim());
        }
      });
    }
  }, 1000);

  // Expose global test trigger so user can test celebration anytime
  window.AetherFin = {
    testCelebration: (title) => triggerCelebration(title || 'The Avengers (2012)'),
    playHover: playHoverTick,
    playClick: playSelectClick,
    playFanfare: playCompletionFanfare
  };

  console.log('%c[AetherFin FX] Ready! Type AetherFin.testCelebration() in console to test celebration anytime.', 'color: #ffd700;');
})();
