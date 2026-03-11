import os

# Suppress warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import tensorflow as tf

def generate_model():
    print("Initializing EfficientNetB4 architecture...")
    IMG_SHAPE = (160, 160, 3)
    base_model = tf.keras.applications.EfficientNetB4(
        input_shape=IMG_SHAPE,
        include_top=False,
        weights='imagenet',
    )
    base_model.trainable = False

    global_average_layer = tf.keras.layers.GlobalAveragePooling2D()
    prediction_layer = tf.keras.layers.Dense(39, activation='sigmoid') # 39 classes

    inputs = tf.keras.Input(shape=(160, 160, 3))
    x = tf.keras.applications.efficientnet.preprocess_input(inputs)
    x = base_model(x, training=False)
    x = global_average_layer(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    outputs = prediction_layer(x)
    model = tf.keras.Model(inputs, outputs)

    model.compile(optimizer=tf.keras.optimizers.Adam(),
                  loss=tf.keras.losses.SparseCategoricalCrossentropy(),
                  metrics=[tf.keras.metrics.SparseCategoricalAccuracy(name='accuracy')])

    # Save to backend
    save_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend", "plant_disease_recog_model_pwp.keras")
    print(f"Saving initialized model to {save_path}...")
    model.save(save_path)
    print("Model saved successfully!")

if __name__ == "__main__":
    generate_model()
