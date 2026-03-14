#!/usr/bin/env bash
# build.sh – Installs Node deps + sets up Python 3.11 via Miniconda for TensorFlow
set -e

echo "==> Installing Node.js dependencies..."
npm install --production

CONDA_DIR="/opt/render/project/src/.conda"
PYTHON_BIN="$CONDA_DIR/bin/python3"

if [ -f "$PYTHON_BIN" ]; then
  echo "==> Miniconda already installed, skipping..."
else
  echo "==> Downloading Miniconda..."
  curl -fsSL https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -o /tmp/miniconda.sh
  bash /tmp/miniconda.sh -b -p "$CONDA_DIR"
  rm /tmp/miniconda.sh
  echo "==> Miniconda installed at $CONDA_DIR"
fi

echo "==> Installing Python packages from requirements.txt..."
"$CONDA_DIR/bin/pip" install --no-cache-dir -r requirements.txt

echo "==> Build complete ✅"
