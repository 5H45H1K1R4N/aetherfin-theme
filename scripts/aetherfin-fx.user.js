// ==UserScript==
// @name         AetherFin Suite — Sound FX & Theme Music Engine for Jellyfin
// @namespace    https://jellyfin.org/
// @version      12.0.0
// @description  Bespoke Web Audio API UI sound effects (PS5 haptic hover, mechanical clicks, celebration fanfare) and local server theme song playback engine for Jellyfin.
// @author       5H45H1K1R4N
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

/**
 * 🌌 AetherFin FX Engine — Plug-and-Play Demo & Inspiration Template
 * 
 * FEATURES INCLUDED:
 * 1. Web Audio API UI Sound Effects (0 audio files needed, 100% synthesized in-browser):
 *    - PS5-style haptic hover micro-ticks on cards.
 *    - Apple TV-style crisp mechanical click feedback on selection.
 *    - Triumphant completion fanfare when a video finishes playing.
 * 2. Native Jellyfin Server Theme Music Engine:
 *    - Automatically discovers and streams `theme.mp3` files from your server (`/Audio/{id}/stream.mp3`).
 *    - Desktop hover preview with intentional 400ms dwell & clean exit fade.
 *    - Continuous playback when navigating from library card to movie detail page.
 *    - Fully compatible with mobile WebViews (Jellyfin Android app touch gestures).
 *    - Floating animated equalizer audio pill with mute toggle.
 * 
 * HOW TO INSTALL:
 * Copy and paste this entire script into the Jellyfin "JavaScript Injector" plugin,
 * or run it via Tampermonkey / Violentmonkey in your browser!
 */

