// ==UserScript==
// @name         AetherFin Suite — Universal Sound FX & Local Theme Music Engine
// @namespace    https://jellyfin.org/
// @version      16.0.0
// @description  Upgraded tactile UI sound effects (higher volume, modern pop chime hover, mechanical clicks), cinematic Hero Media Bar integration, and local server theme song playback engine across Web, Phone & TV.
// @author       5H45H1K1R4N
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  if (window.__AETHERFIN_V16_LOADED__) return;
  window.__AETHERFIN_V16_LOADED__ = true;

  console.log('%c[AetherFin FX v16]%c Wall of Fame & Sound Suite Active', 
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

  // Automatically enable native theme song preferences in Jellyfin client storage
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
     1. CINEMATIC HERO MEDIA BAR AUTO-LOADER
     ========================================================================= */
  (function initHeroMediaBar() {
    if (window.__MEDIABAR_INITIALIZED__) return;
    window.__MEDIABAR_INITIALIZED__ = true;

    // 1. Google Fonts for Media Bar
    if (!document.getElementById('aetherfin-mediabar-fonts')) {
      const fonts = document.createElement('link');
      fonts.id = 'aetherfin-mediabar-fonts';
      fonts.rel = 'stylesheet';
      fonts.href = 'https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&family=IBM+Plex+Mono:wght@400;600&display=swap';
      document.head.appendChild(fonts);
    }

    // 2. Base Media Bar CSS from Server
    if (!document.getElementById('aetherfin-mediabar-css')) {
      const css = document.createElement('link');
      css.id = 'aetherfin-mediabar-css';
      css.rel = 'stylesheet';
      css.href = '/MediaBar/slideshowpure.css';
      document.head.appendChild(css);
    }

    // 3. Media Bar Engine Script from Server
    if (!document.getElementById('aetherfin-mediabar-js')) {
      const script = document.createElement('script');
      script.id = 'aetherfin-mediabar-js';
      script.defer = true;
      script.src = '/MediaBar/slideshowpure.js';
      document.head.appendChild(script);
      console.log('[AetherFin] Cinematic Hero Media Bar initialized from server.');
    }
  })();

  /* =========================================================================
     2. UPGRADED WEB AUDIO API UI SOUND EFFECTS (Crisper & Louder)
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

  // Modern acoustic bubble/pop chime (Audible on TV, Phone & Desktop)
  function playHoverSound() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(520, t);
      osc1.frequency.exponentialRampToValueAtTime(700, t + 0.04);
      gain1.gain.setValueAtTime(0.14, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.055);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.06);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1040, t);
      gain2.gain.setValueAtTime(0.07, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.04);
    } catch (e) {}
  }

  // Crisp mechanical tactile snap click
  function playClickSound() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(840, t);
      osc1.frequency.exponentialRampToValueAtTime(180, t + 0.045);
      gain1.gain.setValueAtTime(0.20, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.055);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(220, t);
      osc2.frequency.exponentialRampToValueAtTime(80, t + 0.04);
      gain2.gain.setValueAtTime(0.12, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.05);
    } catch (e) {}
  }

  // Bind mouse hover (Desktop)
  document.addEventListener('mouseover', (e) => {
    if (e.target && e.target.closest('.card, .paper-icon-button-light, .button-flat, .navMenuOption, .action-btn')) {
      playHoverSound();
    }
  }, { passive: true });

  // Bind TV remote D-Pad & keyboard focus (TV & Keyboard)
  document.addEventListener('focusin', (e) => {
    if (e.target && e.target.closest('.card, .paper-icon-button-light, .button-flat, .navMenuOption, .listItem, .action-btn')) {
      playHoverSound();
    }
  }, { passive: true });

  // Bind click (Mouse, Touch & Remote OK)
  document.addEventListener('click', (e) => {
    if (e.target && e.target.closest('.card, button, .button-flat, .paper-icon-button-light, a, .action-btn')) {
      playClickSound();
    }
  }, { passive: true });

  /* =========================================================================
     3. LOCAL SERVER THEME SONG DATABASE (Direct Local /Audio Stream)
     ========================================================================= */
  const SERVER_THEME_MAP = [
    { keys: ["3 idiots", "three idiots"], streamUrl: "/Audio/6ba6543f2cbe37cce0d0af6fe3908bab/stream.mp3", title: "3 Idiots" },
    { keys: ["alice in borderland", "borderland"], streamUrl: "/Audio/6b76cd76c93918931e119b56e0e3faf1/stream.mp3", title: "Alice in Borderland" },
    { keys: ["avengers", "the avengers"], streamUrl: "/Audio/e9ea5d1e34c6208483fcb4652733ec27/stream.mp3", title: "The Avengers" },
    { keys: ["bhooth bangla", "bhoot bangla"], streamUrl: "/Audio/441f9392069cb989a20217dc312a6852/stream.mp3", title: "Bhooth Bangla" },
    { keys: ["breaking bad"], streamUrl: "/Audio/2823a020f96c35d576795c1f5c1a279c/stream.mp3", title: "Breaking Bad" },
    { keys: ["bridge to terabithia", "terabithia"], streamUrl: "/Audio/99348b19c152a7b853b3c3912ca4271b/stream.mp3", title: "Bridge to Terabithia" },
    { keys: ["doraemon", "undersea devil"], streamUrl: "/Audio/eab7b766a70eb94640b5b94686b29cb8/stream.mp3", title: "Doraemon" },
    { keys: ["tokyo drift", "fast and the furious tokyo drift", "fast and furious tokyo drift"], streamUrl: "/Audio/16747c25ad27ab5ea284ed7944e59694/stream.mp3", title: "Tokyo Drift" },
    { keys: ["final destination"], streamUrl: "/Audio/23b6b8e9667c28be8d8cad1aefd0544f/stream.mp3", title: "Final Destination 5" },
    { keys: ["slam dunk", "the first slam dunk"], streamUrl: "/Audio/fab5533bff0069ae1d1a81441cc0b8fe/stream.mp3", title: "The First Slam Dunk" },
    { keys: ["from series", "show from", "series from"], isExactFrom: true, streamUrl: "/Audio/49a9933e90dc941f2cc2efc092f6b79d/stream.mp3", title: "FROM" },
    { keys: ["googly"], streamUrl: "/Audio/af07178ff6e7a4b737b1a0ecc424152f/stream.mp3", title: "Googly" },
    { keys: ["grave of the fireflies", "fireflies"], streamUrl: "/Audio/5c0a14098ef7d1b203cf8960cd35c330/stream.mp3", title: "Grave of the Fireflies" },
    { keys: ["ikka"], streamUrl: "/Audio/5a43e5d384eb514973f8b6c4268f8298/stream.mp3", title: "Ikka" },
    { keys: ["inception"], streamUrl: "/Audio/22d43c99d7a50607930013b0a4938f35/stream.mp3", title: "Inception" },
    { keys: ["interstellar"], streamUrl: "/Audio/50574993365efe65be557fa0905a37ae/stream.mp3", title: "Interstellar" },
    { keys: ["iron man 2"], streamUrl: "/Audio/5b3d5bf75e85c0af0725f72da28c3416/stream.mp3", title: "Iron Man 2" },
    { keys: ["iron man 3"], streamUrl: "/Audio/93bf19a14de6ae9b87af5c0e9e9c12f4/stream.mp3", title: "Iron Man 3" },
    { keys: ["iron man", "ironman"], streamUrl: "/Audio/725b5e3a127ad7b950bcf77f4d2689ec/stream.mp3", title: "Iron Man" },
    { keys: ["jai ho"], streamUrl: "/Audio/a67123e5ca2fa34d2cfe359c29c3bb25/stream.mp3", title: "Jai Ho" },
    { keys: ["jailer"], streamUrl: "/Audio/b67364625cab6bb82bdaa4e40039007f/stream.mp3", title: "Jailer 2" },
    { keys: ["kalki", "kalki 2898", "bhairava"], streamUrl: "/Audio/7ef3fd66216d0176e3347d61c5f11aeb/stream.mp3", title: "Kalki 2898-AD" },
    { keys: ["dhoni", "ms dhoni", "m.s. dhoni", "untold story"], streamUrl: "/Audio/af07545b6b0ad4e8402d920403a50b79/stream.mp3", title: "M.S. Dhoni" },
    { keys: ["phata poster", "nikhla hero", "agal bagal"], streamUrl: "/Audio/4052aae360684c5f2b5ebd9749192afc/stream.mp3", title: "Phata Poster Nikhla Hero" },
    { keys: ["spider-man", "spiderman", "brand new day"], streamUrl: "/Audio/910b987f1bb263e83d97144174d24cb5/stream.mp3", title: "Spider-Man" },
    { keys: ["stranger things"], streamUrl: "/Audio/6e9a17cac145d8d51f55e106a5e1e67f/stream.mp3", title: "Stranger Things" },
    { keys: ["princess kaguya", "kaguya"], streamUrl: "/Audio/c7c526c5506d6cb4a81b98df51f5db6c/stream.mp3", title: "The Tale of The Princess Kaguya" },
    { keys: ["toxic"], streamUrl: "/Audio/60594c74acdd6dd572ebd37773a751bd/stream.mp3", title: "Toxic" },
    { keys: ["udta teer"], streamUrl: "/Audio/3bcaf0d6219288c7794fbb2cb9f85937/stream.mp3", title: "Udta Teer" },
    { keys: ["visionquest", "vision quest"], streamUrl: "/Audio/aa9cfb350481d949dccf870b06d5d054/stream.mp3", title: "VisionQuest" },
    { keys: ["your name", "kimi no na wa"], streamUrl: "/Audio/de6b56676a3c8a3ab1ca0563d1421014/stream.mp3", title: "Your Name." }
  ];

  /* =========================================================================
     4. UNIVERSAL THEME MUSIC AUDIO PIPELINE
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

  ['keydown', 'touchstart', 'touchend', 'click', 'pointerdown'].forEach(evt => {
    document.addEventListener(evt, unlockAudioEngine, { passive: true });
  });

  function normalize(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function findThemeForText(text) {
    if (!text) return null;
    const norm = normalize(text);
    if (!norm) return null;

    if (norm === "from" || norm.startsWith("from ") || norm.endsWith(" from")) {
      return { title: "FROM", url: "/Audio/49a9933e90dc941f2cc2efc092f6b79d/stream.mp3" };
    }

    for (const item of SERVER_THEME_MAP) {
      if (item.isExactFrom) continue;
      for (const k of item.keys) {
        const normKey = normalize(k);
        if (norm.includes(normKey)) {
          return {
            title: item.title,
            url: item.streamUrl
          };
        }
      }
    }
    return null;
  }

  function stopMusic(fadeMs = 250) {
    if (!activeTheme && globalAudio.paused) return;
    activeTheme = null;
    updateFloatingPill(null);

    if (fadeTimer) clearInterval(fadeTimer);

    const stepMs = 25;
    const steps = Math.max(1, fadeMs / stepMs);
    const volStep = (globalAudio.volume || 0.35) / steps;

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

  function playTheme(theme, targetVolume = 0.35) {
    if (isMuted || !theme) return;
    if (activeTheme && activeTheme.url === theme.url && !globalAudio.paused) {
      return;
    }

    if (fadeTimer) clearInterval(fadeTimer);

    const isVideoPlaying = document.querySelector('video:not(.paused)') && !document.querySelector('video').paused;
    if (isVideoPlaying) return;

    activeTheme = theme;
    updateFloatingPill(theme.title);

    try {
      globalAudio.pause();
      globalAudio.src = theme.url;
      globalAudio.loop = true;
      globalAudio.volume = 0.05;

      const playPromise = globalAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audioUnlocked = true;
          let currentVol = 0.05;
          const fadeIn = setInterval(() => {
            if (!activeTheme || activeTheme.url !== theme.url) {
              clearInterval(fadeIn);
              return;
            }
            currentVol += 0.04;
            if (currentVol >= targetVolume) {
              globalAudio.volume = targetVolume;
              clearInterval(fadeIn);
            } else {
              globalAudio.volume = currentVol;
            }
          }, 35);
        }).catch((err) => {
          console.log("[AetherFin] Autoplay waiting for gesture:", err.message);
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
     5. THEME RESOLVER (Local Server Map + Dynamic ApiClient Fallback)
     ========================================================================= */
  const themeCache = {};

  function resolveThemeForItem(itemId, title, callback) {
    const localTheme = findThemeForText(title);
    if (localTheme) {
      callback(localTheme);
      return;
    }

    if (itemId && themeCache[itemId] !== undefined) {
      callback(themeCache[itemId]);
      return;
    }

    if (window.ApiClient && itemId) {
      window.ApiClient.getJSON(window.ApiClient.getUrl('Items/' + itemId + '/ThemeSongs'))
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
     6. DETAIL PAGE NAVIGATION & CARD INTERACTION
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

  function onCardClicked(target) {
    const card = target.closest('.card, .cardBox, .listItem, a[data-itemid], [data-id], .slide');
    if (card) {
      const cardContainer = card.closest('.card') || card;
      const title = extractCardTitle(cardContainer);
      const itemId = extractCardItemId(cardContainer);

      resolveThemeForItem(itemId, title, (theme) => {
        if (theme) {
          isNavigatingToDetail = true;
          playTheme(theme, 0.35);
          setTimeout(() => { isNavigatingToDetail = false; }, 3500);
        }
      });
    }

    if (target.closest('.btnPlay, [data-action="play"], button[data-id="play"], .videoPlayButton, .action-btn.play')) {
      stopMusic(300);
    }
  }

  document.addEventListener('click', (e) => { onCardClicked(e.target); }, true);
  document.addEventListener('touchend', (e) => { if (e.target) onCardClicked(e.target); }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === 'Select' || e.keyCode === 13) {
      const activeEl = document.activeElement;
      if (activeEl) {
        onCardClicked(activeEl);
      }
    }
  }, { passive: true });

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
            playTheme(theme, 0.35);
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
     7. RESPONSIVE HOVER (DESKTOP) & FOCUS DWELL (TV REMOTE D-PAD)
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
                playTheme(theme, 0.28);
              } else {
                stopMusic(200);
              }
            }
          });
        }
      }, 400);
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
     8. FLOATING AUDIO PILL (BOTTOM-RIGHT)
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
        bottom: 80px;
        right: 20px;
      }
    }

