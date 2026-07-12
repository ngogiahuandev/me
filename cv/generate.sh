#!/usr/bin/env sh
set -eu

CV_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT=$(CDPATH= cd -- "$CV_DIR/.." && pwd)
BRAVE="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"

if [ ! -x "$BRAVE" ]; then
  printf 'Brave Browser was not found at: %s\n' "$BRAVE" >&2
  printf 'Install Brave or update BRAVE in cv/generate.sh.\n' >&2
  exit 1
fi

mkdir -p "$ROOT/output/pdf" "$ROOT/apps/web/public"
"$BRAVE" \
  --headless=new \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="$ROOT/output/pdf/ngo-gia-huan-cv.pdf" \
  "file://$CV_DIR/index.html" >/dev/null 2>&1
cp "$ROOT/output/pdf/ngo-gia-huan-cv.pdf" "$ROOT/apps/web/public/huanngdev_cv.pdf"

printf 'Generated %s\n' "$ROOT/output/pdf/ngo-gia-huan-cv.pdf"
printf 'Updated   %s\n' "$ROOT/apps/web/public/huanngdev_cv.pdf"
