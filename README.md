# 🌌 AetherFin — Next-Gen Jellyfin 12 Theme & Effects Suite

[![Jellyfin v12](https://img.shields.io/badge/Jellyfin-v12.x-00A4DC?style=for-the-badge&logo=jellyfin&logoColor=white)](https://jellyfin.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![jsDelivr](https://img.shields.io/badge/CDN-jsDelivr-E53935?style=for-the-badge&logo=jsdelivr&logoColor=white)](https://www.jsdelivr.com/)

A bespoke, production-grade theme and audio-visual experience suite engineered specifically for **Jellyfin 12**. Built with deep AMOLED obsidian blacks, 3D spring-physics card hover, frosted acrylic glass, and real-time Web Audio API sound feedback (PS5-style haptic ticks & completion celebration).

---

## ⚡ Quick Install (1-Line CSS Import)

In your Jellyfin dashboard:
1. Go to **Dashboard** $\rightarrow$ **General**.
2. Scroll to **Custom CSS code**.
3. Paste the one-liner below and click **Save**:

```css
@import url("https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/aetherfin.css");
```

---

## 🎨 Modular Color Schemes

Stack any of these below the main import to customize your accent:

| Scheme | Accent | One-Line Import |
| :--- | :--- | :--- |
| **Netflix (Default)** | 🔴 Crimson Red | `@import url("https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/color-schemes/netflix.css");` |
| **Cyber Cyan** | 🌐 Neon Cyan | `@import url("https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/color-schemes/cyber-cyan.css");` |
| **HBO Purple** | 🟣 Electric Violet | `@import url("https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/color-schemes/hbo-purple.css");` |
| **Emerald** | 🟢 Spotify Emerald | `@import url("https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/color-schemes/emerald.css");` |
| **AMOLED Pure** | ⚪ Minimal Monochrome | `@import url("https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/color-schemes/amoled-pure.css");` |

---

## 🔊 Interactive FX Engine (Audio & Celebration)

Located in [`scripts/aetherfin-fx.user.js`](scripts/aetherfin-fx.user.js):
* **Zero Audio Files:** All audio is synthesized in real-time via the browser's native **Web Audio API** (0ms latency, 100% offline).
* **PS5 Haptic Hover:** Soft, tactile 140Hz sine ticks on card hover.
* **Apple TV Mechanical Click:** Crisp selection clicks on cards, buttons, and navigation.
* **Ambient Drone on Hover:** Lingering on a card fades in a subtle cinematic harmonic drone.
* **🏆 Movie & Series Completion Celebration:**
  * Golden particle canvas confetti explosion when a movie finishes.
  * Triumphant 4-tone victory fanfare chord.
  * Luxury frosted achievement card: *"Finished & Added to History"*.

Install via **Tampermonkey / Violentmonkey** or inject into your client!

---

## 🛠️ Recommended Companion Plugins

* **[Media Bar](https://github.com/IAmParadox27/jellyfin-plugin-media-bar):** For full-width hero marquee banners.
* **[Home Screen Sections](https://github.com/IAmParadox27/jellyfin-plugin-home-sections):** For dynamic streaming rows.
* **[MDBList Ratings](https://github.com/Druidblack/Jellyfin.Plugin.MDBList_Ratings):** For IMDb & Rotten Tomatoes score badges.

---

## 📜 License
Released under the [MIT License](LICENSE).

