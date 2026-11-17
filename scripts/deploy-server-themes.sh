#!/bin/bash
# AetherFin — Automated Server Theme Deployer
# Copies all 33 curated theme tracks directly into their Jellyfin folders on the server storage
set -e

echo '=================================================='
echo '  AetherFin Native Server Theme Deployer'
echo '=================================================='

TMP_DIR="$HOME/aetherfin_tmp_themes"
mkdir -p "$TMP_DIR"
cd "$TMP_DIR"

echo '[1/3] Downloading 33 theme tracks from GitHub repo...'
GITHUB_RAW="https://raw.githubusercontent.com/5H45H1K1R4N/aetherfin-theme/main/audio/themes"

curl -sL -o "3-idiots.mp3" "$GITHUB_RAW/3-idiots.mp3"
curl -sL -o "alice-in-borderland.mp3" "$GITHUB_RAW/alice-in-borderland.mp3"
curl -sL -o "avengers.mp3" "$GITHUB_RAW/avengers.mp3"
curl -sL -o "bhooth-bangla.mp3" "$GITHUB_RAW/bhooth-bangla.mp3"
curl -sL -o "breaking-bad.mp3" "$GITHUB_RAW/breaking-bad.mp3"
curl -sL -o "bridge-to-terabithia.mp3" "$GITHUB_RAW/bridge-to-terabithia.mp3"
curl -sL -o "doraemon.mp3" "$GITHUB_RAW/doraemon.mp3"
curl -sL -o "final-destination.mp3" "$GITHUB_RAW/final-destination.mp3"
curl -sL -o "from.mp3" "$GITHUB_RAW/from.mp3"
curl -sL -o "googly.mp3" "$GITHUB_RAW/googly.mp3"
curl -sL -o "grave-of-fireflies.mp3" "$GITHUB_RAW/grave-of-fireflies.mp3"
curl -sL -o "hanuman-ansh.mp3" "$GITHUB_RAW/hanuman-ansh.mp3"
curl -sL -o "i-ve-always-liked-you.mp3" "$GITHUB_RAW/i-ve-always-liked-you.mp3"
curl -sL -o "ikka.mp3" "$GITHUB_RAW/ikka.mp3"
curl -sL -o "inception.mp3" "$GITHUB_RAW/inception.mp3"
curl -sL -o "interstellar.mp3" "$GITHUB_RAW/interstellar.mp3"
curl -sL -o "iron-man.mp3" "$GITHUB_RAW/iron-man.mp3"
curl -sL -o "jai-ho.mp3" "$GITHUB_RAW/jai-ho.mp3"
curl -sL -o "jailer-2.mp3" "$GITHUB_RAW/jailer-2.mp3"
curl -sL -o "kalki.mp3" "$GITHUB_RAW/kalki.mp3"
curl -sL -o "ms-dhoni.mp3" "$GITHUB_RAW/ms-dhoni.mp3"
curl -sL -o "phata-poster.mp3" "$GITHUB_RAW/phata-poster.mp3"
curl -sL -o "premada-oorali.mp3" "$GITHUB_RAW/premada-oorali.mp3"
curl -sL -o "princess-kaguya.mp3" "$GITHUB_RAW/princess-kaguya.mp3"
curl -sL -o "ramayana.mp3" "$GITHUB_RAW/ramayana.mp3"
curl -sL -o "slam-dunk.mp3" "$GITHUB_RAW/slam-dunk.mp3"
curl -sL -o "spider-man.mp3" "$GITHUB_RAW/spider-man.mp3"
curl -sL -o "stranger-things.mp3" "$GITHUB_RAW/stranger-things.mp3"
curl -sL -o "tokyo-drift.mp3" "$GITHUB_RAW/tokyo-drift.mp3"
curl -sL -o "toxic.mp3" "$GITHUB_RAW/toxic.mp3"
curl -sL -o "udta-teer.mp3" "$GITHUB_RAW/udta-teer.mp3"
curl -sL -o "vision-quest.mp3" "$GITHUB_RAW/vision-quest.mp3"
curl -sL -o "your-name.mp3" "$GITHUB_RAW/your-name.mp3"

