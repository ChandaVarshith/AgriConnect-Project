import sys
import os
import json

# ============================================================
# Hardcoded model path — this file (predict.py) lives in the
# same folder as the model file in the backend/ directory.
# We derive the folder from __file__ (reliable even when
# spawned by Node.js) and build the full path explicitly.
# ============================================================
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BACKEND_DIR, "plant_disease_recog_model_pwp.keras")

# Log for debugging (Node.js captures stderr separately)
print(f"[predict.py] BACKEND_DIR = {BACKEND_DIR}", file=sys.stderr)
print(f"[predict.py] MODEL_PATH  = {MODEL_PATH}", file=sys.stderr)
print(f"[predict.py] Model found = {os.path.exists(MODEL_PATH)}", file=sys.stderr)

CLASS_NAMES = [
    'Apple - Apple scab', 'Apple - Black rot', 'Apple - Cedar apple rust', 'Apple - Healthy',
    'Blueberry - Healthy',
    'Cherry - Powdery mildew', 'Cherry - Healthy',
    'Corn - Cercospora leaf spot / Gray leaf spot', 'Corn - Common rust', 'Corn - Northern Leaf Blight', 'Corn - Healthy',
    'Grape - Black rot', 'Grape - Esca (Black Measles)', 'Grape - Leaf blight (Isariopsis)', 'Grape - Healthy',
    'Orange - Haunglongbing (Citrus greening)',
    'Peach - Bacterial spot', 'Peach - Healthy',
    'Pepper bell - Bacterial spot', 'Pepper bell - Healthy',
    'Potato - Early blight', 'Potato - Late blight', 'Potato - Healthy',
    'Raspberry - Healthy',
    'Soybean - Healthy',
    'Squash - Powdery mildew',
    'Strawberry - Leaf scorch', 'Strawberry - Healthy',
    'Tomato - Bacterial spot', 'Tomato - Early blight', 'Tomato - Late blight',
    'Tomato - Leaf Mold', 'Tomato - Septoria leaf spot',
    'Tomato - Spider mites / Two-spotted spider mite',
    'Tomato - Target Spot', 'Tomato - Yellow Leaf Curl Virus', 'Tomato - Mosaic virus', 'Tomato - Healthy',
    'Background (no leaf detected)'
]

def main(image_path):
    if not os.path.exists(MODEL_PATH):
        print(json.dumps({
            "success": False,
            "mocked": True,
            "prediction": "Model file not found",
            "confidence": 0,
            "message": f"Model not found at: {MODEL_PATH}"
        }))
        return

    try:
        os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
        import tensorflow as tf
        import numpy as np

        if not os.path.exists(image_path):
            print(json.dumps({"success": False, "error": f"Image not found: {image_path}"}))
            return

        # Load model
        model = tf.keras.models.load_model(MODEL_PATH)

        # Preprocess image — same as training notebook (160x160)
        img = tf.keras.utils.load_img(image_path, target_size=(160, 160))
        img_array = tf.keras.utils.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0)  # create batch of 1

        predictions = model.predict(img_array, verbose=0)
        scores = predictions[0]

        predicted_idx = int(np.argmax(scores))
        confidence = float(scores[predicted_idx]) * 100

        predicted_class = CLASS_NAMES[predicted_idx] if predicted_idx < len(CLASS_NAMES) else f"Unknown class {predicted_idx}"

        # Determine if healthy or diseased
        is_healthy = 'Healthy' in predicted_class or 'Background' in predicted_class

        print(json.dumps({
            "success": True,
            "prediction": predicted_class,
            "confidence": round(confidence, 2),
            "isHealthy": is_healthy,
            "mocked": False
        }))

    except Exception as e:
        import traceback
        print(json.dumps({
            "success": False,
            "error": str(e),
            "traceback": traceback.format_exc()
        }))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No image path provided."}))
        sys.exit(1)
    main(sys.argv[1])
