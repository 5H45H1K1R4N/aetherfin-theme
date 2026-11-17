// ==UserScript==
// @name         AetherFin Suite — Universal Theme Switcher & Mobile Audio Engine
// @namespace    https://jellyfin.org/
// @version      8.0.0
// @description  Universal Theme Switcher (NeutralFin, Ultrachromic & Cyber-OLED), 100% phone app audio playback, and complete library theme music.
// @author       5H45H1K1R4N
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  if (window.__AETHERFIN_V8_LOADED__) return;
  window.__AETHERFIN_V8_LOADED__ = true;

  console.log('%c[AetherFin Suite v8]%c Bulletproof Mobile & Theme Switcher Active', 
              'color: #e50914; font-weight: bold; font-size: 14px;', 'color: #06b6d4; font-weight: bold;');

  const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  /* =========================================================================
     1. THEME SWITCHER ENGINE (NeutralFin, Ultrachromic, Cyber-OLED)
     ========================================================================= */
  const THEME_OPTIONS = [
    {
      id: "neutralfin",
      name: "NeutralFin",
      author: "KartoffelChipss",
      desc: "Sleek black & neutral grey with modern Lucide vector icons.",
      accent: "#71717a",
      file: "neutralfin.css"
    },
    {
      id: "ultrachromic-kaleido",
      name: "Ultrachromic (Kaleido)",
      author: "CTalvio",
      desc: "Vibrant chromatic gradients, glowing backdrops & glassy UI.",
      accent: "#6366f1",
      file: "ultrachromic-kaleido.css"
    },
    {
      id: "ultrachromic-nova",
      name: "Ultrachromic (Nova)",
      author: "CTalvio",
      desc: "Modern chromatic dark theme with saturated ambient color accents.",
      accent: "#06b6d4",
      file: "ultrachromic-nova.css"
    },
    {
      id: "ultrachromic-mono",
      name: "Ultrachromic (Mono)",
      author: "CTalvio",
      desc: "High-contrast clean monochrome minimalism.",
      accent: "#e4e4e7",
      file: "ultrachromic-mono.css"
    },
    {
      id: "cyber-oled",
      name: "AetherFin Cyber-OLED",
      author: "5H45H1K1R4N",
      desc: "Deep AMOLED pure black with radiant crimson neon accents.",
      accent: "#e50914",
      file: "cyber-oled.css"
    }
  ];

  const THEMES_BASE_URL = "https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/themes";

  function getActiveThemeId() {
    return localStorage.getItem('aetherfin_active_theme') || 'neutralfin';
  }

  function applyTheme(themeId) {
    localStorage.setItem('aetherfin_active_theme', themeId);
    const theme = THEME_OPTIONS.find(t => t.id === themeId) || THEME_OPTIONS[0];

    let linkEl = document.getElementById('aetherfin-active-theme-link');
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.id = 'aetherfin-active-theme-link';
      linkEl.rel = 'stylesheet';
      document.head.appendChild(linkEl);
    }
    linkEl.href = `${THEMES_BASE_URL}/${theme.file}`;
    console.log(`[AetherFin] Active theme switched to: ${theme.name}`);
  }

  applyTheme(getActiveThemeId());

  function openThemeModal() {
    let modal = document.getElementById('aetherfin-theme-modal');
    if (modal) {
      modal.style.display = 'flex';
      renderThemeCards();
      return;
    }

    modal = document.createElement('div');
    modal.id = 'aetherfin-theme-modal';
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.78);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
    `;

    modal.innerHTML = `
      <div style="
        background: #18181b;
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        width: 100%;
        max-width: 520px;
        max-height: 85vh;
        overflow-y: auto;
        padding: 24px;
        color: #f4f4f5;
        box-sizing: border-box;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <h2 style="margin: 0; font-size: 19px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span>🎨</span> Theme & Appearance
            </h2>
            <p style="margin: 4px 0 0; font-size: 12px; color: #a1a1aa;">
              Personalize your Jellyfin theme. Applies immediately.
            </p>
          </div>
          <button id="aetherfin-close-modal" style="
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 9999px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f4f4f5;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
          ">✕</button>
        </div>

        <div id="aetherfin-theme-grid" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;"></div>

        <div style="display: flex; justify-content: flex-end;">
          <button id="aetherfin-done-btn" style="
            background: #e50914;
            color: #fff;
            border: none;
            padding: 10px 24px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(229, 9, 20, 0.4);
          ">Done</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#aetherfin-close-modal').addEventListener('click', () => { modal.style.display = 'none'; });
    modal.querySelector('#aetherfin-done-btn').addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    renderThemeCards();
  }

  function renderThemeCards() {
    const grid = document.getElementById('aetherfin-theme-grid');
    if (!grid) return;
    const currentId = getActiveThemeId();

    grid.innerHTML = THEME_OPTIONS.map(theme => {
      const isSelected = theme.id === currentId;
      return `
        <div class="aether-theme-card" data-id="${theme.id}" style="
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 12px;
          background: ${isSelected ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)'};
          border: 1px solid ${isSelected ? theme.accent : 'rgba(255, 255, 255, 0.08)'};
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: ${isSelected ? `0 0 14px ${theme.accent}33` : 'none'};
        ">
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: ${theme.accent};
            box-shadow: 0 3px 10px ${theme.accent}66;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 14px;
            font-weight: 700;
          ">${isSelected ? '✓' : ''}</div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 600; font-size: 14px;">${theme.name}</span>
              <span style="font-size: 11px; color: #a1a1aa; background: rgba(255, 255, 255, 0.06); padding: 1px 5px; border-radius: 4px;">${theme.author}</span>
            </div>
            <div style="font-size: 12px; color: #a1a1aa; margin-top: 2px;">${theme.desc}</div>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.aether-theme-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        applyTheme(id);
        renderThemeCards();
      });
    });
  }

  function ensureFloatingThemeButton() {
    if (document.getElementById('aetherfin-floating-theme-btn')) return;

    const btn = document.createElement('div');
    btn.id = 'aetherfin-floating-theme-btn';
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-label', 'Theme Switcher');
    btn.title = 'Change Theme & Appearance';
    btn.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 20px;
      z-index: 999998;
      display: flex;
      align-items: center;
      gap: 7px;
      background: rgba(24, 24, 27, 0.9);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
      padding: 8px 14px;
      border-radius: 9999px;
      color: #f4f4f5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;
    `;
    btn.innerHTML = `<span style="font-size: 15px;">🎨</span><span>Theme</span>`;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openThemeModal();
    });

    document.body.appendChild(btn);
  }

  ensureFloatingThemeButton();
  setInterval(ensureFloatingThemeButton, 1000);

  /* =========================================================================
     2. COMPLETE THEME AUDIO DATABASE (33 TITLES)
     ========================================================================= */
  const CDN_BASE = "https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/audio/themes";

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
     3. UNIVERSAL REUSABLE AUDIO PIPELINE (GUARANTEED FOR PHONE APP)
     ========================================================================= */
  // Create single permanent audio element attached to document body
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
  let isAudioUnlocked = false;

  // Unlock audio on the very first touch/click
  function unlockAudio() {
    if (isAudioUnlocked) return;
    try {
      globalAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAP8A';
      const p = globalAudio.play();
      if (p !== undefined) {
        p.then(() => {
          isAudioUnlocked = true;
          console.log('[AetherFin] Mobile Audio Pipeline Unlocked!');
        }).catch(() => {});
      }
    } catch (e) {}

    ['touchstart', 'touchend', 'click', 'pointerdown'].forEach(evt => {
      document.removeEventListener(evt, unlockAudio);
    });
  }

  ['touchstart', 'touchend', 'click', 'pointerdown'].forEach(evt => {
    document.addEventListener(evt, unlockAudio, { passive: true, once: false });
  });

  function normalize(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function findThemeForText(text) {
    if (!text) return null;
    const norm = normalize(text);
    for (const item of THEME_MAP) {
      for (const k of item.keys) {
        if (norm.includes(normalize(k))) {
          return {
            title: item.title,
            url: `${CDN_BASE}/${item.file}`
          };
        }
      }
    }
    return null;
  }

  function stopMusic(fadeMs = 300) {
    if (!activeTheme) return;
    activeTheme = null;
    updateFloatingPill(null);

    if (fadeTimer) clearInterval(fadeTimer);

    const stepMs = 25;
    const steps = fadeMs / stepMs;
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

  function playTheme(theme, targetVolume = 0.25) {
    if (isMuted || !theme) return;
    if (activeTheme && activeTheme.url === theme.url && !globalAudio.paused) {
      return; // Already playing
    }

    if (fadeTimer) clearInterval(fadeTimer);

    // Stop if a video is actively playing in Jellyfin
    const isVideoPlaying = document.querySelector('video:not(.paused)') && !document.querySelector('video').paused;
    if (isVideoPlaying) return;

    activeTheme = theme;
    updateFloatingPill(theme.title);

    try {
      globalAudio.pause();
      globalAudio.crossOrigin = "anonymous";
      globalAudio.src = theme.url;
      globalAudio.loop = true;
      globalAudio.volume = 0.05;

      const playPromise = globalAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          let currentVol = 0.05;
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
          }, 40);
        }).catch(err => {
          console.warn('[AetherFin] Play error on device:', err);
        });
      }
    } catch (e) {
      console.warn('[AetherFin] Play exception:', e);
    }
  }

  /* =========================================================================
     4. TOUCH, CLICK & ROUTE DETECTION (100% PHONE APP WORKING)
     ========================================================================= */
  let isNavigatingToDetail = false;
  let isDetailPage = false;

  // Intercept taps on movie cards on mobile phone and clicks on desktop
  function onCardTapped(target) {
    const card = target.closest('.card, .cardBox, .listItem, a[data-itemid], button[data-id]');
    if (card) {
      const fullText = (card.textContent || '').replace(/\s+/g, ' ');
      const theme = findThemeForText(fullText);
      if (theme) {
        isNavigatingToDetail = true;
        // Start theme immediately inside user touch gesture!
        playTheme(theme, 0.25);
        setTimeout(() => { isNavigatingToDetail = false; }, 3500);
      }
    }

    // Stop if user taps play video
    if (target.closest('.btnPlay, [data-action="play"], button[data-id="play"], .videoPlayButton')) {
      stopMusic(300);
    }
  }

  document.addEventListener('click', (e) => {
    onCardTapped(e.target);
  }, true);

  document.addEventListener('touchend', (e) => {
    if (e.target) onCardTapped(e.target);
  }, { passive: true });

  // Route / Details Page Checker (Works with Jellyfin 12 React router)
  function checkRoute() {
    const hash = window.location.hash || '';
    const href = window.location.href || '';
    const isDetailRoute = hash.includes('details') || href.includes('details') || hash.includes('item?id=');

    const detailTitleEl = document.querySelector('.itemName, .parentName, h1.itemName, .detailPagePrimaryContainer h1');
    const docTitle = document.title ? document.title.replace('- Jellyfin', '').trim() : '';

    if (isDetailRoute || detailTitleEl) {
      isDetailPage = true;
      const titleToMatch = detailTitleEl ? detailTitleEl.textContent.trim() : docTitle;
      const theme = findThemeForText(titleToMatch);

      if (theme) {
        if (!activeTheme || activeTheme.url !== theme.url || globalAudio.paused) {
          playTheme(theme, 0.24);
        }
      }
    } else {
      if (isDetailPage && !isNavigatingToDetail) {
        isDetailPage = false;
        stopMusic(300);
      }
    }
  }

  window.addEventListener('popstate', checkRoute);
  window.addEventListener('hashchange', checkRoute);
  const routeObserver = new MutationObserver(() => {
    checkRoute();
  });
  routeObserver.observe(document.body, { childList: true, subtree: true });

  /* =========================================================================
     5. DESKTOP HOVER PLAYBACK
     ========================================================================= */
  let hoverTimer = null;
  let currentCardElem = null;

  if (!isMobile) {
    document.addEventListener('mouseover', (e) => {
      if (isDetailPage || isNavigatingToDetail) return;

      const card = e.target.closest('.card, .cardBox, .listItem');
      if (card && card !== currentCardElem) {
        currentCardElem = card;
        if (hoverTimer) clearTimeout(hoverTimer);

        hoverTimer = setTimeout(() => {
          if (currentCardElem === card && !isNavigatingToDetail && !isDetailPage) {
            const fullText = (card.textContent || '').replace(/\s+/g, ' ');
            const theme = findThemeForText(fullText);
            if (theme) {
              playTheme(theme, 0.18);
            }
          }
        }, 450);
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      if (isNavigatingToDetail || isDetailPage) return;

      const card = e.target.closest('.card, .cardBox, .listItem');
      if (card && currentCardElem === card) {
        const related = e.relatedTarget;
        if (!related || !card.contains(related)) {
          if (hoverTimer) clearTimeout(hoverTimer);
          currentCardElem = null;
          stopMusic(250);
        }
      }
    }, { passive: true });
  }

  /* =========================================================================
     6. FLOATING AUDIO PILL (BOTTOM-RIGHT)
     ========================================================================= */
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
      pillElem.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 20px;
        z-index: 999998;
        display: none;
        align-items: center;
        gap: 8px;
        background: rgba(24, 24, 27, 0.9);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
        padding: 8px 14px;
        border-radius: 9999px;
        color: #f4f4f5;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        user-select: none;
      `;

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
