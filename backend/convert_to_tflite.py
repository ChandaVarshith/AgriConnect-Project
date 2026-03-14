import os
try:
    import tensorflow as tf
except ImportError:
    print("TensorFlow is required to run the conversion script.")
    print("Please install it locally using: pip install tensorflow")
    exit(1)

MODEL_PATH = "plant_disease_recog_model_pwp.keras"
TFLITE_MODEL_PATH = "plant_disease_recog_model_pwp.tflite"

def convert_model():
    if not os.path.exists(MODEL_PATH):
        print(f"ERROR: Could not find '{MODEL_PATH}' in the current directory.")
        print("Please place the .keras file in the same folder before running this script.")
        exit(1)

    print(f"Loading Keras model from {MODEL_PATH}... (This might take a minute)")
    model = tf.keras.models.load_model(MODEL_PATH)

    print("Converting to TFLite format...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    
    # We use default optimizations which will quantize weights to 8-bits automatically
    # This reduces size drastically (e.g. from 200MB to 50MB) and improves prediction speed
    converter.optimizations = [tf.lite.Optimize.DEFAULT]

    tflite_model = converter.convert()

    print(f"Saving TFLite model to {TFLITE_MODEL_PATH}...")
    with open(TFLITE_MODEL_PATH, "wb") as f:
        f.write(tflite_model)

    original_size = os.path.getsize(MODEL_PATH) / (1024 * 1024)
    tflite_size = os.path.getsize(TFLITE_MODEL_PATH) / (1024 * 1024)

    print("\n✅ Conversion Successful!")
    print(f"  Original size: {original_size:.2f} MB")
    print(f"  TFLite size  : {tflite_size:.2f} MB")
    print(f"  Speedup      : Huge reduction in memory and load time!")
    print("\nNext Steps:")
    print(f"  1. Upload {TFLITE_MODEL_PATH} to Google Drive")
    print("  2. Make it 'Anyone with the link can view'")
    print("  3. Copy the File ID and set TFLITE_GDRIVE_FILE_ID on Render")

if __name__ == "__main__":
    convert_model()
