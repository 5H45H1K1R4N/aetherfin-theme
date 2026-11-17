// ==UserScript==
// @name         AetherFin Suite — Universal Theme Switcher & Mobile Audio Engine
// @namespace    https://jellyfin.org/
// @version      7.0.0
// @description  Universal Theme Switcher (NeutralFin, Ultrachromic & Cyber-OLED), 100% phone app audio playback, and complete library theme music.
// @author       5H45H1K1R4N
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  // Allow re-run if updated
  if (window.__AETHERFIN_V7_LOADED__) return;
  window.__AETHERFIN_V7_LOADED__ = true;

  console.log('%c[AetherFin Suite v7]%c Universal Mobile & Theme Engine Active', 
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

  // Apply saved theme immediately
  applyTheme(getActiveThemeId());

  // Render Theme Switcher Modal
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
        playTick();
        const id = card.getAttribute('data-id');
        applyTheme(id);
        renderThemeCards();
      });
    });
  }

  // Permanent Floating Theme Switcher Button (100% Guaranteed on Desktop & Mobile)
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
      background: rgba(24, 24, 27, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.16);
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
      playTick();
      openThemeModal();
    });

    document.body.appendChild(btn);
  }

  // Also inject button into header if possible
  function injectHeaderButton() {
    if (document.getElementById('aetherfin-header-theme-btn')) return;
    const header = document.querySelector('.headerRight, .skinHeader-right, header, .MuiAppBar-root');
    if (!header) return;

    const btn = document.createElement('button');
    btn.id = 'aetherfin-header-theme-btn';
    btn.type = 'button';
    btn.title = 'Change Theme';
    btn.style.cssText = `
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9999px;
      padding: 6px 12px;
      margin: 0 4px;
      color: #f4f4f5;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      vertical-align: middle;
    `;
    btn.innerHTML = `<span>🎨</span><span>Theme</span>`;
    btn.addEventListener('click', openThemeModal);
    header.insertBefore(btn, header.firstChild);
  }

  ensureFloatingThemeButton();
  setInterval(() => {
    ensureFloatingThemeButton();
    injectHeaderButton();
  }, 1000);

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
     3. UNIVERSAL CROSS-PLATFORM AUDIO CONTROLLER (100% PHONE APP WORKING)
     ========================================================================= */
  let activeAudio = null;
  let activeTheme = null;
  let isMuted = false;
  let fadeInterval = null;
  let isNavigatingToDetail = false;
  let isDetailPage = false;
  let hoverTimer = null;
  let currentCardElem = null;

  function playTick() {
    // Subtle tactile click using web audio if running
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.025);
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.028);
    } catch (e) {}
  }

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

  function extractCardTitle(card) {
    if (!card) return '';
    const selectors = [
      '.cardText-first',
      '.cardText',
      '.cardTitle',
      '.itemName',
      'a[data-itemid]',
      'h1'
    ];
    for (const sel of selectors) {
      const el = card.querySelector(sel);
      if (el && el.textContent.trim()) return el.textContent.trim();
    }
    return card.getAttribute('data-title') || 
           card.getAttribute('aria-label') || 
           card.getAttribute('title') || 
           card.textContent.trim().split('\n')[0] || '';
  }

  function stopMusic(fadeMs = 300) {
    if (!activeAudio) return;
    const audio = activeAudio;
    activeAudio = null;
    activeTheme = null;
    updateFloatingPill(null);

    if (fadeInterval) clearInterval(fadeInterval);

    const stepMs = 25;
    const steps = fadeMs / stepMs;
    const volStep = (audio.volume || 0.2) / steps;

    fadeInterval = setInterval(() => {
      try {
        if (audio.volume > volStep) {
          audio.volume -= volStep;
        } else {
          audio.volume = 0;
          clearInterval(fadeInterval);
          audio.pause();
          audio.src = '';
          audio.remove();
        }
      } catch (e) {
        clearInterval(fadeInterval);
        try { audio.pause(); } catch (err) {}
      }
    }, stepMs);
  }

  function playTheme(theme, targetVolume = 0.22) {
    if (isMuted || !theme) return;
    if (activeAudio && activeTheme && activeTheme.url === theme.url) {
      return; // Already playing this track
    }

    stopMusic(150);

    // Check if video is playing in Jellyfin
    const isVideoPlaying = document.querySelector('video:not(.paused)') && !document.querySelector('video').paused;
    if (isVideoPlaying) return;

    activeTheme = theme;
    updateFloatingPill(theme.title);

    try {
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.src = theme.url;
      audio.loop = true;
      audio.volume = 0.02; // Start quiet for smooth fade-in

      activeAudio = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Smooth software volume fade-in (100% works on Android WebView & iOS)
          let currentVol = 0.02;
          const fadeIn = setInterval(() => {
            if (activeAudio !== audio) {
              clearInterval(fadeIn);
              return;
            }
            currentVol += 0.02;
            if (currentVol >= targetVolume) {
              audio.volume = targetVolume;
              clearInterval(fadeIn);
            } else {
              audio.volume = currentVol;
            }
          }, 40);
        }).catch(err => {
          console.log('[AetherFin] Autoplay waiting for user gesture:', err.message);
        });
      }
    } catch (e) {
      console.warn('[AetherFin] playTheme error:', e);
    }
  }

  /* =========================================================================
     4. TOUCH & CLICK INTERCEPTION (Phone App Gesture Binding)
     ========================================================================= */
  // On mobile phone or desktop click: start music immediately inside the gesture handler
  function handleCardInteraction(e) {
    const card = e.target.closest('.card, .cardBox, .listItem, a[data-itemid]');
    if (card) {
      const rawTitle = extractCardTitle(card);
      const theme = findThemeForText(rawTitle);
      if (theme) {
        isNavigatingToDetail = true;
        // Start theme immediately inside user touch gesture to guarantee permissions
        playTheme(theme, 0.24);
        setTimeout(() => { isNavigatingToDetail = false; }, 3500);
      }
    }

    // Stop music if user clicks video play button
    if (e.target.closest('.btnPlay, [data-action="play"], button[data-id="play"], .videoPlayButton')) {
      stopMusic(300);
    }
  }

  document.addEventListener('click', handleCardInteraction, true);
  document.addEventListener('touchend', (e) => {
    // If user tapped a card on mobile
    const card = e.target.closest('.card, .cardBox, .listItem');
    if (card) {
      const rawTitle = extractCardTitle(card);
      const theme = findThemeForText(rawTitle);
      if (theme) {
        isNavigatingToDetail = true;
        playTheme(theme, 0.24);
        setTimeout(() => { isNavigatingToDetail = false; }, 3500);
      }
    }
  }, { passive: true });

  /* =========================================================================
     5. ROUTE & DETAIL PAGE DETECTION (Jellyfin 12 & Mobile SPA)
     ========================================================================= */
  function detectDetailPage() {
    const hash = window.location.hash || '';
    const href = window.location.href || '';
    const isDetailsRoute = hash.includes('details') || href.includes('details') || hash.includes('item?id=');

    const detailHeader = document.querySelector('.itemName, .parentName, h1.itemName, .detailPagePrimaryContainer h1');

    if (isDetailsRoute || detailHeader) {
      isDetailPage = true;
      const title = detailHeader ? detailHeader.textContent.trim() : document.title.replace(' - Jellyfin', '').trim();
      const theme = findThemeForText(title);

      if (theme) {
        if (!activeAudio || (activeTheme && activeTheme.url !== theme.url)) {
          playTheme(theme, 0.22);
        }
      }
    } else {
      if (isDetailPage && !isNavigatingToDetail) {
        isDetailPage = false;
        stopMusic(300);
      }
    }
  }

  // Observe route changes
  window.addEventListener('popstate', detectDetailPage);
  window.addEventListener('hashchange', detectDetailPage);
  const routeObserver = new MutationObserver(() => {
    detectDetailPage();
  });
  routeObserver.observe(document.body, { childList: true, subtree: true });

  /* =========================================================================
     6. DESKTOP HOVER PLAYBACK
     ========================================================================= */
  if (!isMobile) {
    document.addEventListener('mouseover', (e) => {
      if (isDetailPage || isNavigatingToDetail) return;

      const card = e.target.closest('.card, .cardBox, .listItem');
      if (card && card !== currentCardElem) {
        currentCardElem = card;
        if (hoverTimer) clearTimeout(hoverTimer);

        hoverTimer = setTimeout(() => {
          if (currentCardElem === card && !isNavigatingToDetail && !isDetailPage) {
            const rawTitle = extractCardTitle(card);
            const theme = findThemeForText(rawTitle);
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
     7. FLOATING AUDIO PILL (BOTTOM-RIGHT)
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
        background: rgba(24, 24, 27, 0.88);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.16);
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
