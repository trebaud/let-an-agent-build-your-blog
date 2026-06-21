#!/bin/bash
set -euo pipefail

# Example deploy script: pull, install, build, and rsync ./public to a server.
# Adjust the paths below for your own setup, or replace this entirely with your host's
# deploy step (Netlify, Cloudflare Pages, GitHub Pages, S3, etc.) — `bun run build` just
# produces a static ./public folder.

# ─── Configuration ────────────────────────────────────────────────────────────
REPO_PATH="$HOME/pagewright"
BUILD_DIR="$REPO_PATH/public"
DEST_PATH="/var/www/site"        # where your web server serves files from
# For a remote target use: DEST_PATH="user@host:/var/www/site"

# ─── Deploy ───────────────────────────────────────────────────────────────────
cd "$REPO_PATH"

echo "[1/3] Installing dependencies..."
bun install

echo "[2/3] Building..."
bun run build

if [ ! -d "$BUILD_DIR" ]; then
  echo "Build output '$BUILD_DIR' does not exist — build may have failed." >&2
  exit 1
fi

echo "[3/3] Deploying to $DEST_PATH..."
rsync -avz --delete "$BUILD_DIR/" "$DEST_PATH/"

echo "✅ Deployment complete."
