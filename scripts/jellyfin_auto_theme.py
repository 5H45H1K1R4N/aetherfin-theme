#!/usr/bin/env python3
"""
=============================================================================
 Jellyfin Auto Theme Song Fetcher (YouTube Music Engine)
=============================================================================
 Automatically finds and downloads high-quality official theme songs
 directly into movie and TV show folders as 'theme.mp3'.
 
 Features:
 1. Automatic MP3 Conversion: Ensures format is 100% compatible with Jellyfin.
 2. Shared Folder Safety: Uses <MovieName>-theme.mp3 if files share a directory.
 3. Duration Filter: Automatically selects official tracks (45s to 360s).
 4. Instant Indexing: Triggers Jellyfin scan so music plays immediately.

 Author: 5H45H1K1R4N
=============================================================================
"""

import os
import sys
import time
import subprocess
import argparse
import urllib.request
import urllib.parse
import json
import unicodedata
import re

def clean_movie_title(name):
    """Normalize accents (e.g. Bāhubali -> Bahubali) and strip release tag clutter."""
    if not name:
        return ""
    nfd = unicodedata.normalize('NFKD', name)
    clean = ''.join(c for c in nfd if not unicodedata.combining(c))
    clean = clean.replace('_', ' ')
    clean = re.sub(r'(?i)\b(hindi|fan dubbed|dubbed|1080p|720p|hdtc|web-dl|x264|x265|s\d+e\d+)\b', ' ', clean)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean

try:
    import yt_dlp
except ImportError:
    print("Error: yt-dlp is required. Install via: pip install yt-dlp")
    sys.exit(1)

# Default configuration
DEFAULT_SERVER = "http://127.0.0.1:8096"
DEFAULT_TOKEN = "2d2051fbff00417eb2526343d3e1450f"