/* =========================================================================
   6. LUXURY FAMILY WALL OF FAME (Dashboard, Modals & Celebration)
   ========================================================================= */

/* Floating Wall of Fame Pill Button */
#aetherfin-fame-btn {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 24px);
  right: 20px;
  z-index: 999990;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(15, 15, 15, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 172, 111, 0.4);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 172, 111, 0.2);
  padding: 10px 18px;
  border-radius: 9999px;
  color: #ffffff;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

#aetherfin-fame-btn:hover,
#aetherfin-fame-btn:focus-visible {
  transform: translateY(-2px) scale(1.04);
  border-color: #00ac6f;
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.9), 0 0 24px rgba(0, 172, 111, 0.4);
  outline: none;
}

#aetherfin-fame-btn .aether-fame-icon {
  font-size: 16px;
  filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.6));
  animation: aetherCrownGlow 2s ease-in-out infinite alternate;
}

@keyframes aetherCrownGlow {
  0% { transform: scale(1) rotate(0deg); }
  100% { transform: scale(1.15) rotate(4deg); }
}

@media (max-width: 768px) {
  #aetherfin-fame-btn {
    bottom: calc(env(safe-area-inset-bottom, 0px) + 76px);
    right: 14px;
    padding: 8px 14px;
    font-size: 12px;
  }
}

