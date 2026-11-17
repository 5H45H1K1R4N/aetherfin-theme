#!/usr/bin/env python3
"""
=============================================================================
 Jellyfin Auto Theme Song Fetcher (YouTube Music Engine)
=============================================================================
 Automatically finds and downloads high-quality official theme songs
 directly into movie and TV show folders as 'theme.mp3'.
 
 Whenever a new movie is added via MovieBox-TUI or any source:
 1. Queries Jellyfin API for items lacking a theme song.
 2. Searches YouTube for the official OST/Theme song (skipping multi-hour videos).
 3. Downloads & converts the audio to 'theme.mp3' in the movie folder.
 4. Triggers Jellyfin library refresh so theme music is available instantly!

 Author: 5H45H1K1R4N
=============================================================================
"""

import os
import sys
import time
import argparse
import urllib.request
import urllib.parse
import json

try:
    import yt_dlp
except ImportError:
    print("Error: yt-dlp is required. Install via: pip install yt-dlp")
    sys.exit(1)

# Default configuration
DEFAULT_SERVER = "http://127.0.0.1:8096"
DEFAULT_TOKEN = "2d2051fbff00417eb2526343d3e1450f"


def get_jellyfin_headers(token):
    return {
        "Authorization": f'MediaBrowser Client="AutoTheme", Device="Daemon", DeviceId="autotheme1", Version="1.0", Token="{token}"',
        "Content-Type": "application/json"
    }


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

                folder = os.path.dirname(path) if item.get("Type") == "Movie" else path
                theme_file = os.path.join(folder, "theme.mp3")

                # If theme.mp3 doesn't exist on disk or not registered in Jellyfin
                has_theme = (item.get("ThemeSongIds") and len(item.get("ThemeSongIds")) > 0) or os.path.exists(theme_file)
                if not has_theme:
                    missing.append({
                        "id": item.get("Id"),
                        "name": item.get("Name"),
                        "type": item.get("Type"),
                        "year": item.get("ProductionYear"),
                        "path": path,
                        "folder": folder
                    })
            return missing
    except Exception as e:
        print(f"[!] Error querying Jellyfin items: {e}")
        return []


def refresh_jellyfin_item(server_url, token, item_id):
    """Notify Jellyfin to refresh metadata and recognize the new theme.mp3."""
    url = f"{server_url}/Items/{item_id}/Refresh?MetadataRefreshMode=Default&ImageRefreshMode=Default&ReplaceAllMetadata=false&ReplaceAllImages=false"
    req = urllib.request.Request(url, data=b"", headers=get_jellyfin_headers(token), method="POST")
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            return res.status in (200, 204)
    except Exception as e:
        print(f"    [!] Refresh notice failed: {e}")
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
                # Skip 1-hour+ albums or 15-second teaser shorts
                if 45 <= dur <= 360:
                    return {
                        "url": entry.get("url") or f"https://www.youtube.com/watch?v={entry.get('id')}",
                        "title": title,
                        "duration": dur
                    }
        except Exception as e:
            print(f"    [!] Search error: {e}")
    return None


def download_theme_mp3(video_url, output_folder, dry_run=False):
    """Download audio stream from YouTube and convert to theme.mp3."""
    target_mp3 = os.path.join(output_folder, "theme.mp3")

    if dry_run:
        print(f"    [DRY-RUN] Would download to: {target_mp3}")
        return True

    # Temporary file pattern
    out_tmpl = os.path.join(output_folder, "theme.%(ext)s")

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

        if os.path.exists(target_mp3):
            return True
    except Exception as e:
        print(f"    [!] Download failed: {e}")

    return False


def process_missing_items(server_url, token, dry_run=False):
    """Process all items missing theme music."""
    missing = get_items_without_themes(server_url, token)
    if not missing:
        print("[✓] All movies and series have theme music!")
        return 0

    print(f"\n[*] Found {len(missing)} item(s) without theme songs.")
    processed = 0

    for idx, item in enumerate(missing, 1):
        name = item["name"]
        year = f"({item['year']})" if item.get("year") else ""
        folder = item["folder"]

        print(f"\n[{idx}/{len(missing)}] Processing: {name} {year}")

        # Check write permissions
        if not os.path.exists(folder):
            print(f"    [!] Folder not accessible on this device: {folder}")
            print("    [TIP] If running from PC, run this script directly on Termux/Android.")
            continue

        query = f"{name} {year} official theme song soundtrack"
        print(f"    Searching YouTube: '{query}'...")

        best_track = find_best_youtube_track(query)
        if not best_track:
            # Fallback query
            query_fb = f"{name} theme song OST"
            best_track = find_best_youtube_track(query_fb)

        if not best_track:
            print("    [x] No matching audio track found.")
            continue

        print(f"    Found: \"{best_track['title']}\" ({best_track['duration']}s)")
        print(f"    Downloading to: {folder}/theme.mp3 ...")

        success = download_theme_mp3(best_track["url"], folder, dry_run=dry_run)
        if success:
            print("    [✓] Successfully saved theme.mp3!")
            if not dry_run:
                refresh_jellyfin_item(server_url, token, item["id"])
                print("    [✓] Jellyfin notified to index theme song.")
            processed += 1
        else:
            print("    [x] Download could not complete.")

        time.sleep(1)  # Gentle delay

    return processed


def main():
    parser = argparse.ArgumentParser(description="Jellyfin Auto Theme Song Downloader")
    parser.add_argument("--server", default=DEFAULT_SERVER, help="Jellyfin Server URL (default: http://127.0.0.1:8096 or http://192.168.31.178:8096)")
    parser.add_argument("--token", default=DEFAULT_TOKEN, help="Jellyfin Admin API Token")
    parser.add_argument("--watch", action="store_true", help="Run continuously in background, checking for new movies every N minutes")
    parser.add_argument("--interval", type=int, default=300, help="Interval in seconds for watch mode (default: 300s / 5 mins)")
    parser.add_argument("--dry-run", action="store_true", help="Simulate searches without downloading files")

    args = parser.parse_args()

    # If default server is unreachable, test LAN IP
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
    print(" 🎬 Jellyfin Auto Theme Song Engine (100% Automatic Coverage)")
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
