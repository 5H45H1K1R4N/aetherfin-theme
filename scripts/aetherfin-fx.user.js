(function () {
  'use strict';
  if (window.__AETHERFIN_V4_LOADED__) return;
  window.__AETHERFIN_V4_LOADED__ = true;

  console.log('%c[AetherFin FX v4] Ambient Cinema Audio Engine Loaded', 'color: #e50914; font-weight: 800; font-size: 14px;');

  /* =========================================================================
     1. THEME AUDIO REGISTRY (Exact user requested themes)
     ========================================================================= */
  const CDN_BASE = "https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/audio/themes";
  window.AETHERFIN_THEMES = {
    "interstellar": `${CDN_BASE}/interstellar.mp3`,
    "3 idiots": `${CDN_BASE}/3-idiots.mp3`,
    "toxic": `${CDN_BASE}/toxic.mp3`,
    "stranger things": `${CDN_BASE}/stranger-things.mp3`,
    "dhoni": `${CDN_BASE}/ms-dhoni.mp3`,
    "ms dhoni": `${CDN_BASE}/ms-dhoni.mp3`,
    "tokyo drift": `${CDN_BASE}/tokyo-drift.mp3`,
    "phata poster": `${CDN_BASE}/phata-poster.mp3`,
    "iron man": `${CDN_BASE}/iron-man.mp3`,
    "avengers": `${CDN_BASE}/avengers.mp3`,
    "doraemon": `${CDN_BASE}/doraemon.mp3`,
    "jailer": `${CDN_BASE}/jailer-2.mp3`,
    "premada oorali": `${CDN_BASE}/premada-oorali.mp3`,
    "your name": `${CDN_BASE}/your-name.mp3`,
    "hanuman ansh": `${CDN_BASE}/hanuman-ansh.mp3`,
    "spider-man": `${CDN_BASE}/spider-man.mp3`,
    "spider man": `${CDN_BASE}/spider-man.mp3`
  };

  /* =========================================================================
     2. AUDIO ENGINE & REAL THEME HOVER PLAYER
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

  // Ensure AudioContext unlocks on first user interaction
  const unlockAudio = () => {
    getAudioCtx();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);

  // Soft Haptic Hover (PS5 Tick)
  let lastHoverTick = 0;
  function playHoverTick() {
    const now = performance.now();
    if (now - lastHoverTick < 80) return;
    lastHoverTick = now;

    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.025);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.028);
    } catch (e) {}
  }

  // Mechanical Click (Apple TV)
  function playSelectClick() {
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.038);
    } catch (e) {}
  }

  /* =========================================================================
     3. AMBIENT BACKGROUND THEME PLAYER (Low-Pass Warmth & Clean Stop)
     ========================================================================= */
  let activeAudio = null;
  let activeSource = null;
  let activeGain = null;
  let activeFilter = null;
  let hoverTimer = null;
  let currentCardElem = null;

  function stopThemeMusic(fadeMs = 250) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
    currentCardElem = null;

    if (activeAudio && activeGain && audioCtx) {
      const gain = activeGain;
      const audio = activeAudio;
      const source = activeSource;
      activeAudio = null;
      activeGain = null;
      activeSource = null;
      activeFilter = null;

      try {
        const curTime = audioCtx.currentTime;
        gain.gain.cancelScheduledValues(curTime);
        gain.gain.setValueAtTime(gain.gain.value, curTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, curTime + (fadeMs / 1000));
        setTimeout(() => {
          try {
            audio.pause();
            audio.src = '';
            source.disconnect();
            gain.disconnect();
          } catch(e) {}
        }, fadeMs + 20);
      } catch (e) {
        try { audio.pause(); audio.src = ''; } catch(e2) {}
      }
    } else if (activeAudio) {
      try { activeAudio.pause(); activeAudio.src = ''; } catch(e) {}
      activeAudio = null;
    }
  }

  function playThemeForCard(card) {
    const isVideoPlaying = document.querySelector('video:not(.paused)') && !document.querySelector('video').paused;
    if (isVideoPlaying) return;

    const titleElem = card.querySelector('.cardText-first, .cardText, .cardTitle, .itemName');
    const rawTitle = titleElem ? titleElem.textContent : (card.getAttribute('data-title') || '');
    const cleanTitle = rawTitle.toLowerCase().trim();

    let themeUrl = null;
    for (const [key, url] of Object.entries(window.AETHERFIN_THEMES)) {
      if (cleanTitle.includes(key)) {
        themeUrl = url;
        break;
      }
    }

    if (!themeUrl) return;

    stopThemeMusic(150);
    const ctx = getAudioCtx();
    if (!ctx) return;

    try {
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.src = themeUrl;
      audio.loop = true;

      const source = ctx.createMediaElementSource(audio);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 1.2);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      activeAudio = audio;
      activeSource = source;
      activeGain = gain;
      activeFilter = filter;

      audio.play().catch(() => {});
    } catch (e) {
      try {
        const audio = new Audio(themeUrl);
        audio.volume = 0;
        audio.loop = true;
        activeAudio = audio;
        audio.play().then(() => {
          let v = 0;
          const fadeIn = setInterval(() => {
            if (activeAudio === audio && v < 0.16) {
              v += 0.02;
              audio.volume = v;
            } else {
              clearInterval(fadeIn);
            }
          }, 80);
        }).catch(() => {});
      } catch(e2) {}
    }
  }

  /* =========================================================================
     4. PRECISION EVENT DISPATCHER
     ========================================================================= */
  document.addEventListener('mouseover', e => {
    const card = e.target.closest('.card, .cardBox, .listItem, .emby-button');
    if (card) {
      playHoverTick();
      if ((card.classList.contains('card') || card.classList.contains('cardBox')) && card !== currentCardElem) {
        currentCardElem = card;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => {
          if (currentCardElem === card) {
            playThemeForCard(card);
          }
        }, 500);
      }
    }
  }, true);

  document.addEventListener('mouseout', e => {
    const card = e.target.closest('.card, .cardBox');
    if (card && currentCardElem === card) {
      const related = e.relatedTarget;
      if (!related || !card.contains(related)) {
        stopThemeMusic(250);
      }
    }
  }, true);

  window.addEventListener('scroll', () => {
    if (activeAudio) {
      stopThemeMusic(180);
    }
  }, { passive: true });

  document.addEventListener('click', e => {
    if (e.target.closest('button, a, .card, .emby-button, .listItem, .tab-button')) {
      playSelectClick();
    }
  }, true);

  // Victory Celebration
  window.triggerCelebration = function(title = 'Stream Completed!') {
    const ctx = getAudioCtx();
    if (ctx) {
      const chords = [220, 277.18, 329.63, 440];
      chords.forEach((fr, i) => {
        try {
          const osc = ctx.createOscillator(), gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(fr, ctx.currentTime + i * 0.09);
          gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.09);
          gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.09 + 0.12);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.09); osc.stop(ctx.currentTime + 2.6);
        } catch (e) {}
      });
    }

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:999999;';
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const cCtx = canvas.getContext('2d'), colors = ['#e50914', '#ffd700', '#06b6d4', '#ffffff', '#ff3b30'], pts = [];
    for (let i = 0; i < 150; i++) {
      pts.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200, y: canvas.height * 0.6,
        vx: (Math.random() - 0.5) * 18, vy: -Math.random() * 22 - 6,
        size: Math.random() * 8 + 4, col: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360, rs: (Math.random() - 0.5) * 12, op: 1
      });
    }
    function renderConfetti() {
      cCtx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.42; p.vx *= 0.985; p.rot += p.rs; p.op -= 0.006;
        if (p.op > 0) {
          alive = true;
          cCtx.save(); cCtx.translate(p.x, p.y); cCtx.rotate(p.rot * Math.PI / 180);
          cCtx.globalAlpha = p.op; cCtx.fillStyle = p.col;
          cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6); cCtx.restore();
        }
      });
      if (alive) requestAnimationFrame(renderConfetti); else canvas.remove();
    }
    renderConfetti();

    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(10,12,16,0.92);backdrop-filter:blur(28px);border:1px solid rgba(229,9,20,0.5);border-radius:24px;padding:32px 48px;text-align:center;color:#fff;box-shadow:0 30px 80px rgba(0,0,0,0.9),0 0 40px rgba(229,9,20,0.4);z-index:1000000;';
    modal.innerHTML = `
      <div style="font-size:46px;margin-bottom:12px;">??</div>
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#e50914;font-weight:800;">Finished & Added to History</div>
      <h2 style="font-size:24px;margin:8px 0 16px;">${title}</h2>
      <button onclick="this.parentElement.remove()" style="background:#e50914;color:#fff;border:none;padding:10px 28px;border-radius:12px;font-weight:700;cursor:pointer;">Continue</button>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.remove(), 7000);
  };

  setInterval(() => {
    const video = document.querySelector('video');
    if (video && !video.dataset.afWatched) {
      video.dataset.afWatched = 'true';
      video.addEventListener('ended', () => {
        const title = document.querySelector('.videoOsdTitle, .videoTitle, .osdTitle, .itemName')?.textContent || 'Stream Finished';
        window.triggerCelebration(title.trim());
      });
    }
  }, 1000);

  // Status Pill
  const oldPill = document.getElementById('aetherfin-audio-pill');
  if (oldPill) oldPill.remove();
  const pill = document.createElement('div');
  pill.id = 'aetherfin-audio-pill';
  pill.style.cssText = 'position:fixed;bottom:16px;right:16px;background:rgba(14,16,22,0.85);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:6px 14px;color:#fff;font-size:12px;font-weight:600;display:flex;align-items:center;gap:8px;z-index:99999;cursor:pointer;box-shadow:0 6px 16px rgba(0,0,0,0.5);';
  pill.innerHTML = '<span>?? Ambient Themes: Active</span>';
  pill.onclick = () => {
    getAudioCtx();
    window.triggerCelebration('AetherFin Audio Test');
  };
  document.body.appendChild(pill);
})();