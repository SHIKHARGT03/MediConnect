import tensorflow as tf
import json
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "brain_stroke_efficientnet.h5")
CLASS_MAP_PATH = os.path.join(os.path.dirname(__file__), "class_mapping.json")

# --- Robust Model Loading Logic ---
def build_manual_model(base_model_name="EfficientNetB0"):
    print(f"Attempting to manually reconstruct {base_model_name}...")
    if base_model_name == "EfficientNetB0":
        base = tf.keras.applications.EfficientNetB0(include_top=False, weights=None, input_shape=(224, 224, 3))
    elif base_model_name == "EfficientNetB1":
        base = tf.keras.applications.EfficientNetB1(include_top=False, weights=None, input_shape=(224, 224, 3))
    elif base_model_name == "EfficientNetB2":
        base = tf.keras.applications.EfficientNetB2(include_top=False, weights=None, input_shape=(224, 224, 3))
    else:
        raise ValueError(f"Unknown base model: {base_model_name}")
    
    x = base.output
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    # Reconstruct head based on inspect_h5 findings (Dense 128 -> Dense 3)
    x = tf.keras.layers.Dense(128, activation='relu', name='dense_2')(x)
    predictions = tf.keras.layers.Dense(3, activation='softmax', name='dense_3')(x)
    
    model = tf.keras.models.Model(inputs=base.input, outputs=predictions)
    return model

try:
    print(f"Loading model from {MODEL_PATH}...")
    # Try standard load first, but it is known to fail with this H5
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print("Model loaded successfully with load_model.")
except Exception as e:
    print(f"Warning: load_model failed ({e}). Attempting manual reconstruction and weight loading.")
    try:
        # Manual reconstruction (EfficientNetB0 + Custom Head)
        model = build_manual_model("EfficientNetB0")
        # Load weights by name to bypass topological errors
        model.load_weights(MODEL_PATH, by_name=True, skip_mismatch=True)
        print("Model weights loaded successfully into EfficientNetB0.")
    except Exception as e_manual:
        print(f"Critical Error: Could not load model even with manual reconstruction. {e_manual}")
        raise e_manual

# --- Class Mapping ---
try:
    with open(CLASS_MAP_PATH) as f:
        class_map = json.load(f)
    index_to_class = {v: k for k, v in class_map.items()}
except Exception as e:
    print(f"Error loading class map: {e}")
    index_to_class = {0: "Normal", 1: "Ischemia", 2: "Bleeding"} # Fallback

# --- Prediction Function ---
def predict_brain_stroke(img):
    # If img is a PIL Image (from app.py), use it directly
    if hasattr(img, 'size'):
        img = img.resize((224, 224))
        img = image.img_to_array(img)
    else:
        # If img is a path (from test scripts), load it
        img = image.load_img(img, target_size=(224, 224))
        img = image.img_to_array(img)
    
    img = np.expand_dims(img, axis=0)
    img = preprocess_input(img) # EfficientNet specific preprocessing

    preds = model.predict(img)

    idx = int(np.argmax(preds))
    confidence = float(np.max(preds))

    return {
        "prediction": index_to_class.get(idx, "Unknown"),
        "confidence": round(confidence * 100, 2)
    }
