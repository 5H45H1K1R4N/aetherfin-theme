// ==UserScript==
// @name         AetherFin Suite — Universal Theme Switcher & Local Audio Engine
// @namespace    https://jellyfin.org/
// @version      10.0.0
// @description  Universal Theme Switcher (NeutralFin, Ultrachromic, Cyber-OLED), Local Server Audio Engine, Mobile App Audio & Instant Hover Switching.
// @author       5H45H1K1R4N
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  if (window.__AETHERFIN_V10_LOADED__) return;
  window.__AETHERFIN_V10_LOADED__ = true;

  console.log('%c[AetherFin Suite v10]%c Local Audio Engine & Universal Mobile/Desktop Active', 
              'color: #e50914; font-weight: bold; font-size: 14px;', 'color: #10b981; font-weight: bold;');

  const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  // Automatically enable native theme song preferences in browser/webview client storage
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
     2. LOCAL SERVER THEME SONG DATABASE (Direct Local /Audio Stream)
     ========================================================================= */
  const LOCAL_SERVER_THEMES = [
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
    { keys: ["your name", "kimi no na wa"], streamUrl: "/Audio/de6b56676a3c8a3ab1ca0563d1421014/stream.mp3", title: "Your Name." },
    // Fallback CDN tracks for unindexed single-file media
    { keys: ["hanuman ansh", "hanuman"], streamUrl: "https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/audio/themes/hanuman-ansh.mp3", title: "Hanuman Ansh" },
    { keys: ["premada oorali", "premada"], streamUrl: "https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/audio/themes/premada-oorali.mp3", title: "Premada Oorali" },
    { keys: ["i ve always liked you", "ive always liked you", "always liked you"], streamUrl: "https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/audio/themes/i-ve-always-liked-you.mp3", title: "I've Always Liked You" },
    { keys: ["ramayana"], streamUrl: "https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/audio/themes/ramayana.mp3", title: "Ramayana" }
  ];

  /* =========================================================================
     3. UNIVERSAL REUSABLE AUDIO PIPELINE (Direct HTMLAudioElement)
     ========================================================================= */
  let globalAudio = document.getElementById('aetherfin-global-audio');
  if (!globalAudio) {
    globalAudio = document.createElement('audio');
    globalAudio.id = 'aetherfin-global-audio';
    globalAudio.setAttribute('playsinline', '');
    globalAudio.setAttribute('webkit-playsinline', '');
    // NOTE: NEVER set crossOrigin for same-origin audio streams to prevent Android WebView MediaPlayer errors!
    globalAudio.preload = 'auto';
    globalAudio.style.display = 'none';
    document.body.appendChild(globalAudio);
  }

  let activeTheme = null;
  let isMuted = false;
  let fadeTimer = null;
  let audioUnlocked = false;

  // Seamless touch unlock for Mobile App WebViews without resetting src
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

    for (const item of LOCAL_SERVER_THEMES) {
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
      return; // Already playing this exact track
    }

    if (fadeTimer) clearInterval(fadeTimer);

    // Don't play if movie video is actively playing in Jellyfin
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
          console.log("[AetherFin] Autoplay waiting for user touch gesture:", err.message);
          // Auto-resume on next user touch anywhere
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
     4. ACCURATE DETAIL PAGE & NAVIGATION STATE
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

  // Intercept taps & clicks
  function onCardClicked(target) {
    const card = target.closest('.card, .cardBox, .listItem, a[data-itemid], [data-id]');
    if (card) {
      const cardContainer = card.closest('.card') || card;
      const title = extractCardTitle(cardContainer);
      const theme = findThemeForText(title);
      if (theme) {
        isNavigatingToDetail = true;
        playTheme(theme, 0.24);
        setTimeout(() => { isNavigatingToDetail = false; }, 3500);
      }
    }

    if (target.closest('.btnPlay, [data-action="play"], button[data-id="play"], .videoPlayButton')) {
      stopMusic(300);
    }
  }

  document.addEventListener('click', (e) => { onCardClicked(e.target); }, true);
  document.addEventListener('touchend', (e) => { if (e.target) onCardClicked(e.target); }, { passive: true });

  // Route observer for detail page enter / exit
  let lastDetailPageState = false;
  function checkRouteState() {
    const onDetail = isCurrentlyOnDetailPage();

    if (onDetail) {
      lastDetailPageState = true;
      const titleEl = document.querySelector('.itemName, .parentName, h1.itemName, .detailPagePrimaryContainer h1');
      const docTitle = document.title ? document.title.replace('- Jellyfin', '').trim() : '';
      const title = titleEl ? titleEl.textContent.trim() : docTitle;
      const theme = findThemeForText(title);

      if (theme) {
        if (!activeTheme || activeTheme.url !== theme.url || globalAudio.paused) {
          playTheme(theme, 0.22);
        }
      }
    } else {
      if (lastDetailPageState && !isNavigatingToDetail) {
        // User exited detail page back to library/home -> stop audio!
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
     5. RESPONSIVE HOVER SWITCHING (CLEAN STOP ON LEAVE & INSTANT SWITCH)
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
            const theme = findThemeForText(title);

            if (theme) {
              // Immediately switch audio to this new hovered card!
              playTheme(theme, 0.18);
            } else {
              // Hovered card has no custom theme -> stop previous music!
              stopMusic(200);
            }
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
        // Check if cursor actually left this card container
        if (!related || !cardContainer.contains(related)) {
          if (hoverTimer) clearTimeout(hoverTimer);
          currentCardElem = null;
          // Clean, instant stop when mouse leaves the card!
          stopMusic(200);
        }
      }
    }, { passive: true });
  }

  /* =========================================================================
     6. FLOATING UI (RESPONSIVE FOR MOBILE BOTTOM BARS & DESKTOP)
     ========================================================================= */
  const uiStyles = document.createElement('style');
  uiStyles.textContent = `
    #aetherfin-floating-theme-btn {
      position: fixed;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 76px);
      left: 16px;
      z-index: 999998;
      display: flex;
      align-items: center;
      gap: 7px;
      background: rgba(24, 24, 27, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.2);
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
    }

    #aetherfin-audio-pill {
      position: fixed;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 76px);
      right: 16px;
      z-index: 999998;
      display: none;
      align-items: center;
      gap: 8px;
      background: rgba(24, 24, 27, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
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
      #aetherfin-floating-theme-btn {
        bottom: 24px;
        left: 20px;
      }
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
