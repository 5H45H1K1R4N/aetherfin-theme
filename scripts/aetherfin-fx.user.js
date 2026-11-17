// ==UserScript==
// @name         AetherFin Suite — Universal Sound FX & Theme Music Engine (Web, Phone & TV)
// @namespace    https://jellyfin.org/
// @version      13.0.0
// @description  Bespoke Web Audio API UI sound effects (PS5 haptic hover/focus ticks, mechanical clicks, celebration fanfare) and local server theme song playback engine with full Desktop, Mobile Touch, and TV Remote D-pad support for Jellyfin.
// @author       5H45H1K1R4N
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  if (window.__AETHERFIN_V13_LOADED__) return;
  window.__AETHERFIN_V13_LOADED__ = true;

  console.log('%c[AetherFin FX v13]%c Universal Web, Phone & TV Engine Active', 
              'color: #00ac6f; font-weight: bold; font-size: 14px;', 'color: #ffffff; font-weight: bold;');

  const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const isTV = /Android TV|SmartTV|HbbTV|Tizen|WebOS|LargeScreen|CrKey/i.test(navigator.userAgent) || window.matchMedia('(display-mode: tv)').matches;

  // Clean up legacy multi-theme elements if present in DOM
  try {
    const oldBtn = document.getElementById('aetherfin-floating-theme-btn');
    if (oldBtn) oldBtn.remove();
    const oldModal = document.getElementById('aetherfin-theme-modal');
    if (oldModal) oldModal.remove();
    const oldThemeLink = document.getElementById('aetherfin-active-theme-link');
    if (oldThemeLink) oldThemeLink.remove();
    localStorage.removeItem('aetherfin_active_theme');
  } catch (e) {}

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

  // Play subtle PS5-style tactile hover/focus tick (140Hz sine burst)
  function playHoverTick() {
    if (isMuted) return;
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

  // Bind UI mouse hover sound effects (Desktop)
  document.addEventListener('mouseover', (e) => {
    if (e.target && e.target.closest('.card, .paper-icon-button-light, .button-flat, .navMenuOption')) {
      playHoverTick();
    }
  }, { passive: true });

  // Bind UI focus sound effects (TV D-Pad & Keyboard navigation)
  document.addEventListener('focusin', (e) => {
    if (e.target && e.target.closest('.card, .paper-icon-button-light, .button-flat, .navMenuOption, .listItem')) {
      playHoverTick();
    }
  }, { passive: true });

  // Bind UI click sound effects (Mouse, Touch & Remote Enter)
  document.addEventListener('click', (e) => {
    if (e.target && e.target.closest('.card, button, .button-flat, .paper-icon-button-light, a')) {
      playClickSound();
    }
  }, { passive: true });

  /* =========================================================================
     2. UNIVERSAL THEME MUSIC AUDIO PIPELINE
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

  // Universal audio unlock for Desktop, Touch (Phone) AND TV Remote (keydown)
  function unlockAudioEngine() {
    if (audioUnlocked) return;
    try {
      getAudioContext();
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

  // Listen to remote keys (D-pad, OK, etc.), touch, and click
  ['keydown', 'touchstart', 'touchend', 'click', 'pointerdown'].forEach(evt => {
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
          console.log("[AetherFin] Autoplay waiting for user gesture (key/touch):", err.message);
          const resumeOnGesture = () => {
            if (activeTheme && activeTheme.url === theme.url && globalAudio.paused) {
              globalAudio.play().catch(() => {});
            }
            document.removeEventListener('keydown', resumeOnGesture);
            document.removeEventListener('touchstart', resumeOnGesture);
            document.removeEventListener('click', resumeOnGesture);
          };
          document.addEventListener('keydown', resumeOnGesture, { passive: true, once: true });
          document.addEventListener('touchstart', resumeOnGesture, { passive: true, once: true });
          document.addEventListener('click', resumeOnGesture, { passive: true, once: true });
        });
      }
    } catch (e) {
      console.error("[AetherFin] Audio error:", e);
    }
  }

  /* =========================================================================
     3. DYNAMIC SERVER THEME SONG QUERY & CACHING
     ========================================================================= */
  const themeCache = {};

  function resolveThemeForItem(itemId, title, callback) {
    if (itemId && themeCache[itemId] !== undefined) {
      callback(themeCache[itemId]);
      return;
    }

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
          callback(null);
        })
        .catch(() => {
          themeCache[itemId] = null;
          callback(null);
        });
    } else {
      callback(null);
    }
  }

  /* =========================================================================
     4. DETAIL PAGE NAVIGATION & CARD INTERACTION
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

  // Intercept taps & clicks (Mouse & Touch)
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

  // Intercept TV Remote D-Pad Enter / OK key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === 'Select' || e.keyCode === 13) {
      const activeEl = document.activeElement;
      if (activeEl) {
        onCardClicked(activeEl);
      }
    }
  }, { passive: true });

  // Detail page enter / exit observer
  let lastDetailPageState = false;
  function checkRouteState() {
    const onDetail = isCurrentlyOnDetailPage();

    if (onDetail) {
      lastDetailPageState = true;
      const titleEl = document.querySelector('.itemName, .parentName, h1.itemName, .detailPagePrimaryContainer h1');
      const docTitle = document.title ? document.title.replace('- Jellyfin', '').trim() : '';
      const title = titleEl ? titleEl.textContent.trim() : docTitle;

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
     5. RESPONSIVE HOVER (DESKTOP) & FOCUS DWELL (TV REMOTE D-PAD)
     ========================================================================= */
  let dwellTimer = null;
  let currentActiveCard = null;

  function handleCardHighlight(cardContainer) {
    if (isCurrentlyOnDetailPage() || isNavigatingToDetail) return;
    if (!cardContainer) return;

    if (cardContainer !== currentActiveCard) {
      currentActiveCard = cardContainer;
      if (dwellTimer) clearTimeout(dwellTimer);

      dwellTimer = setTimeout(() => {
        if (currentActiveCard === cardContainer && !isCurrentlyOnDetailPage() && !isNavigatingToDetail) {
          const title = extractCardTitle(cardContainer);
          const itemId = extractCardItemId(cardContainer);

          resolveThemeForItem(itemId, title, (theme) => {
            if (currentActiveCard === cardContainer && !isCurrentlyOnDetailPage()) {
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
  }

  function handleCardLeave(cardContainer, relatedTarget) {
    if (isCurrentlyOnDetailPage() || isNavigatingToDetail) return;
    if (!cardContainer) return;

    if (cardContainer === currentActiveCard) {
      if (!relatedTarget || !cardContainer.contains(relatedTarget)) {
        if (dwellTimer) clearTimeout(dwellTimer);
        currentActiveCard = null;
        stopMusic(200);
      }
    }
  }

  // 1. Mouse hover events (Desktop)
  if (!isMobile && !isTV) {
    document.addEventListener('mouseover', (e) => {
      const card = e.target.closest('.card, .cardBox, .listItem');
      if (card) {
        handleCardHighlight(card.closest('.card') || card);
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      const card = e.target.closest('.card, .cardBox, .listItem');
      if (card) {
        handleCardLeave(card.closest('.card') || card, e.relatedTarget);
      }
    }, { passive: true });
  }

  // 2. Focus events (TV Remote Control D-pad & Keyboard)
  document.addEventListener('focusin', (e) => {
    const card = e.target.closest('.card, .cardBox, .listItem');
    if (card) {
      handleCardHighlight(card.closest('.card') || card);
    }
  }, { passive: true });

  document.addEventListener('focusout', (e) => {
    const card = e.target.closest('.card, .cardBox, .listItem');
    if (card) {
      handleCardLeave(card.closest('.card') || card, e.relatedTarget);
    }
  }, { passive: true });

  /* =========================================================================
     6. FLOATING AUDIO PILL (BOTTOM-RIGHT)
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
