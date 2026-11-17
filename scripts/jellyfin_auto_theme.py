#!/usr/bin/env python3
"""
=============================================================================
 Jellyfin Auto Theme Song Fetcher (YouTube Music Engine)
=============================================================================
 Automatically finds and downloads high-quality official theme songs
 directly into movie and TV show folders as 'theme.mp3' or 'theme.m4a'.
 
 Features:
 1. Robust Engine: Automatically detects broken ffmpeg and falls back to native M4A.
 2. Shared Folder Safety: Uses <MovieName>-theme if files share a directory.
 3. Duration Filter: Automatically selects official tracks (45s to 360s).
 4. Instant Indexing: Refreshes Jellyfin so music plays immediately.

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

try:
    import yt_dlp
except ImportError:
    print("Error: yt-dlp is required. Install via: pip install yt-dlp")
    sys.exit(1)

# Default configuration
DEFAULT_SERVER = "http://127.0.0.1:8096"
DEFAULT_TOKEN = "2d2051fbff00417eb2526343d3e1450f"


def is_ffmpeg_functional():
    """Verify that ffmpeg actually runs without dynamic linking errors (e.g. missing libplacebo)."""
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
    for ext in [".m4a", ".mp3", ".flac", ".ogg"]:
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


def refresh_jellyfin_item(server_url, token, item_id):
    """Notify Jellyfin to refresh metadata and recognize the new theme song."""
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
                if 45 <= dur <= 360:
                    return {
                        "url": entry.get("url") or f"https://www.youtube.com/watch?v={entry.get('id')}",
                        "title": title,
                        "duration": dur
                    }
        except Exception as e:
            print(f"    [!] Search error: {e}")
    return None


def download_theme_audio(video_url, target_base, dry_run=False, force_no_ffmpeg=False):
    """Download audio stream from YouTube with automatic ffmpeg fallback."""
    has_ffmpeg = (not force_no_ffmpeg) and is_ffmpeg_functional()
    out_tmpl = f"{target_base}.%(ext)s"

    if dry_run:
        target_ext = "mp3" if has_ffmpeg else "m4a"
        print(f"    [DRY-RUN] Would download ({'ffmpeg-mp3' if has_ffmpeg else 'native-m4a'}) to: {target_base}.{target_ext}")
        return True

    if has_ffmpeg:
        # Use FFmpeg to convert to standard MP3
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
    else:
        # Download native high-quality AAC/M4A directly (100% pure Python, zero FFmpeg dependencies!)
        ydl_opts = {
            "format": "bestaudio[ext=m4a]/bestaudio[ext=mp3]/bestaudio",
            "outtmpl": out_tmpl,
            "quiet": True,
            "noplaylist": True,
            "overwrites": True
        }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        saved_file = check_existing_theme(target_base)
        if saved_file:
            return saved_file
    except Exception as e:
        print(f"    [!] Download error: {e}")
        # If ffmpeg failed unexpectedly during postprocessing, retry with native m4a
        if has_ffmpeg:
            print("    [!] Retrying download with native M4A mode (bypassing ffmpeg)...")
            return download_theme_audio(video_url, target_base, dry_run=dry_run, force_no_ffmpeg=True)

    return None


def process_missing_items(server_url, token, dry_run=False, force_no_ffmpeg=False):
    """Process all items missing theme music."""
    missing = get_items_without_themes(server_url, token)
    if not missing:
        print("[✓] All movies and series have theme music!")
        return 0

    has_ffmpeg = (not force_no_ffmpeg) and is_ffmpeg_functional()
    if not has_ffmpeg:
        print("[i] Using native high-quality M4A mode (100% pure Python, zero FFmpeg dependencies).")
        print("    Jellyfin natively plays .m4a theme files out of the box!\n")

    print(f"[*] Found {len(missing)} item(s) without theme songs.")
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
        print(f"    Downloading to: {target_base}... ")

        saved_path = download_theme_audio(best_track["url"], target_base, dry_run=dry_run, force_no_ffmpeg=force_no_ffmpeg)
        if saved_path:
            print(f"    [✓] Successfully saved: {os.path.basename(saved_path)}!")
            if not dry_run:
                refresh_jellyfin_item(server_url, token, item["id"])
                print("    [✓] Jellyfin notified to index theme song.")
            processed += 1
        else:
            print("    [x] Download could not complete.")

        time.sleep(1)

    return processed


def main():
    parser = argparse.ArgumentParser(description="Jellyfin Auto Theme Song Downloader")
    parser.add_argument("--server", default=DEFAULT_SERVER, help="Jellyfin Server URL")
    parser.add_argument("--token", default=DEFAULT_TOKEN, help="Jellyfin Admin API Token")
    parser.add_argument("--watch", action="store_true", help="Run continuously in background, checking for new movies every N minutes")
    parser.add_argument("--interval", type=int, default=300, help="Interval in seconds for watch mode (default: 300s / 5 mins)")
    parser.add_argument("--dry-run", action="store_true", help="Simulate searches without downloading files")
    parser.add_argument("--no-ffmpeg", action="store_true", help="Force pure Python native M4A download mode (bypasses FFmpeg completely)")

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
    print(" 🎬 Jellyfin Auto Theme Song Engine (Zero-FFmpeg Pure Python Mode)")
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
                process_missing_items(server, args.token, dry_run=args.dry_run, force_no_ffmpeg=args.no_ffmpeg)
            except Exception as e:
                print(f"[!] Cycle error: {e}")
            print(f"\n[*] Sleeping for {args.interval}s until next check...")
            time.sleep(args.interval)
    else:
        process_missing_items(server, args.token, dry_run=args.dry_run, force_no_ffmpeg=args.no_ffmpeg)


if __name__ == "__main__":
    main()
