import os
import urllib.request
import zipfile
import tensorflow as tf
import matplotlib.pyplot as plt
import numpy as np

# Suppress TF logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

DATASET_URL = "https://data.mendeley.com/public-files/datasets/tywbtsjrjv/files/b4e3a32f-c0bd-4060-81e9-6144231f2520/file_downloaded"
ZIP_PATH = "dataset.zip"
EXTRACT_DIR = "dataset_raw"
SPLIT_DIR = "dataset"

def download_and_extract():
    if not os.path.exists(ZIP_PATH):
        print("Downloading dataset...")
        urllib.request.urlretrieve(DATASET_URL, ZIP_PATH)
        print("Download complete.")
    
    if not os.path.exists(EXTRACT_DIR):
        print("Extracting dataset...")
        with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
            zip_ref.extractall(EXTRACT_DIR)
        print("Extraction complete.")

    if not os.path.exists(SPLIT_DIR):
        try:
            import splitfolders
            print("Splitting folders...")
            dataset_source = os.path.join(EXTRACT_DIR, "Plant_leave_diseases_dataset_with_augmentation")
            # The download extracts to Plant_leave_diseases_dataset_with_augmentation
            splitfolders.ratio(dataset_source, output=SPLIT_DIR, seed=1337, ratio=(.8, .1, .1))
        except ImportError:
            print("Installing split-folders...")
            os.system("pip install split-folders")
            import splitfolders
            dataset_source = os.path.join(EXTRACT_DIR, "Plant_leave_diseases_dataset_with_augmentation")
            splitfolders.ratio(dataset_source, output=SPLIT_DIR, seed=1337, ratio=(.8, .1, .1))

def train_model():
    print("Setting up datasets...")
    train_dir = os.path.join(SPLIT_DIR, "train")
    validation_dir = os.path.join(SPLIT_DIR, "val")
    test_dir = os.path.join(SPLIT_DIR, "test")

    BATCH_SIZE = 32
    IMG_SIZE = (160, 160)

    train_dataset = tf.keras.utils.image_dataset_from_directory(
        train_dir, shuffle=True, batch_size=BATCH_SIZE, image_size=IMG_SIZE
    )
    validation_dataset = tf.keras.utils.image_dataset_from_directory(
        validation_dir, shuffle=True, batch_size=BATCH_SIZE, image_size=IMG_SIZE
    )
    test_dataset = tf.keras.utils.image_dataset_from_directory(
        test_dir, batch_size=BATCH_SIZE, image_size=IMG_SIZE
    )

    class_names = train_dataset.class_names
    print(f"Classes: {class_names}")

    AUTOTUNE = tf.data.AUTOTUNE
    train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
    validation_dataset = validation_dataset.prefetch(buffer_size=AUTOTUNE)
    test_dataset = test_dataset.prefetch(buffer_size=AUTOTUNE)

    preprocess_input = tf.keras.applications.efficientnet.preprocess_input
    IMG_SHAPE = IMG_SIZE + (3,)
    base_model = tf.keras.applications.EfficientNetB4(
        input_shape=IMG_SHAPE, include_top=False, weights='imagenet'
    )
    base_model.trainable = False

    global_average_layer = tf.keras.layers.GlobalAveragePooling2D()
    prediction_layer = tf.keras.layers.Dense(len(class_names), activation='sigmoid')

    inputs = tf.keras.Input(shape=(160, 160, 3))
    x = preprocess_input(inputs)
    x = base_model(x, training=False)
    x = global_average_layer(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    outputs = prediction_layer(x)
    model = tf.keras.Model(inputs, outputs)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(),
        loss=tf.keras.losses.SparseCategoricalCrossentropy(),
        metrics=[tf.keras.metrics.SparseCategoricalAccuracy(name='accuracy')]
    )

    initial_epochs = 6
    print("Evaluating initial model...")
    loss0, accuracy0 = model.evaluate(validation_dataset)
    print("initial loss: {:.2f}".format(loss0))
    print("initial accuracy: {:.2f}".format(accuracy0))

    print("Training base model...")
    history = model.fit(train_dataset, epochs=initial_epochs, validation_data=validation_dataset)

    # Fine tuning
    base_model.trainable = True
    fine_tune_at = 100
    for layer in base_model.layers[:fine_tune_at]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-5),
        loss=tf.keras.losses.SparseCategoricalCrossentropy(),
        metrics=[tf.keras.metrics.SparseCategoricalAccuracy(name='accuracy')]
    )

    fine_tune_epochs = 10
    total_epochs = initial_epochs + fine_tune_epochs

    print("Fine tuning model...")
    history_fine = model.fit(
        train_dataset,
        epochs=total_epochs,
        initial_epoch=history.epoch[-1],
        validation_data=validation_dataset
    )

    loss, accuracy = model.evaluate(test_dataset)
    print('Test accuracy :', accuracy)

    # Save to backend
    save_path = os.path.join("backend", "plant_disease_recog_model_pwp.keras")
    print(f"Saving model to {save_path}...")
    model.save(save_path)
    print("Done!")

if __name__ == "__main__":
    download_and_extract()
    train_model()