/* Header Integrated Button (when placed in header) */
.aetherfin-header-fame-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #fff;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-right: 10px;
  transition: all 0.2s ease;
}
.aetherfin-header-fame-btn:hover {
  background: rgba(0, 172, 111, 0.2);
  border-color: #00ac6f;
  color: #00ac6f;
}

/* Fullscreen Frosted Wall of Fame Modal Backdrop */
#aetherfin-fame-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999999;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 24px;
  box-sizing: border-box;
}

#aetherfin-fame-modal.active {
  opacity: 1;
  pointer-events: auto;
}

/* Main Modal Window */
.aether-fame-window {
  width: 100%;
  max-width: 1100px;
  max-height: 90vh;
  background: #0d0d0d;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.95), 0 0 40px rgba(0, 172, 111, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: scale(0.95);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

#aetherfin-fame-modal.active .aether-fame-window {
  transform: scale(1);
}

/* Modal Header */
.aether-fame-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(25, 25, 25, 0.6) 0%, rgba(13, 13, 13, 0) 100%);
}

.aether-fame-title-group h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.aether-fame-title-group p {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
}

.aether-fame-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.aether-fame-btn-refresh,
.aether-fame-btn-close {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.aether-fame-btn-refresh:hover,
.aether-fame-btn-close:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.08);
}
.aether-fame-btn-close:hover {
  background: rgba(255, 71, 87, 0.2);
  border-color: #ff4757;
  color: #ff4757;
}

