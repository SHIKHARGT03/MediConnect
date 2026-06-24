import tensorflow as tf
import json
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input
import os
import h5py

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


def _find_dataset_by_weight_name(group, weight_name, expected_shape):
    if weight_name in group and hasattr(group[weight_name], "shape"):
        dataset = group[weight_name]
        if tuple(dataset.shape) == tuple(expected_shape):
            return dataset

    found = None

    def visitor(name, obj):
        nonlocal found
        if found is not None or not hasattr(obj, "shape"):
            return
        if name.split("/")[-1] == weight_name and tuple(obj.shape) == tuple(expected_shape):
            found = obj

    group.visititems(visitor)
    return found


def _find_saved_layer_group(saved_base_group, layer_name):
    if layer_name in saved_base_group:
        return saved_base_group[layer_name]

    # Keras may assign normalization vs normalization_1 depending on what was
    # constructed earlier in the process. There is only one normalization layer.
    if layer_name.startswith("normalization"):
        for saved_name in saved_base_group.keys():
            if saved_name.startswith("normalization"):
                return saved_base_group[saved_name]

    return None


def load_legacy_h5_weights_exact(model, model_path):
    assigned = 0
    skipped = []

    with h5py.File(model_path, "r") as h5:
        model_weights = h5["model_weights"]
        saved_base_group = model_weights["efficientnetb0"]

        for layer in model.layers:
            if not layer.weights:
                continue

            if layer.name in ("dense_2", "dense_3"):
                saved_group = model_weights.get(layer.name)
            else:
                saved_group = _find_saved_layer_group(saved_base_group, layer.name)

            if saved_group is None:
                skipped.append(f"{layer.name}: no saved group")
                continue

            for weight in layer.weights:
                weight_name = weight.name.split("/")[-1].split(":")[0]
                dataset = _find_dataset_by_weight_name(
                    saved_group,
                    weight_name,
                    tuple(weight.shape),
                )

                if dataset is None:
                    skipped.append(f"{layer.name}/{weight_name}: no matching dataset")
                    continue

                weight.assign(np.array(dataset))
                assigned += 1

    print(f"Loaded {assigned} exact weight tensors from legacy H5.")
    if skipped:
        print(f"Skipped {len(skipped)} weight tensors while loading legacy H5.")
        for item in skipped[:10]:
            print(f"  - {item}")
    if assigned < 300:
        raise RuntimeError(
            f"Only loaded {assigned} tensors from {model_path}; expected EfficientNetB0 backbone plus dense head."
        )

# Lazy-loaded model
model = None

def get_model():
    global model

    if model is not None:
        return model

    print(f"Loading model from {MODEL_PATH}...")

    try:
        model = tf.keras.models.load_model(
            MODEL_PATH,
            compile=False
        )

        print("Model loaded successfully with load_model.")

    except Exception as e:

        print(
            f"Warning: load_model failed ({e}). "
            "Attempting manual reconstruction and weight loading."
        )

        model = build_manual_model("EfficientNetB0")

        load_legacy_h5_weights_exact(
            model,
            MODEL_PATH
        )

        print(
            "Model weights loaded successfully into manually "
            "reconstructed EfficientNetB0."
        )

    return model

# --- Class Mapping ---
try:
    with open(CLASS_MAP_PATH) as f:
        class_map = json.load(f)
    index_to_class = {v: k for k, v in class_map.items()}
    print(f"Brain stroke class mapping: {index_to_class}")
except Exception as e:
    print(f"Error loading class map: {e}")
    index_to_class = {0: "Normal", 1: "Ischemia", 2: "Bleeding"} # Fallback

# --- Prediction Function ---
def predict_brain_stroke(img):
    # If img is a PIL Image (from app.py), use it directly
    model = get_model()
    
    if hasattr(img, 'size'):
        img = img.resize((224, 224))
        img = image.img_to_array(img)
    else:
        # If img is a path (from test scripts), load it
        img = image.load_img(img, target_size=(224, 224))
        img = image.img_to_array(img)
    
    img = np.expand_dims(img, axis=0)
    img = preprocess_input(img) # EfficientNet specific preprocessing

    preds = model.predict(img, verbose=0)

    idx = int(np.argmax(preds))
    confidence = float(np.max(preds))
    raw_outputs = preds[0].astype(float).tolist()

    print(f"Brain stroke raw outputs: {raw_outputs}")
    print(f"Brain stroke argmax class: {idx} ({index_to_class.get(idx, 'Unknown')})")
    print(f"Brain stroke confidence: {confidence * 100:.4f}%")

    return {
        "prediction": index_to_class.get(idx, "Unknown"),
        "confidence": round(confidence * 100, 2),
        "rawOutputs": raw_outputs,
        "argmaxClass": idx,
        "classMapping": index_to_class,
    }
