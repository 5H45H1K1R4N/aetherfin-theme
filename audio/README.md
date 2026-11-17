# 🎵 Jellyfin Theme Audio Guide

AetherFin supports **Jellyfin Native Theme Songs** and custom audio streams directly from your local Jellyfin server or external URLs.

---

## 📂 Method 1: Native Jellyfin Theme Songs (Recommended)

Jellyfin natively supports playing backdrop theme music for any movie or TV series. When a file named `theme.mp3` is placed inside a media folder, Jellyfin automatically indexes it as a `ThemeSong` and exposes an instant, high-speed audio stream at:
```
http://<your-jellyfin-ip>:8096/Audio/<themeSongId>/stream.mp3
```

### Folder Structure Example:

```text
/Media/Movies/
  └── Interstellar (2014)/
        ├── Interstellar.2014.mkv
        ├── poster.jpg
        └── theme.mp3               <-- Place your 30s–90s MP3 audio clip here!

/Media/Shows/
  └── Stranger Things/
        ├── Season 01/
        ├── poster.jpg
        └── theme.mp3               <-- Plays for the entire show & episodes!
```

### Supported Audio Formats:
* `theme.mp3` (Most widely supported)
* `theme.m4a` / `theme.aac`
* `theme.flac` / `theme.ogg`

> **Tip:** After placing `theme.mp3` files in your media directories, go to **Jellyfin Dashboard** $\rightarrow$ **Libraries** and click **Scan All Libraries** so Jellyfin indexes them.

---

## 🎧 Method 2: Custom Mapping in `aetherfin-fx.user.js`

If you host clips on an external web server, CDN, or personal cloud, you can map any movie title directly inside `scripts/aetherfin-fx.user.js`:

```javascript
const CUSTOM_THEMES = [
  { 
    keys: ["interstellar"], 
    url: "https://your-domain.com/audio/interstellar.mp3", 
    title: "Interstellar" 
  },
  { 
    keys: ["stranger things"], 
    url: "https://your-domain.com/audio/stranger-things.mp3", 
    title: "Stranger Things" 
  }
];
```

---

## 💡 Best Practices for Theme Clips:
1. **Length:** 30 seconds to 2 minutes is ideal for preview loops.
2. **Bitrate:** 128 kbps – 192 kbps MP3 provides instant load times without sacrificing audio quality.
3. **Volume:** Normalize your audio clips (e.g. using Audacity or `ffmpeg-normalize -c:a libmp3lame`) so volume transitions are smooth across different titles.