echo '[2/3] Installing theme.mp3 into each movie and series folder...'
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/3 Idiots" ]; then
  cp "3-idiots.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/3 Idiots/theme.mp3"
  echo "  ✓ Installed: 3 Idiots"
fi
if [ -d "/storage/26B2-1AEB/Media/Series/ALICE IN BORDERLAND" ]; then
  cp "alice-in-borderland.mp3" "/storage/26B2-1AEB/Media/Series/ALICE IN BORDERLAND/theme.mp3"
  echo "  ✓ Installed: Alice in Borderland"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/The Avengers 2012" ]; then
  cp "avengers.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/The Avengers 2012/theme.mp3"
  echo "  ✓ Installed: The Avengers"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Bhooth Bangla" ]; then
  cp "bhooth-bangla.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Bhooth Bangla/theme.mp3"
  echo "  ✓ Installed: Bhooth Bangla"
fi
if [ -d "/storage/26B2-1AEB/Media/Series/Breaking Bad" ]; then
  cp "breaking-bad.mp3" "/storage/26B2-1AEB/Media/Series/Breaking Bad/theme.mp3"
  echo "  ✓ Installed: Breaking Bad"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Bridge to Terabithia" ]; then
  cp "bridge-to-terabithia.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Bridge to Terabithia/theme.mp3"
  echo "  ✓ Installed: Bridge to Terabithia"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Doraemon_ Nobita and the New Castle of the Undersea Devil" ]; then
  cp "doraemon.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Doraemon_ Nobita and the New Castle of the Undersea Devil/theme.mp3"
  echo "  ✓ Installed: Doraemon the Movie: New Nobita and the Castle of the Undersea Devil"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/The Fast and the Furious_ Tokyo Drift" ]; then
  cp "tokyo-drift.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/The Fast and the Furious_ Tokyo Drift/theme.mp3"
  echo "  ✓ Installed: The Fast and the Furious: Tokyo Drift"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Final Destination 5" ]; then
  cp "final-destination.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Final Destination 5/theme.mp3"
  echo "  ✓ Installed: Final Destination 5"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/The First Slam Dunk" ]; then
  cp "slam-dunk.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/The First Slam Dunk/theme.mp3"
  echo "  ✓ Installed: The First Slam Dunk"
fi
if [ -d "/storage/26B2-1AEB/Media/Series/from" ]; then
  cp "from.mp3" "/storage/26B2-1AEB/Media/Series/from/theme.mp3"
  echo "  ✓ Installed: FROM"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Googly" ]; then
  cp "googly.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Googly/theme.mp3"
  echo "  ✓ Installed: Googly"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Grave of the Fireflies" ]; then
  cp "grave-of-fireflies.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Grave of the Fireflies/theme.mp3"
  echo "  ✓ Installed: Grave of the Fireflies"
fi
if [ -d "/storage/26B2-1AEB/Media/Movies" ]; then
  cp "hanuman-ansh.mp3" "/storage/26B2-1AEB/Media/Movies/Hanuman Ansh-theme.mp3"
  echo "  ✓ Installed: Hanuman Ansh"
