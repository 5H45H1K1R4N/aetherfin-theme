# 🌌 AetherFin — Zombie Edition & Sound FX Suite for Jellyfin 12

[![Jellyfin v12](https://img.shields.io/badge/Jellyfin-v12.x-00A4DC?style=for-the-badge&logo=jellyfin&logoColor=white)](https://jellyfin.org/)
[![Theme: Zombie Revived](https://img.shields.io/badge/Theme-Zombie_Revived-00AC6F?style=for-the-badge&logo=css3&logoColor=white)](https://github.com/MakD/zombie-release)
[![Web Audio API](https://img.shields.io/badge/Audio-Web_Audio_API-E53935?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

A bespoke visual theme and interactive audio suite designed specifically for **Jellyfin 12**. Powered by **[Zombie Revived](https://github.com/MakD/zombie-release)** for pure AMOLED blacks, paired with a lightweight **Web Audio API Sound FX & Theme Music Engine** featuring PS5-style tactile hover ticks, mechanical selection clicks, and seamless movie theme music playback.

---

## ✨ Features

* **🧟 Zombie Revived Visuals:** Deep AMOLED obsidian blacks, minimalist borders, and refined responsive typography across desktop, mobile app, and tablet.
* **🔊 Synthesized UI Sound Effects (0 Audio Files Needed):**
  * **PS5-Style Haptic Hover Ticks:** Subtle 140Hz micro-ticks when hovering over media cards and navigation buttons.
  * **Apple TV Mechanical Clicks:** Crisp selection audio feedback on item taps and clicks.
  * **Victory Fanfare:** 4-tone celebration chord when finishing a movie or show.
  * *All sound effects are generated in real-time in the browser using the Web Audio API (0ms latency, zero external downloads).*
* **🎵 Native Server Theme Songs Engine:**
  * **Automatic Discovery:** Automatically detects any `theme.mp3` in your media directories and streams it directly from your local Jellyfin server (`/Audio/{id}/stream.mp3`).
  * **Desktop Hover Previews:** Hovering over any movie card begins playing its theme music with an intentional 400ms dwell time and clean exit fade.
  * **Seamless Page Transition:** Tapping a card keeps the music playing smoothly as you navigate into the detail page.
  * **Full Mobile App Support:** Touch-activated audio pipeline optimized for Android WebViews (Jellyfin for Android).
  * **Floating Equalizer Pill:** Minimalist floating music pill (`🎵`) on the bottom-right with live animated equalizer bars and mute toggle.

---

## 🚀 Quick Setup (Copy & Paste)

### Step 1: Add the Theme CSS (1 Line)

1. Open your Jellyfin Web dashboard as an administrator.
2. Navigate to **Dashboard** $\rightarrow$ **General**.
3. Scroll down to **Custom CSS code** and paste:

```css
@import url("https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/aetherfin.css");
```

4. Click **Save**.

---

### Step 2: Install the Audio & Effects Engine

You can inject the script into your Jellyfin server for all users, or use a browser extension.

#### Option A: Server-Wide Injection (Recommended)
1. In Jellyfin, go to **Dashboard** $\rightarrow$ **Plugins** $\rightarrow$ **Catalog**.
2. Install the **JavaScript Injector** plugin and restart your Jellyfin server.
3. Open **Dashboard** $\rightarrow$ **Plugins** $\rightarrow$ **JavaScript Injector**.
4. Create a new script entry, paste the contents of [`scripts/aetherfin-fx.user.js`](scripts/aetherfin-fx.user.js), and click **Save**.

#### Option B: Browser Extension
* Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
* Add a new user script and paste [`scripts/aetherfin-fx.user.js`](scripts/aetherfin-fx.user.js).

---

## 🎬 How to Add Theme Music to Your Movies

AetherFin automatically streams theme music from your own Jellyfin server without requiring external CDNs!

Simply drop a 30-to-90 second audio file named **`theme.mp3`** into any movie or series directory:

```text
/Media/Movies/
  └── Interstellar (2014)/
        ├── Interstellar.2014.mkv
        ├── poster.jpg
        └── theme.mp3               <-- Your theme music clip!

/Media/Shows/
  └── Stranger Things/
        ├── Season 01/
        ├── poster.jpg
        └── theme.mp3               <-- Plays across all seasons and episodes!
```

After adding your files:
1. Go to **Jellyfin Dashboard** $\rightarrow$ **Libraries**.
2. Click **Scan All Libraries**.
3. Jellyfin will index your theme songs and AetherFin will immediately start playing them on card hover and detail views!

See [`audio/README.md`](audio/README.md) for audio optimization tips and batch helper scripts.

---

## 🛠️ Customization & Inspiration

The engine in [`scripts/aetherfin-fx.user.js`](scripts/aetherfin-fx.user.js) is designed to be easily modified. You can map custom titles to external URLs or local paths by editing the `DEMO_CUSTOM_THEMES` table:

```javascript
const DEMO_CUSTOM_THEMES = [
  { keys: ["interstellar"], url: "https://your-domain.com/audio/interstellar.mp3", title: "Interstellar" },
  { keys: ["stranger things"], url: "/Audio/your-custom-id/stream.mp3", title: "Stranger Things" }
];
```

---

## 📜 Credits & Acknowledgements

* **[MakD/zombie-release](https://github.com/MakD/zombie-release):** Base Zombie Revived CSS theme for Jellyfin 12.
* **[Jellyfin Project](https://jellyfin.org/):** The free software media system.

---

## 📄 License

Released under the [MIT License](LICENSE).