/* Modal Scrollable Body */
.aether-fame-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Leaderboard Grid */
.aether-fame-section-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #00ac6f;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.aether-fame-leaderboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.aether-fame-user-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  transition: all 0.25s ease;
  cursor: pointer;
}

.aether-fame-user-card:hover,
.aether-fame-user-card:focus {
  transform: translateY(-4px);
  border-color: rgba(0, 172, 111, 0.5);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7);
  outline: none;
}

.aether-fame-rank-badge {
  position: absolute;
  top: 10px;
  left: 12px;
  font-size: 13px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.aether-fame-user-avatar {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  margin-top: 6px;
  margin-bottom: 10px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
}

.aether-fame-user-name {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.aether-fame-user-count {
  font-size: 13px;
  color: #00ac6f;
  font-weight: 600;
  margin-top: 4px;
}

.aether-fame-user-last {
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Feed Filters */
.aether-fame-filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.aether-filter-pill {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.aether-filter-pill:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.aether-filter-pill.active {
  background: #00ac6f;
  border-color: #00ac6f;
  color: #000;
  font-weight: 700;
}

/* Activity Feed List */
.aether-fame-feed {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.aether-feed-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  display: flex;
  overflow: hidden;
  height: 105px;
  transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  text-decoration: none;
}

.aether-feed-card:hover,
.aether-feed-card:focus {
  transform: translateY(-3px) scale(1.02);
  border-color: rgba(0, 172, 111, 0.5);
  background: rgba(255, 255, 255, 0.07);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.7);
  outline: none;
}

.aether-feed-poster {
  width: 72px;
  min-width: 72px;
  height: 100%;
  background: #1a1a1a;
  object-fit: cover;
}

.aether-feed-info {
  flex: 1;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.aether-feed-badge-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.aether-feed-user-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 6px;
  color: #000;
}

.aether-feed-type-tag {
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
}

.aether-feed-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.aether-feed-series {
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 2px 0 0 0;
}

.aether-feed-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 6px;
}

/* Celebration Achievement Toast */
#aether-celebration-toast {
  position: fixed;
  top: 28px;
  right: 28px;
  z-index: 9999999;
  background: rgba(14, 14, 14, 0.94);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 215, 0, 0.5);
  border-radius: 18px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: #fff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 215, 0, 0.25);
  animation: aetherToastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  max-width: 380px;
}