(function () {
  'use strict';

  if (window.__AETHERFIN_LOADED__) return;
  window.__AETHERFIN_LOADED__ = true;

  console.log('%c[AetherFin FX]%c Sound Effects & Theme Music Engine Active', 
              'color: #00ac6f; font-weight: bold; font-size: 14px;', 'color: #ffffff; font-weight: bold;');

  const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  // Automatically enable native theme song preferences in Jellyfin storage
  try {
    localStorage.setItem('enableThemeSongs', 'true');
    localStorage.setItem('enableBackdrops', 'true');
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.endsWith('-enableThemeSongs') || k === 'enableThemeSongs')) {
        localStorage.setItem(k, 'true');
      }
      if (k && (k.endsWith('-enableBackdrops') || k === 'enableBackdrops')) {
        localStorage.setItem(k, 'true');
      }
    }
  } catch (e) {}

  /* =========================================================================
     1. SYNTHESIZED WEB AUDIO API SOUND EFFECTS (0 Audio Files Needed)
     ========================================================================= */
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  // Play subtle PS5-style tactile hover tick (140Hz sine burst)
  function playHoverTick() {
    if (isMuted || isMobile) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch (e) {}
  }

  // Play crisp Apple TV-style mechanical click sound
  function playClickSound() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  }

  // Triumphant 4-tone victory celebration fanfare when completing a movie
  function playCelebrationFanfare() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.36);
      });
    } catch (e) {}
  }

  // Bind UI click & hover sound effects
  document.addEventListener('mouseover', (e) => {
    if (e.target && e.target.closest('.card, .paper-icon-button-light, .button-flat, .navMenuOption')) {
      playHoverTick();
    }
  }, { passive: true });

  document.addEventListener('click', (e) => {
    if (e.target && e.target.closest('.card, button, .button-flat, .paper-icon-button-light, a')) {
      playClickSound();
    }
  }, { passive: true });

  /* =========================================================================
     2. DEMO / CUSTOM THEME SONG MAPPINGS (Optional Static Fallback)
     =========================================================================
     Jellyfin will AUTOMATICALLY play native theme songs if you have `theme.mp3`
     in your movie folder! 
     However, you can also map any specific title to custom audio URLs below:
  */
  const DEMO_CUSTOM_THEMES = [
    // Template Examples:
    // { keys: ["interstellar"], url: "/Audio/your-id-here/stream.mp3", title: "Interstellar" },
    // { keys: ["stranger things"], url: "https://your-domain.com/audio/stranger-things.mp3", title: "Stranger Things" },
  ];

  /* =========================================================================
     3. UNIVERSAL THEME MUSIC AUDIO PIPELINE
     ========================================================================= */
  let globalAudio = document.getElementById('aetherfin-global-audio');
  if (!globalAudio) {
    globalAudio = document.createElement('audio');
    globalAudio.id = 'aetherfin-global-audio';
    globalAudio.setAttribute('playsinline', '');
    globalAudio.setAttribute('webkit-playsinline', '');
    globalAudio.preload = 'auto';
    globalAudio.style.display = 'none';
    document.body.appendChild(globalAudio);
  }

  let activeTheme = null;
  let isMuted = false;
  let fadeTimer = null;
  let audioUnlocked = false;

  function unlockAudioEngine() {
    if (audioUnlocked) return;
    try {
      const p = globalAudio.play();
      if (p !== undefined) {
        p.then(() => {
          audioUnlocked = true;
          if (!activeTheme) {
            globalAudio.pause();
          }
        }).catch(() => {});
      }
    } catch (e) {}
  }

  ['touchstart', 'touchend', 'click', 'pointerdown'].forEach(evt => {
    document.addEventListener(evt, unlockAudioEngine, { passive: true });
  });

  function stopMusic(fadeMs = 250) {
    if (!activeTheme && globalAudio.paused) return;
    activeTheme = null;
    updateFloatingPill(null);

    if (fadeTimer) clearInterval(fadeTimer);

    const stepMs = 25;
    const steps = Math.max(1, fadeMs / stepMs);
    const volStep = (globalAudio.volume || 0.2) / steps;

    fadeTimer = setInterval(() => {
      try {
        if (globalAudio.volume > volStep) {
          globalAudio.volume -= volStep;
        } else {
          globalAudio.volume = 0;
          clearInterval(fadeTimer);
          globalAudio.pause();
        }
      } catch (e) {
        clearInterval(fadeTimer);
        try { globalAudio.pause(); } catch (err) {}
      }
    }, stepMs);
  }

  function playTheme(theme, targetVolume = 0.22) {
    if (isMuted || !theme) return;
    if (activeTheme && activeTheme.url === theme.url && !globalAudio.paused) {
      return; // Already playing this track
    }

    if (fadeTimer) clearInterval(fadeTimer);

    // Don't play theme audio if a video is currently playing in Jellyfin
    const isVideoPlaying = document.querySelector('video:not(.paused)') && !document.querySelector('video').paused;
    if (isVideoPlaying) return;

    activeTheme = theme;
    updateFloatingPill(theme.title);

    try {
      globalAudio.pause();
      globalAudio.src = theme.url;
      globalAudio.loop = true;
      globalAudio.volume = 0.04;

      const playPromise = globalAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audioUnlocked = true;
          let currentVol = 0.04;
          const fadeIn = setInterval(() => {
            if (!activeTheme || activeTheme.url !== theme.url) {
              clearInterval(fadeIn);
              return;
            }
            currentVol += 0.03;
            if (currentVol >= targetVolume) {
              globalAudio.volume = targetVolume;
              clearInterval(fadeIn);
            } else {
              globalAudio.volume = currentVol;
            }
          }, 35);
        }).catch((err) => {
          const resumeOnTouch = () => {
            if (activeTheme && activeTheme.url === theme.url && globalAudio.paused) {
              globalAudio.play().catch(() => {});
            }
            document.removeEventListener('touchstart', resumeOnTouch);
            document.removeEventListener('click', resumeOnTouch);
          };
          document.addEventListener('touchstart', resumeOnTouch, { passive: true, once: true });
          document.addEventListener('click', resumeOnTouch, { passive: true, once: true });
        });
      }
    } catch (e) {
      console.error("[AetherFin] Audio error:", e);
    }
  }

  /* =========================================================================
     4. DYNAMIC SERVER THEME SONG QUERY & CACHING
     ========================================================================= */
  const themeCache = {};

  function resolveThemeForItem(itemId, title, callback) {
    // 1. Check in-memory cache
    if (itemId && themeCache[itemId] !== undefined) {
      callback(themeCache[itemId]);
      return;
    }

    // 2. Query Jellyfin Server for native ThemeSongs
    if (itemId) {
      fetch(`/Items/${itemId}/ThemeSongs`, { credentials: 'same-origin' })
        .then(r => r.json())
        .then(data => {
          const items = data.Items || [];
          if (items.length > 0) {
            const result = {
              title: title || items[0].Name || 'Theme Song',
              url: `/Audio/${items[0].Id}/stream.mp3`
            };
            themeCache[itemId] = result;
            callback(result);
            return;
          }
          themeCache[itemId] = null;
          checkCustomFallback();
        })
        .catch(() => {
          themeCache[itemId] = null;
          checkCustomFallback();
        });
    } else {
      checkCustomFallback();
    }

    // 3. Fallback to custom mapped themes if no server ThemeSong is found
    function checkCustomFallback() {
      if (!title) { callback(null); return; }
      const norm = title.toLowerCase().trim();
      for (const item of DEMO_CUSTOM_THEMES) {
        for (const k of item.keys) {
          if (norm.includes(k.toLowerCase())) {
            callback({ title: item.title, url: item.url });
            return;
          }
        }
      }
      callback(null);
    }
  }

  /* =========================================================================
     5. DETAIL PAGE NAVIGATION & CARD INTERACTION
     ========================================================================= */
  let isNavigatingToDetail = false;

  function isCurrentlyOnDetailPage() {
    const hash = (window.location.hash || '').toLowerCase();
    const href = (window.location.href || '').toLowerCase();

    if (hash.includes('home') || hash.includes('movies') || hash.includes('tv') || 
        hash.includes('search') || hash === '#/' || hash === '' || hash === '#!/home') {
      return false;
    }

    return hash.includes('details') || href.includes('details') || hash.includes('item?id=');
  }

  function extractCardTitle(card) {
    if (!card) return '';
    const attrTitle = card.getAttribute('data-title') || card.getAttribute('aria-label') || card.getAttribute('title');
    if (attrTitle && attrTitle.trim()) return attrTitle.trim();

    const titleEl = card.querySelector('.cardText-first, .cardText, .cardTitle, .itemName');
    if (titleEl && titleEl.textContent.trim()) return titleEl.textContent.trim();

    return (card.textContent || '').trim().split('\n')[0].trim();
  }

  function extractCardItemId(card) {
    if (!card) return null;
    return card.getAttribute('data-id') || card.getAttribute('data-itemid') || null;
  }

  // Intercept taps & clicks
  function onCardClicked(target) {
    const card = target.closest('.card, .cardBox, .listItem, a[data-itemid], [data-id]');
    if (card) {
      const cardContainer = card.closest('.card') || card;
      const title = extractCardTitle(cardContainer);
      const itemId = extractCardItemId(cardContainer);

      resolveThemeForItem(itemId, title, (theme) => {
        if (theme) {
          isNavigatingToDetail = true;
          playTheme(theme, 0.24);
          setTimeout(() => { isNavigatingToDetail = false; }, 3500);
        }
      });
    }

    if (target.closest('.btnPlay, [data-action="play"], button[data-id="play"], .videoPlayButton')) {
      stopMusic(300);
    }
  }

  document.addEventListener('click', (e) => { onCardClicked(e.target); }, true);
  document.addEventListener('touchend', (e) => { if (e.target) onCardClicked(e.target); }, { passive: true });

  // Detail page enter / exit observer
  let lastDetailPageState = false;
  function checkRouteState() {
    const onDetail = isCurrentlyOnDetailPage();

    if (onDetail) {
      lastDetailPageState = true;
      const titleEl = document.querySelector('.itemName, .parentName, h1.itemName, .detailPagePrimaryContainer h1');
      const docTitle = document.title ? document.title.replace('- Jellyfin', '').trim() : '';
      const title = titleEl ? titleEl.textContent.trim() : docTitle;

      // Extract item ID from URL
      const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || window.location.search);
      const itemId = urlParams.get('id');

      resolveThemeForItem(itemId, title, (theme) => {
        if (theme) {
          if (!activeTheme || activeTheme.url !== theme.url || globalAudio.paused) {
            playTheme(theme, 0.22);
          }
        }
      });
    } else {
      if (lastDetailPageState && !isNavigatingToDetail) {
        lastDetailPageState = false;
        stopMusic(300);
      }
    }
  }

  window.addEventListener('popstate', checkRouteState);
  window.addEventListener('hashchange', checkRouteState);
  const routeObserver = new MutationObserver(checkRouteState);
  routeObserver.observe(document.body, { childList: true, subtree: true });

  /* =========================================================================
     6. RESPONSIVE HOVER SWITCHING (DESKTOP)
     ========================================================================= */
  let hoverTimer = null;
  let currentCardElem = null;

  if (!isMobile) {
    document.addEventListener('mouseover', (e) => {
      if (isCurrentlyOnDetailPage() || isNavigatingToDetail) return;

      const card = e.target.closest('.card, .cardBox, .listItem');
      if (!card) return;

      const cardContainer = card.closest('.card') || card;

      if (cardContainer !== currentCardElem) {
        currentCardElem = cardContainer;
        if (hoverTimer) clearTimeout(hoverTimer);

        hoverTimer = setTimeout(() => {
          if (currentCardElem === cardContainer && !isCurrentlyOnDetailPage() && !isNavigatingToDetail) {
            const title = extractCardTitle(cardContainer);
            const itemId = extractCardItemId(cardContainer);

            resolveThemeForItem(itemId, title, (theme) => {
              if (currentCardElem === cardContainer && !isCurrentlyOnDetailPage()) {
                if (theme) {
                  playTheme(theme, 0.18);
                } else {
                  stopMusic(200);
                }
              }
            });
          }
        }, 400); // 400ms intentional dwell
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      if (isCurrentlyOnDetailPage() || isNavigatingToDetail) return;

      const card = e.target.closest('.card, .cardBox, .listItem');
      if (!card) return;

      const cardContainer = card.closest('.card') || card;

      if (cardContainer === currentCardElem) {
        const related = e.relatedTarget;
        if (!related || !cardContainer.contains(related)) {
          if (hoverTimer) clearTimeout(hoverTimer);
          currentCardElem = null;
          stopMusic(200);
        }
      }
    }, { passive: true });
  }

  /* =========================================================================
     7. FLOATING AUDIO PILL (BOTTOM-RIGHT)
     ========================================================================= */
  const uiStyles = document.createElement('style');
  uiStyles.textContent = `
    #aetherfin-audio-pill {
      position: fixed;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 76px);
      right: 16px;
      z-index: 999998;
      display: none;
      align-items: center;
      gap: 8px;
      background: rgba(18, 18, 18, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7);
      padding: 8px 14px;
      border-radius: 9999px;
      color: #f4f4f5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      user-select: none;
    }

    @media (min-width: 769px) {
      #aetherfin-audio-pill {
        bottom: 24px;
        right: 20px;
      }
    }

    #aetherfin-audio-pill .aether-bars {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 12px;
    }
    #aetherfin-audio-pill .aether-bars span {
      width: 2.5px;
      background: #00ac6f;
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
  document.head.appendChild(uiStyles);

  let pillElem = null;
  function updateFloatingPill(title) {
    if (!pillElem) {
      pillElem = document.createElement('div');
      pillElem.id = 'aetherfin-audio-pill';
      pillElem.innerHTML = `
        <span class="aether-icon" title="Mute/Unmute">🎵</span>
        <span class="aether-title"></span>
        <span class="aether-bars">
          <span></span><span></span><span></span>
        </span>
      `;

      pillElem.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
          stopMusic(150);
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
