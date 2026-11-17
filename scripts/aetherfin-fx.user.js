// ==UserScript==
// @name         AetherFin Suite — Theme Switcher, Audio FX & Mobile Engine
// @namespace    https://jellyfin.org/
// @version      6.0.0
// @description  Interactive Theme Switcher (NeutralFin, Ultrachromic & Cyber-OLED), full library theme music, and mobile support.
// @author       5H45H1K1R4N
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  if (window.__AETHERFIN_V6_LOADED__) return;
  window.__AETHERFIN_V6_LOADED__ = true;

  console.log('%c[AetherFin Suite v6]%c Theme Switcher & Audio FX Active', 
              'color: #e50914; font-weight: bold; font-size: 13px;', 'color: #06b6d4; font-weight: bold;');

  /* =========================================================================
     1. THEME SWITCHER ENGINE (NeutralFin, Ultrachromic & Cyber-OLED)
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
    linkEl.href = `${THEMES_BASE_URL}/${theme.file}?v=${Date.now()}`;
    console.log(`[AetherFin] Active theme switched to: ${theme.name}`);
  }

  // Apply saved theme immediately
  applyTheme(getActiveThemeId());

  // Theme Switcher Modal UI
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
      z-index: 100000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      animation: aetherFadeIn 0.25s ease-out;
    `;

    modal.innerHTML = `
      <div style="
        background: rgba(24, 24, 27, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        width: 100%;
        max-width: 580px;
        max-height: 85vh;
        overflow-y: auto;
        padding: 28px;
        color: #f4f4f5;
        position: relative;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <h2 style="margin: 0; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span>🎨</span> Theme & Appearance
            </h2>
            <p style="margin: 4px 0 0; font-size: 13px; color: #a1a1aa;">
              Personalize your Jellyfin look. Changes apply instantly.
            </p>
          </div>
          <button id="aetherfin-close-modal" style="
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
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
            transition: all 0.2s ease;
          ">✕</button>
        </div>

        <div id="aetherfin-theme-grid" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;"></div>

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
            transition: transform 0.2s ease;
          ">Done</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#aetherfin-close-modal').addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.querySelector('#aetherfin-done-btn').addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

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
          gap: 16px;
          padding: 14px 16px;
          border-radius: 14px;
          background: ${isSelected ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)'};
          border: 1px solid ${isSelected ? theme.accent : 'rgba(255, 255, 255, 0.08)'};
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: ${isSelected ? `0 0 16px ${theme.accent}33` : 'none'};
        ">
          <div style="
            width: 36px;
            height: 36px;
            border-radius: 10px;
            background: ${theme.accent};
            box-shadow: 0 4px 12px ${theme.accent}66;
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
              <span style="font-weight: 600; font-size: 15px;">${theme.name}</span>
              <span style="font-size: 11px; color: #a1a1aa; background: rgba(255, 255, 255, 0.06); padding: 2px 6px; border-radius: 4px;">by ${theme.author}</span>
            </div>
            <div style="font-size: 12px; color: #a1a1aa; margin-top: 2px;">${theme.desc}</div>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.aether-theme-card').forEach(card => {
      card.addEventListener('click', () => {
        playHapticTick();
        const id = card.getAttribute('data-id');
        applyTheme(id);
        renderThemeCards();
      });
    });
  }

  // Inject Theme Switcher Button into Top Navigation Bar
  function injectTopBarButton() {
    if (document.getElementById('aetherfin-theme-btn')) return;

    const targetContainer = document.querySelector('.skinHeader-right, .headerRight, .headerTop');
    if (!targetContainer) return;

    const btn = document.createElement('button');
    btn.id = 'aetherfin-theme-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Change Theme');
    btn.title = 'Change Theme & Appearance';
    btn.style.cssText = `
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9999px;
      padding: 6px 14px;
      margin: 0 6px;
      color: #f4f4f5;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      vertical-align: middle;
    `;
    btn.innerHTML = `<span>🎨</span><span class="aether-theme-label">Theme</span>`;

    btn.addEventListener('click', () => {
      playHapticTick();
      openThemeModal();
    });

    targetContainer.insertBefore(btn, targetContainer.firstChild);
  }

  setInterval(injectTopBarButton, 1000);

  /* =========================================================================
     2. AUDIO ENGINE & COMPLETE LIBRARY THEME DATABASE (33 TITLES)
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

  let audioCtx = null;
  let isMuted = false;

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

  function unlockAudio() {
    const ctx = getAudioCtx();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch (e) {}
    
    ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'].forEach(evt => {
      document.removeEventListener(evt, unlockAudio);
    });
  }

  ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'].forEach(evt => {
    document.addEventListener(evt, unlockAudio, { passive: true, once: false });
  });

  let lastHoverTick = 0;
  function playHapticTick() {
    if (isMuted) return;
    const now = performance.now();
    if (now - lastHoverTick < 70) return;
    lastHoverTick = now;

    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.025);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.028);
    } catch (e) {}
  }

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
      '.detailPagePrimaryContainer .itemName',
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
      return;
    }

    stopThemeMusic(200);

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
          audio.volume = isDetailPage ? 0.18 : 0.16;
        }
      } else {
        audio.volume = isDetailPage ? 0.18 : 0.16;
      }

      currentAudio = audio;
      const playPromise = audio.play();
      if (playPromise !== undefined) playPromise.catch(() => {});
    } catch (e) {}
  }

  /* =========================================================================
     3. CONTINUOUS DETAIL PLAYBACK & ROUTING
     ========================================================================= */
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.card, .cardBox, .listItem');
    if (card) {
      playHapticTick();
      const rawTitle = extractCardTitle(card);
      const theme = findThemeForText(rawTitle);
      if (theme) {
        isNavigatingToDetail = true;
        if (!currentAudio || (currentMatchedTheme && currentMatchedTheme.url !== theme.url)) {
          startThemeMusic(theme, true);
        }
        setTimeout(() => { isNavigatingToDetail = false; }, 3000);
      }
    }

    if (e.target.closest('.btnPlay, [data-action="play"], button[data-id="play"], .videoPlayButton')) {
      stopThemeMusic(400);
    }
  }, true);

  function checkDetailPage() {
    const detailContainer = document.querySelector('.itemDetailPage, .detailPage, .detailRibbon, [data-role="page"].itemDetailPage');
    if (detailContainer && !detailContainer.classList.contains('hide')) {
      isDetailPageActive = true;
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
        isDetailPageActive = false;
        stopThemeMusic(400);
      }
    }
  }

  const observer = new MutationObserver(() => {
    checkDetailPage();
    injectTopBarButton();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('popstate', checkDetailPage);
  window.addEventListener('hashchange', checkDetailPage);

  /* =========================================================================
     4. HOVER PLAYBACK & MOBILE TOUCH
     ========================================================================= */
  document.addEventListener('mouseover', (e) => {
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
      }, 450);
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
        stopThemeMusic(250);
      }
    }
  }, { passive: true });

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
     5. FLOATING CONTROLLER PILL (WITH QUICK THEME & MUTE)
     ========================================================================= */
  let pillElem = null;
  function updateFloatingPill(title) {
    if (!pillElem) {
      pillElem = document.createElement('div');
      pillElem.id = 'aetherfin-audio-pill';
      pillElem.innerHTML = `
        <span class="aether-icon" title="Toggle Mute">🎵</span>
        <span class="aether-title"></span>
        <span class="aether-bars">
          <span></span><span></span><span></span>
        </span>
        <span class="aether-theme-trigger" title="Change Theme" style="margin-left: 8px; border-left: 1px solid rgba(255,255,255,0.15); padding-left: 8px; font-size: 14px;">🎨</span>
      `;
      pillElem.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        display: none;
        align-items: center;
        gap: 8px;
        background: rgba(18, 18, 18, 0.88);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 8px 16px;
        border-radius: 9999px;
        color: #f8fafc;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 255, 255, 0.05);
        cursor: pointer;
        user-select: none;
        transition: all 0.25s ease;
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
        @keyframes aetherFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `;
      document.head.appendChild(style);

      pillElem.querySelector('.aether-theme-trigger').addEventListener('click', (e) => {
        e.stopPropagation();
        openThemeModal();
      });

      pillElem.addEventListener('click', (e) => {
        if (e.target.closest('.aether-theme-trigger')) return;
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
