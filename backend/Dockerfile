# Use Python 3.11 slim as base (TensorFlow supports 3.9–3.12)
FROM python:3.11-slim

# ── Install Node.js 20 ────────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── Python dependencies (TensorFlow, NumPy, Pillow) ──────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Node.js dependencies ──────────────────────────────────────────────────────
COPY package*.json ./
RUN npm install --production

# ── Copy rest of backend ──────────────────────────────────────────────────────
COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
