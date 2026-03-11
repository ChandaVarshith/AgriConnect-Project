import sys
import os
import json

def get_class_names():
    # Common 38 classes (PlantVillage) + 1 background class from the dataset typically used
    return [
       'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
       'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
       'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy',
       'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
       'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
       'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
       'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
       'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
       'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy',
       'Background_without_leaves'
    ]

def main(image_path):
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "plant_disease_recog_model_pwp.keras")
    
    if not os.path.exists(model_path):
        # Mock prediction if model is not yet placed
        import random
        classes = get_class_names()
        prediction = random.choice([c for c in classes if c != 'Background_without_leaves'])
        
        # Clean up the name for display
        display_name = prediction.replace('___', ' - ').replace('_', ' ')
        
        print(json.dumps({
            "success": True, 
            "prediction": display_name, 
            "confidence": round(random.uniform(75.0, 99.9), 2),
            "mocked": True,
            "message": "Model not found. Showing mock result."
        }))
        return

    try:
        # Suppress TF logs
        os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
        import tensorflow as tf
        import numpy as np
        
        # Load model
        model = tf.keras.models.load_model(model_path)
        
        # Preprocess image
        # The model expects (160, 160, 3) image
        img = tf.keras.utils.load_img(image_path, target_size=(160, 160))
        img_array = tf.keras.utils.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0) # Create a batch
        
        predictions = model.predict(img_array, verbose=0)
        
        # Since prediction_layer used 'sigmoid', let's just find the max probability
        score = predictions[0]
        class_names = get_class_names()
        
        predicted_idx = np.argmax(score)
        predicted_class = class_names[predicted_idx]
        confidence = 100 * score[predicted_idx]
        
        display_name = predicted_class.replace('___', ' - ').replace('_', ' ')
        
        print(json.dumps({
            "success": True, 
            "prediction": display_name,
            "confidence": float(round(confidence, 2)),
            "mocked": False
        }))
        
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No image path provided."}))
        sys.exit(1)
    
    main(sys.argv[1])
