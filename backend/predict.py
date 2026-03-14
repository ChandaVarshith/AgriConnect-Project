import sys
import os
import json

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# ── Model Path ────────────────────────────────────────────────────────────────
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH  = os.path.join(BACKEND_DIR, "plant_disease_recog_model_pwp.tflite")

sys.stderr.write(f"[predict.py] MODEL_PATH  : {MODEL_PATH}\n")
sys.stderr.write(f"[predict.py] Model exists: {os.path.exists(MODEL_PATH)}\n")

# ── PlantVillage 39-class labels (EXACT alphabetical folder order from dataset) ─
# Index order MUST match what flow_from_directory / sorted(os.listdir) produces (alphabetical).
CLASS_NAMES = [
    'Apple - Apple Scab',                          # 0  Apple___Apple_scab
    'Apple - Black Rot',                           # 1  Apple___Black_rot
    'Apple - Cedar Apple Rust',                    # 2  Apple___Cedar_apple_rust
    'Apple - Healthy',                             # 3  Apple___healthy
    'Background (No Leaf Detected)',               # 4  Background_without_leaves
    'Blueberry - Healthy',                         # 5  Blueberry___healthy
    'Cherry - Powdery Mildew',                     # 6  Cherry___Powdery_mildew
    'Cherry - Healthy',                            # 7  Cherry___healthy
    'Corn - Cercospora / Gray Leaf Spot',          # 8  Corn___Cercospora_leaf_spot Gray_leaf_spot
    'Corn - Common Rust',                          # 9  Corn___Common_rust
    'Corn - Northern Leaf Blight',                 # 10 Corn___Northern_Leaf_Blight
    'Corn - Healthy',                              # 11 Corn___healthy
    'Grape - Black Rot',                           # 12 Grape___Black_rot
    'Grape - Esca (Black Measles)',                # 13 Grape___Esca_(Black_Measles)
    'Grape - Isariopsis Leaf Spot',                # 14 Grape___Leaf_blight_(Isariopsis_Leaf_Spot)
    'Grape - Healthy',                             # 15 Grape___healthy
    'Orange - Haunglongbing (Citrus Greening)',    # 16 Orange___Haunglongbing_(Citrus_greening)
    'Peach - Bacterial Spot',                      # 17 Peach___Bacterial_spot
    'Peach - Healthy',                             # 18 Peach___healthy
    'Pepper Bell - Bacterial Spot',                # 19 Pepper,_bell___Bacterial_spot
    'Pepper Bell - Healthy',                       # 20 Pepper,_bell___healthy
    'Potato - Early Blight',                       # 21 Potato___Early_blight
    'Potato - Late Blight',                        # 22 Potato___Late_blight
    'Potato - Healthy',                            # 23 Potato___healthy
    'Raspberry - Healthy',                         # 24 Raspberry___healthy
    'Soybean - Healthy',                           # 25 Soybean___healthy
    'Squash - Powdery Mildew',                     # 26 Squash___Powdery_mildew
    'Strawberry - Leaf Scorch',                    # 27 Strawberry___Leaf_scorch
    'Strawberry - Healthy',                        # 28 Strawberry___healthy
    'Tomato - Bacterial Spot',                     # 29 Tomato___Bacterial_spot
    'Tomato - Early Blight',                       # 30 Tomato___Early_blight
    'Tomato - Late Blight',                        # 31 Tomato___Late_blight
    'Tomato - Leaf Mold',                          # 32 Tomato___Leaf_Mold
    'Tomato - Septoria Leaf Spot',                 # 33 Tomato___Septoria_leaf_spot
    'Tomato - Spider Mites',                       # 34 Tomato___Spider_mites Two-spotted_spider_mite
    'Tomato - Target Spot',                        # 35 Tomato___Target_Spot
    'Tomato - Yellow Leaf Curl Virus',             # 36 Tomato___Tomato_Yellow_Leaf_Curl_Virus
    'Tomato - Mosaic Virus',                       # 37 Tomato___Tomato_mosaic_virus
    'Tomato - Healthy',                            # 38 Tomato___healthy
]

HEALTHY_KEYWORDS = ('healthy', 'background')


def is_healthy(name: str) -> bool:
    return any(k in name.lower() for k in HEALTHY_KEYWORDS)


def main(image_path: str):
    # ── Guard: model must exist ───────────────────────────────────────────────
    if not os.path.exists(MODEL_PATH):
        sys.stdout.write(json.dumps({
            "success": False,
            "error": f"Trained model not found at: {MODEL_PATH}"
        }))
        sys.exit(1)

    # ── Guard: image must exist ───────────────────────────────────────────────
    if not os.path.exists(image_path):
        sys.stdout.write(json.dumps({
            "success": False,
            "error": f"Image not found: {image_path}"
        }))
        sys.exit(1)

    try:
        import numpy as np
        from PIL import Image
        import tensorflow.lite as tflite

        # Load TFLite model and allocate tensors
        interpreter = tflite.Interpreter(model_path=MODEL_PATH)
        interpreter.allocate_tensors()

        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()

        # Load and prep image using PIL
        img = Image.open(image_path).convert('RGB')
        
        # Determine input shape from the model, usually [1, 160, 160, 3]
        input_shape = input_details[0]['shape']
        target_size = (input_shape[1], input_shape[2]) if len(input_shape) == 4 else (160, 160)
        
        img = img.resize(target_size)
        
        input_dtype = input_details[0]['dtype']
        arr = np.array(img, dtype=input_dtype)

        # Add batch dimension
        batch = np.expand_dims(arr, axis=0)

        # Set tensor and invoke
        interpreter.set_tensor(input_details[0]['index'], batch)
        interpreter.invoke()

        # Run inference
        preds = interpreter.get_tensor(output_details[0]['index'])[0]

        predicted_idx  = int(np.argmax(preds))
        confidence_raw = float(preds[predicted_idx])
        confidence_pct = round(confidence_raw * 100, 2)

        class_name = (
            CLASS_NAMES[predicted_idx]
            if predicted_idx < len(CLASS_NAMES)
            else f"Unknown class #{predicted_idx}"
        )

        healthy = is_healthy(class_name)

        # Friendly prediction label
        if 'background' in class_name.lower():
            display = "No Crop Leaf Detected in Image"
            healthy = True
        elif healthy:
            display = "No Disease Detected — Crop is Healthy"
        else:
            display = class_name

        sys.stdout.write(json.dumps({
            "success":    True,
            "prediction": display,
            "rawClass":   class_name,
            "confidence": confidence_pct,
            "isHealthy":  healthy,
            "mocked":     False
        }))

    except Exception as exc:
        import traceback
        sys.stdout.write(json.dumps({
            "success":   False,
            "error":     str(exc),
            "traceback": traceback.format_exc()
        }))
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.stdout.write(json.dumps({"success": False, "error": "Usage: predict.py <image_path>"}))
        sys.exit(1)
    main(sys.argv[1])
