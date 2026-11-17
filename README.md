# 🌌 AetherFin — Zombie Edition, Hero Media Bar & Sound Suite for Jellyfin 12

[![Jellyfin v12](https://img.shields.io/badge/Jellyfin-v12.x-00A4DC?style=for-the-badge&logo=jellyfin&logoColor=white)](https://jellyfin.org/)
[![Theme: Zombie Revived](https://img.shields.io/badge/Theme-Zombie_Revived-00AC6F?style=for-the-badge&logo=css3&logoColor=white)](https://github.com/MakD/zombie-release)
[![Media Bar: Enabled](https://img.shields.io/badge/Hero-Media_Bar_v6-FF9900?style=for-the-badge&logo=youtube&logoColor=white)](https://github.com/MakD/Jellyfin-Media-Bar)
[![Web Audio API](https://img.shields.io/badge/Audio-Web_Audio_API-E53935?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

A bespoke visual theme and interactive audio suite designed specifically for **Jellyfin 12**. Powered by **[Zombie Revived](https://github.com/MakD/zombie-release)** for pure AMOLED blacks, an animated **Hero Media Bar Showcase**, and a lightweight **Web Audio API Sound FX & Theme Music Engine** featuring tactile bubble/pop hover chimes, mechanical clicks, and seamless movie theme music playback.

---

## ✨ Features

* **🧟 Zombie Revived Visuals:** Deep AMOLED obsidian blacks, minimalist borders, and refined typography across desktop, mobile app, and TV.
* **🎬 Cinematic Hero Media Bar (Marquee Carousel):**
  * Full-width animated hero spotlight banner at the top of your Home screen.
  * Displays high-res backdrops, clear logo artwork, synopsis, and instant "Play" action buttons.
  * Styled with Zombie's official frosted Marquee layouts for desktop, tablet, and mobile.
* **👥 Dedicated Family Activity Page (Header Navigation Tab):**
  * **Top Navigation Tab:** Sits directly in your top navigation bar right next to *Favorites*, *Movies*, and *Shows* (`[Logo] KHURE  🤍 Favorites  🎬 Movies  📺 Shows  👥 Activity`).
  * **Dedicated Full Page View:** Clicking *Activity* opens a full, native library view dedicated to household watch history.
  * **Smart Filter Bar:** Filter activity instantly by *All Activity*, *Movies*, *Shows*, or by family member (`admin`, `TV`, `prem`, `hacker`).
  * **Discreet Frosted Poster Badges:** A subtle frosted pill in the poster corner (`admin • 10h ago`, `TV • Yesterday`).
  * **D-Pad & Remote Ready:** Full TV remote focus physics with tactile hover chimes and snap click feedback.
* **🔊 Synthesized UI Sound Effects (0 Audio Files Needed):**
  * **Tactile Bubble/Pop Hover Chimes:** High-tech acoustic pop chime (`520Hz` $\rightarrow$ `700Hz` with crystal harmonics) on card hover and TV remote D-pad focus.
  * **Apple TV Mechanical Clicks:** Crisp `840Hz` tactile snap feedback on item taps and clicks.
* **🎵 Native Server Theme Songs Engine:**
  * **Zero External Dependencies:** Streams backdrop music directly from your local Jellyfin server (`/Audio/{id}/stream.mp3`).
  * **Desktop Hover Previews:** Hovering over any movie card begins playing its theme music with an intentional 400ms dwell time.
  * **Seamless Page Transition:** Tapping a card keeps the music playing smoothly as you navigate into the detail page.
  * **Full Mobile & TV Support:** D-Pad remote navigation and touch-activated playback pipeline.
  * **Floating Equalizer Pill:** Minimalist floating music pill (`🎵`) on the bottom-right with live animated equalizer bars and mute toggle.

---

## 🚀 Quick Setup (Copy & Paste)

### Step 1: Add the Theme & Media Bar CSS (1 Line)

1. Open your Jellyfin Web dashboard as an administrator.
2. Navigate to **Dashboard** $\rightarrow$ **General**.
3. Scroll down to **Custom CSS code** and paste:

```css
@import url("https://cdn.jsdelivr.net/gh/5H45H1K1R4N/aetherfin-theme@main/aetherfin.css");
```

4. Click **Save**.

---

### Step 2: Install the Audio & Effects Engine

1. In Jellyfin, go to **Dashboard** $\rightarrow$ **Plugins** $\rightarrow$ **Catalog**.
2. Install the **JavaScript Injector** plugin (and **Media Bar** plugin).
3. Open **Dashboard** $\rightarrow$ **Plugins** $\rightarrow$ **JavaScript Injector**.
4. Paste the contents of [`scripts/aetherfin-fx.user.js`](scripts/aetherfin-fx.user.js) into a script entry and click **Save**.

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

After adding your files, go to **Jellyfin Dashboard** $\rightarrow$ **Libraries** $\rightarrow$ **Scan All Libraries**.

---

## 📄 License

Released under the [MIT License](LICENSE).