def check_ffmpeg():
    """Verify that ffmpeg is installed and functional."""
    try:
        proc = subprocess.run(
            ["ffmpeg", "-version"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=3
        )
        return proc.returncode == 0
    except Exception:
        return False


def get_jellyfin_headers(token):
    return {
        "Authorization": f'MediaBrowser Client="AutoTheme", Device="Daemon", DeviceId="autotheme1", Version="1.0", Token="{token}"',
        "Content-Type": "application/json"
    }


def get_target_theme_base(item_path, item_type="Movie"):
    """
    Determine safe target path without extension.
    - If in a dedicated movie folder (e.g. Movies/3 Idiots/3 Idiots.mp4) -> .../3 Idiots/theme
    - If in a shared root folder (e.g. Movies/Ramayana.mp4) -> .../Movies/Ramayana-theme
    """
    folder = os.path.dirname(item_path) if item_type == "Movie" else item_path
    base_name = os.path.splitext(os.path.basename(item_path))[0]
    folder_name = os.path.basename(folder).lower()

    if folder_name in ["movies", "movie", "downloads", "download", "media"]:
        return os.path.join(folder, f"{base_name}-theme")
    else:
        return os.path.join(folder, "theme")


def check_existing_theme(target_base):
    """Check if any theme file exists for this item."""
    for ext in [".mp3", ".m4a", ".flac", ".ogg"]:
        if os.path.exists(f"{target_base}{ext}"):
            return f"{target_base}{ext}"
    return None


def get_items_without_themes(server_url, token):
    """Fetch movies and series that do not yet have a theme song."""
    url = f"{server_url}/Items?Recursive=true&IncludeItemTypes=Movie,Series&Fields=Path,ThemeSongIds,ProductionYear"
    req = urllib.request.Request(url, headers=get_jellyfin_headers(token))
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            data = json.loads(res.read())
            items = data.get("Items", [])
            missing = []
            for item in items:
                path = item.get("Path")
                if not path:
                    continue

                target_base = get_target_theme_base(path, item.get("Type"))
                theme_file = check_existing_theme(target_base)

                has_theme = (item.get("ThemeSongIds") and len(item.get("ThemeSongIds")) > 0) or (theme_file is not None)
                if not has_theme:
                    missing.append({
                        "id": item.get("Id"),
                        "name": item.get("Name"),
                        "type": item.get("Type"),
                        "year": item.get("ProductionYear"),
                        "path": path,
                        "target_base": target_base
                    })
            return missing
    except Exception as e:
        print(f"[!] Error querying Jellyfin items: {e}")
        return []


def trigger_jellyfin_refresh(server_url, token):
    """Trigger library refresh so Jellyfin immediately indexes all new theme songs."""
    url = f"{server_url}/Library/Refresh"
    req = urllib.request.Request(url, data=b"", headers=get_jellyfin_headers(token), method="POST")
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            return res.status in (200, 204)
    except Exception as e:
        return False


def find_best_youtube_track(query):
    """Search YouTube and select the best candidate (45s to 360s duration)."""
    search_query = f"ytsearch6:{query}"
    ydl_opts = {
        "quiet": True,
        "extract_flat": True,
        "noplaylist": True
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            res = ydl.extract_info(search_query, download=False)
            entries = res.get("entries", [])
            for entry in entries:
                dur = entry.get("duration") or 0
                title = entry.get("title", "")
                if 45 <= dur <= 360:
                    return {
                        "url": entry.get("url") or f"https://www.youtube.com/watch?v={entry.get('id')}",
                        "title": title,
                        "duration": dur
                    }
        except Exception as e:
            print(f"    [!] Search error: {e}")
    return None


def download_theme_mp3(video_url, target_base, dry_run=False):
    """Download audio stream from YouTube and convert to MP3."""
    out_tmpl = f"{target_base}.%(ext)s"

    if dry_run:
        print(f"    [DRY-RUN] Would download to: {target_base}.mp3")
        return True

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": out_tmpl,
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
        "quiet": True,
        "noplaylist": True,
        "overwrites": True
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        target_mp3 = f"{target_base}.mp3"
        if os.path.exists(target_mp3):
            return target_mp3
    except Exception as e:
        print(f"    [!] Download failed: {e}")

    return None


def process_missing_items(server_url, token, dry_run=False):
    """Process all items missing theme music."""
    if not check_ffmpeg():
        print("\n[!] ERROR: FFmpeg is not functional on this device!")
        print("    In Termux, fix it by running:")
        print("        pkg install libplacebo -y")
        print("    or:")
        print("        pkg upgrade -y\n")
        return 0

    missing = get_items_without_themes(server_url, token)
    if not missing:
        print("[✓] All movies and series have theme music!")
        return 0

    print(f"\n[*] Found {len(missing)} item(s) without theme songs.")
    processed = 0

    for idx, item in enumerate(missing, 1):
        name = item["name"]
        year = f"({item['year']})" if item.get("year") else ""
        target_base = item["target_base"]
        parent_dir = os.path.dirname(target_base)

        print(f"\n[{idx}/{len(missing)}] Processing: {name} {year}")

        if not os.path.exists(parent_dir):
            print(f"    [!] Directory not accessible: {parent_dir}")
            continue

        query = f"{name} {year} official theme song soundtrack"
        print(f"    Searching YouTube: '{query}'...")

        best_track = find_best_youtube_track(query)
        if not best_track:
            query_fb = f"{name} theme song OST"
            best_track = find_best_youtube_track(query_fb)

        if not best_track:
            print("    [x] No matching audio track found.")
            continue

        print(f"    Found: \"{best_track['title']}\" ({best_track['duration']}s)")
        print(f"    Downloading to: {target_base}.mp3 ...")

        saved_path = download_theme_mp3(best_track["url"], target_base, dry_run=dry_run)
        if saved_path:
            print(f"    [✓] Successfully saved: {os.path.basename(saved_path)}!")
            processed += 1
        else:
            print("    [x] Download could not complete.")

        time.sleep(1)

    if processed > 0 and not dry_run:
        print("\n[*] Triggering Jellyfin library scan to index new theme songs...")
        trigger_jellyfin_refresh(server_url, token)
        print("[✓] Jellyfin scan initiated!")

    return processed


def main():
    parser = argparse.ArgumentParser(description="Jellyfin Auto Theme Song Downloader")
    parser.add_argument("--server", default=DEFAULT_SERVER, help="Jellyfin Server URL")
    parser.add_argument("--token", default=DEFAULT_TOKEN, help="Jellyfin Admin API Token")
    parser.add_argument("--watch", action="store_true", help="Run continuously in background, checking for new movies every N minutes")
    parser.add_argument("--interval", type=int, default=300, help="Interval in seconds for watch mode (default: 300s / 5 mins)")
    parser.add_argument("--dry-run", action="store_true", help="Simulate searches without downloading files")

    args = parser.parse_args()

    server = args.server
    try:
        urllib.request.urlopen(f"{server}/System/Info", timeout=2)
    except Exception:
        if "127.0.0.1" in server or "localhost" in server:
            alt_server = "http://192.168.31.178:8096"
            try:
                urllib.request.urlopen(f"{alt_server}/System/Info", timeout=2)
                server = alt_server
            except Exception:
                pass

    print("=" * 65)
    print(" 🎬 Jellyfin Auto Theme Song Engine (Direct MP3 Fetcher)")
    print("=" * 65)
    print(f" Server:  {server}")
    print(f" Mode:    {'Watch Mode (Daemon every ' + str(args.interval) + 's)' if args.watch else 'Single Scan'}")
    if args.dry_run:
        print(" Mode:    DRY RUN (no downloads)")
    print("=" * 65)

    if args.watch:
        print("[*] Starting watcher daemon. Press Ctrl+C to stop.\n")
        while True:
            try:
                process_missing_items(server, args.token, dry_run=args.dry_run)
            except Exception as e:
                print(f"[!] Cycle error: {e}")
            print(f"\n[*] Sleeping for {args.interval}s until next check...")
            time.sleep(args.interval)
    else:
        process_missing_items(server, args.token, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
