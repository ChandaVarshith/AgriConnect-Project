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

# ── Download ML model from Google Drive using gdown ──────────────────────────
MODEL_FILE="plant_disease_recog_model_pwp.keras"
if [ -f "$MODEL_FILE" ]; then
  echo "==> Model already exists, skipping download..."
else
  if [ -n "$MODEL_GDRIVE_FILE_ID" ]; then
    echo "==> Downloading ML model from Google Drive (file ID: $MODEL_GDRIVE_FILE_ID)..."
    "$CONDA_DIR/bin/gdown" "https://drive.google.com/uc?id=$MODEL_GDRIVE_FILE_ID" -O "$MODEL_FILE"
    echo "==> Model downloaded: $(ls -lh $MODEL_FILE | awk '{print $5}')"
  else
    echo "==> WARNING: MODEL_GDRIVE_FILE_ID not set, skipping model download"
  fi
fi

echo "==> Build complete ✅"