@keyframes aetherToastSlideIn {
  0% { transform: translateY(-40px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.aether-toast-icon {
  font-size: 32px;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
  animation: aetherPulse 1.2s infinite alternate;
}

@keyframes aetherPulse {
  0% { transform: scale(0.95); }
  100% { transform: scale(1.1); }
}

.aether-toast-body {
  flex: 1;
}

.aether-toast-title {
  font-size: 14px;
  font-weight: 800;
  color: #ffd700;
  letter-spacing: -0.01em;
}

.aether-toast-subtitle {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}

.aether-toast-sub2 {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 3px;
}

.aether-toast-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
}
.aether-toast-close:hover {
  color: #fff;
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



  /* =========================================================================
     9. MOVIE FINISHED CELEBRATION (Fanfare, Confetti Cannon & Achievement Toast)
     ========================================================================= */
  const JELLYFIN_SERVER_TOKEN = '2d2051fbff00417eb2526343d3e1450f';

  function playVictoryFanfare() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      // Orchestral brass fanfare progression: C4 -> E4 -> G4 -> C5 -> Harmonized chord
      const fanfareNotes = [
        { f: 261.63, start: 0.00, dur: 0.12, vol: 0.18 }, // C4
        { f: 329.63, start: 0.12, dur: 0.12, vol: 0.18 }, // E4
        { f: 392.00, start: 0.24, dur: 0.15, vol: 0.20 }, // G4
        { f: 523.25, start: 0.38, dur: 0.50, vol: 0.22 }, // C5
        { f: 659.25, start: 0.38, dur: 0.50, vol: 0.16 }, // E5
        { f: 783.99, start: 0.38, dur: 0.50, vol: 0.16 }, // G5
        { f: 1046.50, start: 0.42, dur: 0.50, vol: 0.12 } // C6 shimmer
      ];

      fanfareNotes.forEach(n => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t + n.start);

        gain.gain.setValueAtTime(0.001, t + n.start);
        gain.gain.exponentialRampToValueAtTime(n.vol, t + n.start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.start + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + n.start);
        osc.stop(t + n.start + n.dur + 0.05);
      });
    } catch (e) {
      console.warn('[Wall of Fame] Fanfare audio error:', e);
    }
  }

  function launchCelebrationConfetti() {
    try {
      let canvas = document.getElementById('aether-confetti-canvas');
      if (canvas) canvas.remove();

      canvas = document.createElement('canvas');
      canvas.id = 'aether-confetti-canvas';
      canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999999;';
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const colors = ['#ffd700', '#00ac6f', '#00d2d3', '#ff4757', '#ffffff', '#a55eea', '#ff9f43'];
      const particles = [];
      const count = 95;

      for (let i = 0; i < count; i++) {
        particles.push({
          x: canvas.width * 0.5 + (Math.random() - 0.5) * 350,
          y: canvas.height * 0.7,
          vx: (Math.random() - 0.5) * 18,
          vy: -Math.random() * 20 - 8,
          size: Math.random() * 9 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rSpeed: (Math.random() - 0.5) * 14,
          opacity: 1
        });
      }

      const startTime = performance.now();
      function animate(now) {
        const elapsed = now - startTime;
        if (elapsed > 4000) {
          if (canvas.parentNode) canvas.remove();
          return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gravity = 0.55;

        for (let p of particles) {
          p.vy += gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rSpeed;
          if (elapsed > 2500) {
            p.opacity = Math.max(0, 1 - (elapsed - 2500) / 1500);
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
        }

        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    } catch (e) {
      console.warn('[Wall of Fame] Confetti error:', e);
    }
  }

  function showCompletionToast(title) {
    let toast = document.getElementById('aether-celebration-toast');
    if (toast) toast.remove();

    toast = document.createElement('div');
    toast.id = 'aether-celebration-toast';
    toast.innerHTML = `
      <div class="aether-toast-icon">🏆</div>
      <div class="aether-toast-body">
        <div class="aether-toast-title">Movie Finished! Celebration 🎉</div>
        <div class="aether-toast-subtitle">${title || 'Completed Item'}</div>
        <div class="aether-toast-sub2">Logged to <strong>Family Wall of Fame</strong> • Click to view</div>
      </div>
      <button class="aether-toast-close" title="Dismiss">✕</button>
    `;

    toast.addEventListener('click', (e) => {
      if (e.target.closest('.aether-toast-close')) {
        toast.remove();
        return;
      }
      toast.remove();
      openWallOfFameModal();
    });

    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 400);
      }
    }, 8000);
  }

  let lastCompletedItem = null;
  function triggerCelebration(title) {
    if (!title || lastCompletedItem === title) return;
    lastCompletedItem = title;
    setTimeout(() => { lastCompletedItem = null; }, 15000);

    console.log('[AetherFin] 🎉 Celebration Triggered! Finished:', title);
    playVictoryFanfare();
    launchCelebrationConfetti();
    showCompletionToast(title);
  }

  // Monitor <video> elements in DOM for playback finish
  setInterval(() => {
    const videos = document.querySelectorAll('video');
    videos.forEach(v => {
      if (!v.__aether_watch_bound__) {
        v.__aether_watch_bound__ = true;
        v.addEventListener('timeupdate', () => {
          if (v.duration && v.duration > 45 && !v.__aether_completed__) {
            if ((v.currentTime / v.duration) >= 0.96) {
              v.__aether_completed__ = true;
              let title = document.title ? document.title.replace('- Jellyfin', '').trim() : 'Feature Film';
              const nameEl = document.querySelector('.pageTitle, .videoPlayerText, .osdTitle, .itemName');
              if (nameEl && nameEl.textContent.trim()) title = nameEl.textContent.trim();
              triggerCelebration(title);
            }
          }
        });
        v.addEventListener('ended', () => {
          if (!v.__aether_completed__) {
            v.__aether_completed__ = true;
            let title = document.title ? document.title.replace('- Jellyfin', '').trim() : 'Feature Film';
            const nameEl = document.querySelector('.pageTitle, .videoPlayerText, .osdTitle, .itemName');
            if (nameEl && nameEl.textContent.trim()) title = nameEl.textContent.trim();
            triggerCelebration(title);
          }
        });
      }
    });
  }, 1000);

  // Monitor Jellyfin playbackstop event
  document.addEventListener('playbackstop', (e) => {
    try {
      const detail = e.detail;
      if (detail && (detail.isPlayed || (detail.positionTicks && detail.item && detail.item.RunTimeTicks && (detail.positionTicks / detail.item.RunTimeTicks >= 0.90)))) {
        const title = (detail.item && (detail.item.SeriesName ? `${detail.item.SeriesName} - ${detail.item.Name}` : detail.item.Name)) || 'Completed Video';
        triggerCelebration(title);
      }
    } catch (err) {}
  });

  /* =========================================================================
     10. FAMILY WALL OF FAME DASHBOARD & REAL-TIME ACTIVITY FEED
     ========================================================================= */
  const USER_PROFILES = {
    admin: { rank: '👑 #1 Champion', color: '#ffd700', grad: 'linear-gradient(135deg, #7928ca, #00ac6f)', initial: 'A' },
    hacker: { rank: '⚡ #2 Movie Master', color: '#00ac6f', grad: 'linear-gradient(135deg, #00ac6f, #0052cc)', initial: 'H' },
    TV: { rank: '📺 #3 Living Room Legend', color: '#00d2d3', grad: 'linear-gradient(135deg, #0070f3, #00dfd8)', initial: 'T' },
    prem: { rank: '⭐ #4 Cinema Explorer', color: '#ff9f43', grad: 'linear-gradient(135deg, #f5a623, #ff4088)', initial: 'P' }
  };

  function getProfileMeta(name, fallbackIndex) {
    if (USER_PROFILES[name]) return USER_PROFILES[name];
    const defaultGradients = [
      'linear-gradient(135deg, #f59e0b, #d97706)',
      'linear-gradient(135deg, #64748b, #475569)',
      'linear-gradient(135deg, #b45309, #78350f)',
      'linear-gradient(135deg, #10b981, #059669)'
    ];
    return {
      rank: `🏅 #${fallbackIndex + 1} Member`,
      color: '#00ac6f',
      grad: defaultGradients[fallbackIndex % defaultGradients.length],
      initial: name ? name[0].toUpperCase() : 'U'
    };
  }

  function formatRelativeDate(isoStr) {
    if (!isoStr) return '';
    try {
      const past = new Date(isoStr).getTime();
      const diffSec = Math.floor((Date.now() - past) / 1000);
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      const diffDays = Math.floor(diffHr / 24);
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  }

  async function fetchWallOfFameData() {
    const token = (window.ApiClient && window.ApiClient.accessToken && window.ApiClient.accessToken()) || JELLYFIN_SERVER_TOKEN;
    const headers = {
      'Authorization': `MediaBrowser Client="Jellyfin Web", Device="Browser", DeviceId="walloffame", Version="12.1.0", Token="${token}"`
    };

    const resUsers = await fetch('/Users', { headers });
    if (!resUsers.ok) throw new Error('Users API failed');
    const users = await resUsers.json();

    const userStats = [];
    const feed = [];

    for (const u of users) {
      try {
        const url = `/Users/${u.Id}/Items?IsPlayed=true&Recursive=true&IncludeItemTypes=Movie,Episode&SortBy=DatePlayed,SortName&SortOrder=Descending&Limit=15&Fields=Overview,PrimaryImageAspectRatio`;
        const resItems = await fetch(url, { headers });
        if (resItems.ok) {
          const data = await resItems.json();
          const totalCount = data.TotalRecordCount || (data.Items ? data.Items.length : 0);
          userStats.push({
            id: u.Id,
            name: u.Name,
            total: totalCount,
            lastItem: data.Items && data.Items[0] ? data.Items[0] : null
          });

          if (data.Items) {
            for (const item of data.Items) {
              const playedDate = item.UserData && item.UserData.LastPlayedDate;
              if (playedDate) {
                feed.push({
                  user: u.Name,
                  userId: u.Id,
                  itemId: item.Id,
                  name: item.Name,
                  type: item.Type,
                  seriesName: item.SeriesName,
                  seasonName: item.SeasonName,
                  indexNumber: item.IndexNumber,
                  parentIndexNumber: item.ParentIndexNumber,
                  datePlayed: playedDate,
                  seriesId: item.SeriesId
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn('[Wall of Fame] Fetch error for ' + u.Name, err);
      }
    }

    userStats.sort((a, b) => b.total - a.total);
    feed.sort((a, b) => new Date(b.datePlayed) - new Date(a.datePlayed));

    return { users: userStats, feed };
  }

  let fameModal = null;
  let cachedFameData = null;
  let activeFilter = 'all';

  function createWallOfFameModal() {
    if (fameModal) return fameModal;

    fameModal = document.createElement('div');
    fameModal.id = 'aetherfin-fame-modal';
    fameModal.innerHTML = `
      <div class="aether-fame-window" role="dialog" aria-modal="true" aria-label="Family Wall of Fame">
        <div class="aether-fame-header">
          <div class="aether-fame-title-group">
            <h2>🏆 Family Wall of Fame</h2>
            <p>Live Family Watch History & Hall of Fame Leaderboard</p>
          </div>
          <div class="aether-fame-actions">
            <button class="aether-fame-btn-refresh" title="Refresh Live Stats">🔄</button>
            <button class="aether-fame-btn-close" title="Close (Esc)">✕</button>
          </div>
        </div>
        <div class="aether-fame-content">
          <div class="aether-fame-leaderboard-section">
            <div class="aether-fame-section-title">👑 Family Hall of Fame Leaderboard</div>
            <div class="aether-fame-leaderboard" id="aether-fame-leaderboard">
              <div style="color:rgba(255,255,255,0.4);font-size:13px;">Loading leaderboard...</div>
            </div>
          </div>
          <div class="aether-fame-feed-section">
            <div class="aether-fame-section-title">📺 Recent Family Watch Activity</div>
            <div class="aether-fame-filters" id="aether-fame-filters">
              <button class="aether-filter-pill active" data-filter="all">All Activity</button>
              <button class="aether-filter-pill" data-filter="Movie">Movies</button>
              <button class="aether-filter-pill" data-filter="Episode">Series</button>
              <button class="aether-filter-pill" data-filter="admin">👤 admin</button>
              <button class="aether-filter-pill" data-filter="TV">📺 TV</button>
              <button class="aether-filter-pill" data-filter="hacker">⚡ hacker</button>
              <button class="aether-filter-pill" data-filter="prem">⭐ prem</button>
            </div>
            <div class="aether-fame-feed" id="aether-fame-feed">
              <div style="color:rgba(255,255,255,0.4);font-size:13px;">Loading watch history...</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Close handlers
    const closeBtn = fameModal.querySelector('.aether-fame-btn-close');
    closeBtn.addEventListener('click', closeWallOfFameModal);

    const refreshBtn = fameModal.querySelector('.aether-fame-btn-refresh');
    refreshBtn.addEventListener('click', () => {
      refreshBtn.style.transform = 'rotate(360deg)';
      setTimeout(() => { refreshBtn.style.transform = 'none'; }, 500);
      loadWallOfFameContent(true);
    });

    fameModal.addEventListener('click', (e) => {
      if (e.target === fameModal) {
        closeWallOfFameModal();
      }
    });

    // Filter pill clicks
    const filtersContainer = fameModal.querySelector('#aether-fame-filters');
    filtersContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.aether-filter-pill');
      if (pill) {
        filtersContainer.querySelectorAll('.aether-filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeFilter = pill.getAttribute('data-filter');
        renderFeedList();
      }
    });

    document.body.appendChild(fameModal);
    return fameModal;
  }

  function renderLeaderboard(users) {
    const container = document.getElementById('aether-fame-leaderboard');
    if (!container) return;

    container.innerHTML = users.map((u, idx) => {
      const meta = getProfileMeta(u.name, idx);
      const lastTitle = u.lastItem ? (u.lastItem.SeriesName ? `${u.lastItem.SeriesName} - ${u.lastItem.Name}` : u.lastItem.Name) : 'No recent title';
      return `
        <div class="aether-fame-user-card" tabindex="0" data-user="${u.name}" title="Filter feed by ${u.name}">
          <div class="aether-fame-rank-badge" style="color: ${meta.color}; border-color: ${meta.color};">${meta.rank}</div>
          <div class="aether-fame-user-avatar" style="background: ${meta.grad};">${meta.initial}</div>
          <h3 class="aether-fame-user-name">${u.name}</h3>
          <div class="aether-fame-user-count">🏆 ${u.total} Titles Finished</div>
          <div class="aether-fame-user-last">Latest: ${lastTitle}</div>
        </div>
      `;
    }).join('');

    // Bind card clicks to filter
    container.querySelectorAll('.aether-fame-user-card').forEach(card => {
      card.addEventListener('click', () => {
        const uname = card.getAttribute('data-user');
        const filterBtn = document.querySelector(`.aether-filter-pill[data-filter="${uname}"]`);
        if (filterBtn) filterBtn.click();
      });
    });
  }

  function renderFeedList() {
    const container = document.getElementById('aether-fame-feed');
    if (!container || !cachedFameData) return;

    let items = cachedFameData.feed;
    if (activeFilter === 'Movie') {
      items = items.filter(x => x.type === 'Movie');
    } else if (activeFilter === 'Episode') {
      items = items.filter(x => x.type === 'Episode');
    } else if (activeFilter !== 'all') {
      items = items.filter(x => x.user.toLowerCase() === activeFilter.toLowerCase());
    }

    if (items.length === 0) {
      container.innerHTML = `<div style="color:rgba(255,255,255,0.4);font-size:14px;padding:20px;grid-column:1/-1;">No activity found for this filter.</div>`;
      return;
    }

    container.innerHTML = items.map((item, idx) => {
      const meta = getProfileMeta(item.user, 0);
      const posterId = item.seriesId || item.itemId;
      const posterUrl = `/Items/${posterId}/Images/Primary?fillHeight=180&fillWidth=120&quality=85`;
      const timeAgo = formatRelativeDate(item.datePlayed);
      const isEpisode = item.type === 'Episode';
      const typeBadge = isEpisode ? `S${item.parentIndexNumber || 1}:E${item.indexNumber || 1}` : 'Movie';

      return `
        <a class="aether-feed-card" tabindex="0" href="#!/details?id=${item.itemId}" data-id="${item.itemId}">
          <img class="aether-feed-poster" src="${posterUrl}" onerror="this.src='/web/touchicon144.39209dd2362c0db7c673.png';" alt="${item.name}" loading="lazy" />
          <div class="aether-feed-info">
            <div class="aether-feed-badge-row">
              <span class="aether-feed-user-tag" style="background: ${meta.color};">${item.user}</span>
              <span class="aether-feed-type-tag">${typeBadge}</span>
            </div>
            <div class="aether-feed-title" title="${item.name}">${item.name}</div>
            ${isEpisode && item.seriesName ? `<div class="aether-feed-series">${item.seriesName}</div>` : ''}
            <div class="aether-feed-time">Completed ${timeAgo}</div>
          </div>
        </a>
      `;
    }).join('');

    // Clicking feed card closes modal and navigates
    container.querySelectorAll('.aether-feed-card').forEach(card => {
      card.addEventListener('click', (e) => {
        closeWallOfFameModal();
      });
    });
  }

  async function loadWallOfFameContent(forceRefresh = false) {
    if (!cachedFameData || forceRefresh) {
      try {
        cachedFameData = await fetchWallOfFameData();
      } catch (e) {
        console.error('[Wall of Fame] Error loading data:', e);
      }
    }

    if (cachedFameData) {
      renderLeaderboard(cachedFameData.users);
      renderFeedList();
    }
  }

  function openWallOfFameModal() {
    createWallOfFameModal();
    fameModal.classList.add('active');
    loadWallOfFameContent(false);

    // Focus close button for TV remote
    setTimeout(() => {
      const closeBtn = fameModal.querySelector('.aether-fame-btn-close');
      if (closeBtn) closeBtn.focus();
    }, 100);
  }

  function closeWallOfFameModal() {
    if (fameModal) {
      fameModal.classList.remove('active');
    }
  }

  // Keydown Escape or Back handler
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Escape' || e.keyCode === 27 || e.key === 'GoBack' || e.keyCode === 10009) && fameModal && fameModal.classList.contains('active')) {
      e.preventDefault();
      closeWallOfFameModal();
    }
  });

  // 1. Create Floating Wall of Fame Pill Button (Bottom-Right)
  (function initWallOfFameButtons() {
    let fameBtn = document.getElementById('aetherfin-fame-btn');
    if (!fameBtn) {
      fameBtn = document.createElement('button');
      fameBtn.id = 'aetherfin-fame-btn';
      fameBtn.title = 'Family Wall of Fame & Watch Activity';
      fameBtn.innerHTML = `
        <span class="aether-fame-icon">🏆</span>
        <span class="aether-fame-text">Wall of Fame</span>
      `;
      fameBtn.addEventListener('click', openWallOfFameModal);
      document.body.appendChild(fameBtn);
    }

    // 2. Inject Integrated Button into Jellyfin Header Bar
    function injectHeaderButton() {
      if (document.querySelector('.aetherfin-header-fame-btn')) return;
      const headerRight = document.querySelector('.headerRight, .headerTop, header .flex-row');
      if (headerRight) {
        const headerBtn = document.createElement('button');
        headerBtn.className = 'aetherfin-header-fame-btn';
        headerBtn.title = 'Family Wall of Fame';
        headerBtn.innerHTML = `<span>🏆</span> <span>Wall of Fame</span>`;
        headerBtn.addEventListener('click', openWallOfFameModal);
        headerRight.insertBefore(headerBtn, headerRight.firstChild);
      }
    }

    setInterval(injectHeaderButton, 2000);
  })();

})();