fi
if [ -d "/storage/26B2-1AEB/Media/Movies" ]; then
  cp "i-ve-always-liked-you.mp3" "/storage/26B2-1AEB/Media/Movies/I Ve Always Liked You Hindi Fan Dubbed Movie S01E01-theme.mp3"
  echo "  ✓ Installed: I Ve Always Liked You Hindi Fan Dubbed Movie S01E01"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Ikka" ]; then
  cp "ikka.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Ikka/theme.mp3"
  echo "  ✓ Installed: Ikka"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Inception 2010" ]; then
  cp "inception.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Inception 2010/theme.mp3"
  echo "  ✓ Installed: Inception"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Interstellar 2014" ]; then
  cp "interstellar.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Interstellar 2014/theme.mp3"
  echo "  ✓ Installed: Interstellar"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Iron Man 2008" ]; then
  cp "iron-man.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Iron Man 2008/theme.mp3"
  echo "  ✓ Installed: Iron Man"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Iron Man 2 2010" ]; then
  cp "iron-man.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Iron Man 2 2010/theme.mp3"
  echo "  ✓ Installed: Iron Man 2"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Iron Man 3 2013" ]; then
  cp "iron-man.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Iron Man 3 2013/theme.mp3"
  echo "  ✓ Installed: Iron Man 3"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Jai Ho" ]; then
  cp "jai-ho.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Jai Ho/theme.mp3"
  echo "  ✓ Installed: Jai Ho"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Jailer 2" ]; then
  cp "jailer-2.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Jailer 2/theme.mp3"
  echo "  ✓ Installed: Jailer 2"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Kalki 2898 AD" ]; then
  cp "kalki.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Kalki 2898 AD/theme.mp3"
  echo "  ✓ Installed: Kalki 2898-AD"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/M.S. Dhoni_ The Untold Story" ]; then
  cp "ms-dhoni.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/M.S. Dhoni_ The Untold Story/theme.mp3"
  echo "  ✓ Installed: M.S. Dhoni: The Untold Story"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Phata Poster Nikhla Hero" ]; then
  cp "phata-poster.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Phata Poster Nikhla Hero/theme.mp3"
  echo "  ✓ Installed: Phata Poster Nikhla Hero"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies" ]; then
  cp "premada-oorali.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Premada Oorali-theme.mp3"
  echo "  ✓ Installed: Premada Oorali"
fi
if [ -d "/storage/26B2-1AEB/Media/Movies" ]; then
  cp "ramayana.mp3" "/storage/26B2-1AEB/Media/Movies/Ramayana_ Rise of a Legend-theme.mp3"
  echo "  ✓ Installed: Ramayana: Rise of a Legend"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Spider-Man_ Brand New Day 2026" ]; then
  cp "spider-man.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Spider-Man_ Brand New Day 2026/theme.mp3"
  echo "  ✓ Installed: Spider-Man: Brand New Day"
fi
if [ -d "/storage/26B2-1AEB/Media/Series/Stranger Things" ]; then
  cp "stranger-things.mp3" "/storage/26B2-1AEB/Media/Series/Stranger Things/theme.mp3"
  echo "  ✓ Installed: Stranger Things"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/The Tale of the Princess Kaguya" ]; then
  cp "princess-kaguya.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/The Tale of the Princess Kaguya/theme.mp3"
  echo "  ✓ Installed: The Tale of The Princess Kaguya"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Toxic" ]; then
  cp "toxic.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Toxic/theme.mp3"
  echo "  ✓ Installed: Toxic"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Udta Teer" ]; then
  cp "udta-teer.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Udta Teer/theme.mp3"
  echo "  ✓ Installed: Udta Teer"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Series/VisionQuest" ]; then
  cp "vision-quest.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Series/VisionQuest/theme.mp3"
  echo "  ✓ Installed: VisionQuest"
fi
if [ -d "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Your Name" ]; then
  cp "your-name.mp3" "/storage/26B2-1AEB/Media/MovieBox-TUI/Movies/Your Name/theme.mp3"
  echo "  ✓ Installed: Your Name."
fi

echo '[3/3] Triggering Jellyfin library scan so server discovers all theme songs...'
TOKEN="2d2051fbff00417eb2526343d3e1450f"
curl -s -X POST "http://127.0.0.1:8096/Library/Refresh" \
  -H "Authorization: MediaBrowser Client=\"Script\", Device=\"Termux\", DeviceId=\"1\", Version=\"1.0\", Token=\"$TOKEN\"" || true

# Cleanup temporary download folder
rm -rf "$TMP_DIR"

echo ''
echo '=================================================='
echo '  SUCCESS! All theme songs installed on server.'
echo '  Stored directly in /storage/26B2-1AEB/ with movies!'
echo '=================================================='