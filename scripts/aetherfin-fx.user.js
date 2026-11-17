// ==UserScript==
// @name         AetherFin FX Engine — Next-Gen Audio, Mobile & Detail Continuous Playback
// @namespace    https://jellyfin.org/
// @version      5.0.0
// @description  Cinematic ambient audio feedback for Jellyfin. Continuous detail page score, mobile touch support, and complete library theme music.
// @author       5H45H1K1R4N
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  // Prevent multiple executions while allowing hot updates
  if (window.__AETHERFIN_V5_LOADED__) return;
  window.__AETHERFIN_V5_LOADED__ = true;

  console.log('%c[AetherFin FX v5]%c Cinematic Audio & Continuous Mobile Suite Active', 
              'color: #e50914; font-weight: bold; font-size: 13px;', 'color: #06b6d4; font-weight: bold;');

  /* =========================================================================
     1. HIGH-SPEED CDN THEME DATABASE (Every title in library)
     ========================================================================= */
  const CDN_BASE = "https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/audio/themes";

  // Keyword / normalized title mappings
  const THEME_MAP = [
    { keys: ["interstellar"], file: "interstellar.mp3", title: "Interstellar" },
    { keys: ["3 idiots", "three idiots"], file: "3-idiots.mp3", title: "3 Idiots" },
    { keys: ["toxic"], file: "toxic.mp3", title: "Toxic" },
    { keys: ["stranger things"], file: "stranger-things.mp3", title: "Stranger Things" },
    { keys: ["dhoni", "ms dhoni", "m.s. dhoni", "untold story"], file: "ms-dhoni.mp3", title: "M.S. Dhoni" },
    { keys: ["tokyo drift", "fast and the furious tokyo drift", "fast and furious tokyo drift"], file: "tokyo-drift.mp3", title: "Tokyo Drift" },
    { keys: ["phata poster", "nikhla hero", "agal bagal"], file: "phata-poster.mp3", title: "Phata Poster Nikhla Hero" },
    { keys: ["iron man", "ironman"], file: "iron-man.mp3", title: "Iron Man" },
    { keys: ["avengers", "the avengers"], file: "avengers.mp3", title: "The Avengers" },
    { keys: ["doraemon", "undersea devil"], file: "doraemon.mp3", title: "Doraemon" },
    { keys: ["jailer"], file: "jailer-2.mp3", title: "Jailer 2" },
    { keys: ["premada oorali", "premada"], file: "premada-oorali.mp3", title: "Premada Oorali" },
    { keys: ["your name", "kimi no na wa"], file: "your-name.mp3", title: "Your Name." },
    { keys: ["hanuman ansh", "hanuman"], file: "hanuman-ansh.mp3", title: "Hanuman Ansh" },
    { keys: ["spider-man", "spiderman", "brand new day"], file: "spider-man.mp3", title: "Spider-Man" },
    { keys: ["breaking bad"], file: "breaking-bad.mp3", title: "Breaking Bad" },
    { keys: ["inception"], file: "inception.mp3", title: "Inception" },
    { keys: ["kalki", "kalki 2898", "bhairava"], file: "kalki.mp3", title: "Kalki 2898-AD" },
    { keys: ["slam dunk", "the first slam dunk"], file: "slam-dunk.mp3", title: "The First Slam Dunk" },
    { keys: ["from"], file: "from.mp3", title: "FROM" },
    { keys: ["jai ho"], file: "jai-ho.mp3", title: "Jai Ho" },
    { keys: ["alice in borderland", "borderland"], file: "alice-in-borderland.mp3", title: "Alice in Borderland" },
    { keys: ["grave of the fireflies", "fireflies"], file: "grave-of-fireflies.mp3", title: "Grave of the Fireflies" },
    { keys: ["princess kaguya", "kaguya"], file: "princess-kaguya.mp3", title: "The Tale of The Princess Kaguya" },
    { keys: ["final destination"], file: "final-destination.mp3", title: "Final Destination 5" },
    { keys: ["googly"], file: "googly.mp3", title: "Googly" },
    { keys: ["bridge to terabithia", "terabithia"], file: "bridge-to-terabithia.mp3", title: "Bridge to Terabithia" },
    { keys: ["bhooth bangla", "bhoot bangla"], file: "bhooth-bangla.mp3", title: "Bhooth Bangla" },
    { keys: ["i ve always liked you", "ive always liked you", "always liked you"], file: "i-ve-always-liked-you.mp3", title: "I've Always Liked You" },
    { keys: ["ikka"], file: "ikka.mp3", title: "Ikka" },
    { keys: ["ramayana"], file: "ramayana.mp3", title: "Ramayana" },
    { keys: ["udta teer"], file: "udta-teer.mp3", title: "Udta Teer" },
    { keys: ["visionquest", "vision quest"], file: "vision-quest.mp3", title: "VisionQuest" }
  ];

  /* =========================================================================
     2. AUDIO ENGINE (CROSS-PLATFORM: DESKTOP & MOBILE SAFARI/CHROME/WEBVIEW)
     ========================================================================= */
  let audioCtx = null;
  let isMuted = false;

  function getAudioCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Mobile & Desktop Hardware Audio Unlock
  function unlockAudio() {
    const ctx = getAudioCtx();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    // Also play 1 sample of silence to unlock iOS Safari & Android WebViews
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch (e) {}
    
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('pointerdown', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
  }

  ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'].forEach(evt => {
    document.addEventListener(evt, unlockAudio, { passive: true, once: false });
  });

  // UI Haptic sounds
  let lastHoverTick = 0;
  function playHapticTick() {
    if (isMuted) return;
    const now = performance.now();
    if (now - lastHoverTick < 80) return;
    lastHoverTick = now;

    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.025);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.028);
    } catch (e) {}
  }

  /* =========================================================================
     3. THEME MUSIC PLAYBACK CONTROLLER
     ========================================================================= */
  let currentAudio = null;
  let currentGain = null;
  let currentCardElem = null;
  let currentMatchedTheme = null;
  let hoverTimer = null;
  let isNavigatingToDetail = false;
  let isDetailPageActive = false;

  function normalize(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function findThemeForText(text) {
    if (!text) return null;
    const norm = normalize(text);
    for (const item of THEME_MAP) {
      for (const k of item.keys) {
        const normKey = normalize(k);
        if (norm.includes(normKey)) {
          return {
            title: item.title,
            url: `${CDN_BASE}/${item.file}`
          };
        }
      }
    }
    return null;
  }

  function extractCardTitle(card) {
    if (!card) return '';
    // Check multiple selectors used by Jellyfin 10.9 - 12+
    const selectors = [
      '.cardText-first',
      '.cardText',
      '.cardTitle',
      '.itemName',
      'a[data-itemid]',
      '.detailPagePrimaryContainer .itemName',
      'h1'
    ];
    for (const sel of selectors) {
      const el = card.querySelector(sel);
      if (el && el.textContent.trim()) {
        return el.textContent.trim();
      }
    }
    return card.getAttribute('data-title') || 
           card.getAttribute('aria-label') || 
           card.getAttribute('title') || 
           card.textContent.trim().split('\n')[0] || '';
  }

  function stopThemeMusic(fadeMs = 300) {
    if (!currentAudio) return;
    const audio = currentAudio;
    const gain = currentGain;
    currentAudio = null;
    currentGain = null;
    currentMatchedTheme = null;
    updateFloatingPill(null);

    const ctx = getAudioCtx();
    if (ctx && gain) {
      try {
        const now = ctx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (fadeMs / 1000));
      } catch (e) {}
    }

    setTimeout(() => {
      try {
        audio.pause();
        audio.src = '';
        audio.remove();
      } catch (e) {}
    }, fadeMs + 50);
  }

  function startThemeMusic(theme, isDetailPage = false) {
    if (isMuted) return;
    if (currentAudio && currentMatchedTheme && currentMatchedTheme.url === theme.url) {
      // Already playing this exact theme! Keep playing!
      return;
    }

    // Stop previous track smoothly
    stopThemeMusic(200);

    // Check if video is playing in Jellyfin
    const isVideoPlaying = document.querySelector('video:not(.paused)') && !document.querySelector('video').paused;
    if (isVideoPlaying) return;

    currentMatchedTheme = theme;
    updateFloatingPill(theme.title);

    try {
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.src = theme.url;
      audio.loop = true;

      const ctx = getAudioCtx();
      let gain = null;

      if (ctx) {
        try {
          const source = ctx.createMediaElementSource(audio);
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          // Detail page has warmer 3600Hz, hover has 3200Hz
          filter.frequency.setValueAtTime(isDetailPage ? 3600 : 3200, ctx.currentTime);

          gain = ctx.createGain();
          const targetVol = isDetailPage ? 0.18 : 0.16;
          gain.gain.setValueAtTime(0.0001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(targetVol, ctx.currentTime + 1.2);

          source.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          currentGain = gain;
        } catch (e) {
          // Fallback if MediaElementSource is restricted by browser
          audio.volume = isDetailPage ? 0.18 : 0.16;
        }
      } else {
        audio.volume = isDetailPage ? 0.18 : 0.16;
      }

      currentAudio = audio;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          // Autoplay policy prevented playback until user clicks
        });
      }
    } catch (e) {
      console.warn('[AetherFin] Audio start error:', e);
    }
  }

  /* =========================================================================
     4. SEAMLESS DETAIL PAGE CONTINUOUS PLAYBACK (User clicked hovered card)
     ========================================================================= */
  // Intercept click on any media card
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.card, .cardBox, .listItem');
    if (card) {
      playHapticTick();
      const rawTitle = extractCardTitle(card);
      const theme = findThemeForText(rawTitle);
      if (theme) {
        isNavigatingToDetail = true;
        // Keep playing into the detail page!
        if (!currentAudio || (currentMatchedTheme && currentMatchedTheme.url !== theme.url)) {
          startThemeMusic(theme, true);
        }
        // Reset navigation flag after transition completes
        setTimeout(() => {
          isNavigatingToDetail = false;
        }, 3000);
      }
    }

    // Stop theme if user clicks "Play" on a movie
    if (e.target.closest('.btnPlay, [data-action="play"], button[data-id="play"], .videoPlayButton')) {
      stopThemeMusic(400);
    }
  }, true);

  // Monitor SPA Page Changes (Jellyfin router)
  function checkDetailPage() {
    const detailContainer = document.querySelector('.itemDetailPage, .detailPage, .detailRibbon, [data-role="page"].itemDetailPage');
    if (detailContainer && !detailContainer.classList.contains('hide')) {
      isDetailPageActive = true;
      // Get title of the movie on the detail page
      const titleEl = detailContainer.querySelector('.itemName, .parentName, h1');
      const detailTitle = titleEl ? titleEl.textContent.trim() : '';
      const theme = findThemeForText(detailTitle);

      if (theme) {
        if (!currentAudio || (currentMatchedTheme && currentMatchedTheme.url !== theme.url)) {
          startThemeMusic(theme, true);
        }
      }
    } else {
      if (isDetailPageActive && !isNavigatingToDetail) {
        // User left detail page, stop background playback
        isDetailPageActive = false;
        stopThemeMusic(400);
      }
    }
  }

  // Observe route / DOM changes
  const observer = new MutationObserver(() => {
    checkDetailPage();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('popstate', checkDetailPage);
  window.addEventListener('hashchange', checkDetailPage);

  /* =========================================================================
     5. HOVER PLAYBACK WITH 450ms INTENTIONAL DWELL (Desktop Mouse)
     ========================================================================= */
  document.addEventListener('mouseover', (e) => {
    // If currently on a detail page, don't trigger hover events
    if (isDetailPageActive || isNavigatingToDetail) return;

    const card = e.target.closest('.card, .cardBox, .listItem');
    if (card && card !== currentCardElem) {
      currentCardElem = card;
      playHapticTick();

      if (hoverTimer) clearTimeout(hoverTimer);

      hoverTimer = setTimeout(() => {
        if (currentCardElem === card && !isNavigatingToDetail && !isDetailPageActive) {
          const rawTitle = extractCardTitle(card);
          const theme = findThemeForText(rawTitle);
          if (theme) {
            startThemeMusic(theme, false);
          }
        }
      }, 450); // 450ms dwell to filter accidental brush-overs
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (isNavigatingToDetail || isDetailPageActive) return;

    const card = e.target.closest('.card, .cardBox, .listItem');
    if (card && currentCardElem === card) {
      const related = e.relatedTarget;
      if (!related || !card.contains(related)) {
        if (hoverTimer) clearTimeout(hoverTimer);
        currentCardElem = null;
        stopThemeMusic(250); // Instant clean stop
      }
    }
  }, { passive: true });

  // Mobile Touch Support: Tap and hold (400ms) to preview theme without clicking
  let touchTimer = null;
  document.addEventListener('touchstart', (e) => {
    const card = e.target.closest('.card, .cardBox, .listItem');
    if (card && !isDetailPageActive) {
      if (touchTimer) clearTimeout(touchTimer);
      touchTimer = setTimeout(() => {
        const rawTitle = extractCardTitle(card);
        const theme = findThemeForText(rawTitle);
        if (theme) {
          startThemeMusic(theme, false);
        }
      }, 400);
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (touchTimer) clearTimeout(touchTimer);
  }, { passive: true });

  /* =========================================================================
     6. SLEEK FLOATING THEME PILL & MUTE TOGGLE
     ========================================================================= */
  let pillElem = null;
  function updateFloatingPill(title) {
    if (!pillElem) {
      pillElem = document.createElement('div');
      pillElem.id = 'aetherfin-audio-pill';
      pillElem.innerHTML = `
        <span class="aether-icon">🎵</span>
        <span class="aether-title"></span>
        <span class="aether-bars">
          <span></span><span></span><span></span>
        </span>
      `;
      pillElem.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        display: none;
        align-items: center;
        gap: 8px;
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 8px 16px;
        border-radius: 9999px;
        color: #f8fafc;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.3px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(229, 9, 20, 0.3);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        user-select: none;
      `;

      // Visual equalizer bars animation style
      const style = document.createElement('style');
      style.textContent = `
        #aetherfin-audio-pill .aether-bars {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 12px;
        }
        #aetherfin-audio-pill .aether-bars span {
          width: 2.5px;
          background: #e50914;
          border-radius: 2px;
          animation: aetherBar 0.8s ease-in-out infinite alternate;
        }
        #aetherfin-audio-pill .aether-bars span:nth-child(1) { height: 6px; animation-delay: 0.1s; }
        #aetherfin-audio-pill .aether-bars span:nth-child(2) { height: 12px; animation-delay: 0.3s; }
        #aetherfin-audio-pill .aether-bars span:nth-child(3) { height: 8px; animation-delay: 0.2s; }
        @keyframes aetherBar {
          0% { height: 3px; }
          100% { height: 12px; }
        }
      `;
      document.head.appendChild(style);

      pillElem.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
          stopThemeMusic(150);
          pillElem.style.opacity = '0.5';
          pillElem.querySelector('.aether-icon').textContent = '🔇';
        } else {
          pillElem.style.opacity = '1';
          pillElem.querySelector('.aether-icon').textContent = '🎵';
        }
      });

      document.body.appendChild(pillElem);
    }

    if (title && !isMuted) {
      pillElem.querySelector('.aether-title').textContent = title;
      pillElem.style.display = 'flex';
    } else {
      pillElem.style.display = 'none';
    }
  }

})();
