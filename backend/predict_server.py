"""
predict_server.py
A lightweight HTTP server that loads the TensorFlow model ONCE at startup
and serves predictions via HTTP. This avoids the 30-60s cold-start delay
of spawning a new Python process + importing TF + loading the model
for every single request.
"""

import os
import sys
import json
from http.server import HTTPServer, BaseHTTPRequestHandler

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# ── Model Path ────────────────────────────────────────────────────────────────
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH  = os.path.join(BACKEND_DIR, "plant_disease_recog_model_pwp.keras")
PORT = int(os.environ.get("PREDICT_SERVER_PORT", 5050))

# ── PlantVillage 39-class labels ──────────────────────────────────────────────
CLASS_NAMES = [
    'Apple - Apple Scab',
    'Apple - Black Rot',
    'Apple - Cedar Apple Rust',
    'Apple - Healthy',
    'Background (No Leaf Detected)',
    'Blueberry - Healthy',
    'Cherry - Powdery Mildew',
    'Cherry - Healthy',
    'Corn - Cercospora / Gray Leaf Spot',
    'Corn - Common Rust',
    'Corn - Northern Leaf Blight',
    'Corn - Healthy',
    'Grape - Black Rot',
    'Grape - Esca (Black Measles)',
    'Grape - Isariopsis Leaf Spot',
    'Grape - Healthy',
    'Orange - Haunglongbing (Citrus Greening)',
    'Peach - Bacterial Spot',
    'Peach - Healthy',
    'Pepper Bell - Bacterial Spot',
    'Pepper Bell - Healthy',
    'Potato - Early Blight',
    'Potato - Late Blight',
    'Potato - Healthy',
    'Raspberry - Healthy',
    'Soybean - Healthy',
    'Squash - Powdery Mildew',
    'Strawberry - Leaf Scorch',
    'Strawberry - Healthy',
    'Tomato - Bacterial Spot',
    'Tomato - Early Blight',
    'Tomato - Late Blight',
    'Tomato - Leaf Mold',
    'Tomato - Septoria Leaf Spot',
    'Tomato - Spider Mites',
    'Tomato - Target Spot',
    'Tomato - Yellow Leaf Curl Virus',
    'Tomato - Mosaic Virus',
    'Tomato - Healthy',
]

HEALTHY_KEYWORDS = ('healthy', 'background')

def is_healthy(name):
    return any(k in name.lower() for k in HEALTHY_KEYWORDS)


# ── Load model in background ──────────────────────────────────────────────────
import threading

model = None
tf = None
np = None
model_status = 'loading' # 'loading', 'ready', 'error'
model_error_msg = ''

def load_model_background():
    global model, tf, np, model_status, model_error_msg
    if not os.path.exists(MODEL_PATH):
        print(f"[predict_server] ⚠ Model not found at {MODEL_PATH}", flush=True)
        model_status = 'error'
        model_error_msg = 'Model file missing'
        return
    
    try:
        print(f"[predict_server] Loading TensorFlow in background...", flush=True)
        import tensorflow as _tf
        import numpy as _np
        global tf, np
        tf = _tf
        np = _np
        print(f"[predict_server] Loading model from {MODEL_PATH}...", flush=True)
        model = tf.keras.models.load_model(MODEL_PATH)
        # Warm up with a dummy prediction
        dummy = np.zeros((1, 160, 160, 3), dtype=np.float32)
        model.predict(dummy, verbose=0)
        print(f"[predict_server] ✅ Model loaded and warmed up!", flush=True)
        model_status = 'ready'
    except Exception as exc:
        import traceback
        traceback.print_exc()
        model_status = 'error'
        model_error_msg = str(exc)
        print(f"[predict_server] ❌ Error loading model: {exc}", flush=True)


def predict(image_path):
    """Run prediction on a single image. Returns dict."""
    if model_status == 'loading':
        return {"success": False, "error": "AI Model is starting up (takes ~60s on Render free tier). Please wait a moment and click Analyze again."}
    if model_status == 'error':
        return {"success": False, "error": f"Model failed to load: {model_error_msg}"}
    if model is None:
        return {"success": False, "error": "Model not loaded"}
    if not os.path.exists(image_path):
        return {"success": False, "error": f"Image not found: {image_path}"}

    try:
        img   = tf.keras.utils.load_img(image_path, target_size=(160, 160))
        arr   = tf.keras.utils.img_to_array(img)
        arr   = tf.keras.applications.efficientnet.preprocess_input(arr)
        batch = np.expand_dims(arr, axis=0)

        preds = model.predict(batch, verbose=0)[0]

        predicted_idx  = int(np.argmax(preds))
        confidence_raw = float(preds[predicted_idx])
        confidence_pct = round(confidence_raw * 100, 2)

        class_name = (
            CLASS_NAMES[predicted_idx]
            if predicted_idx < len(CLASS_NAMES)
            else f"Unknown class #{predicted_idx}"
        )

        healthy = is_healthy(class_name)

        if 'background' in class_name.lower():
            display = "No Crop Leaf Detected in Image"
            healthy = True
        elif healthy:
            display = "No Disease Detected — Crop is Healthy"
        else:
            display = class_name

        return {
            "success":    True,
            "prediction": display,
            "rawClass":   class_name,
            "confidence": confidence_pct,
            "isHealthy":  healthy,
            "mocked":     False,
        }
    except Exception as exc:
        import traceback
        return {"success": False, "error": str(exc), "traceback": traceback.format_exc()}


# ── HTTP Handler ──────────────────────────────────────────────────────────────
class PredictHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/predict':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            try:
                data = json.loads(body)
                image_path = data.get('image_path', '')
            except:
                image_path = ''

            result = predict(image_path)
            
            # If the model is busy loading, we can return 503 so the frontend knows it was not a fatal prediction error,
            # or just 200 with success=False. Since our Node.js expects 200 with success: False, we keep it simple:
            status_code = 503 if result.get('error', '').startswith('AI Model is starting') else 200
            
            response = json.dumps(result).encode()
            self.send_response(status_code)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', len(response))
            self.end_headers()
            self.wfile.write(response)
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        if self.path == '/health':
            result = json.dumps({"status": "ok", "model_status": model_status}).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(result)
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # Suppress default logging to avoid noise
        pass


if __name__ == '__main__':
    print(f"[predict_server] Starting prediction server on port {PORT}...", flush=True)
    
    # Start loading model in background thread
    threading.Thread(target=load_model_background, daemon=True).start()

    from http.server import ThreadingHTTPServer
    server = ThreadingHTTPServer(('127.0.0.1', PORT), PredictHandler)
    print(f"[predict_server] ✅ Prediction server running on http://127.0.0.1:{PORT} (Model loading in background)", flush=True)
    server.serve_forever()
