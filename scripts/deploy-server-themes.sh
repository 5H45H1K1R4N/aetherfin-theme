#!/bin/bash
# ==============================================================================
# AetherFin — Native Server Theme Songs Deployment Helper
# ==============================================================================
# This script demonstrates how to deploy `theme.mp3` files into your Jellyfin 
# movie and series folders so Jellyfin natively indexes and streams them.
# ==============================================================================

set -e

echo '=================================================='
echo '  AetherFin Native Theme Songs Deployer (Template)'
echo '=================================================='

# 1. CONFIGURE YOUR MEDIA ROOT PATH:
# Example: /mnt/media/Movies or /storage/26B2-1AEB/Media/Movies
MEDIA_ROOT="${1:-/path/to/your/movies}"

if [ ! -d "$MEDIA_ROOT" ]; then
  echo "Error: Directory '$MEDIA_ROOT' does not exist."
  echo "Usage: ./deploy-server-themes.sh /path/to/your/movies"
  exit 1
fi

echo "Scanning media library at: $MEDIA_ROOT"

# 2. HOW IT WORKS:
# Jellyfin automatically detects any audio file named 'theme.mp3' in a movie
# or series folder as its ThemeSong.
#
# You can copy existing theme clips or download sample audio for your collection:

# Example 1: Check for movie folder and place theme.mp3
# if [ -d "$MEDIA_ROOT/Interstellar (2014)" ]; then
#   cp "/path/to/interstellar-theme.mp3" "$MEDIA_ROOT/Interstellar (2014)/theme.mp3"
#   echo "  ✓ Installed theme for Interstellar"
# fi

# Example 2: Find all movie subfolders missing theme.mp3
echo ""
echo "Movie folders currently missing theme.mp3:"
find "$MEDIA_ROOT" -mindepth 1 -maxdepth 1 -type d | while read -r folder; do
  if [ ! -f "$folder/theme.mp3" ]; then
    echo "  [-] Missing: $(basename "$folder")"
  else
    echo "  [+] Present: $(basename "$folder")"
  fi
done

echo ""
echo "=================================================="
echo "Deployment scan completed!"
echo "After adding theme.mp3 files, trigger a library scan:"
echo "Jellyfin Dashboard -> Libraries -> Scan All Libraries"
echo "=================================================="
