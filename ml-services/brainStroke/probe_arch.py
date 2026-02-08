import tensorflow as tf
import os
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "brain_stroke_efficientnet.h5")

def build_and_load(base_model_name):
    print(f"\n--- Testing {base_model_name} ---")
    try:
        if base_model_name == "EfficientNetB0":
            base = tf.keras.applications.EfficientNetB0(include_top=False, weights=None, input_shape=(224, 224, 3))
        elif base_model_name == "EfficientNetB1":
            base = tf.keras.applications.EfficientNetB1(include_top=False, weights=None, input_shape=(224, 224, 3))
        elif base_model_name == "EfficientNetB2":
            base = tf.keras.applications.EfficientNetB2(include_top=False, weights=None, input_shape=(224, 224, 3))
        elif base_model_name == "EfficientNetV2B0":
            base = tf.keras.applications.EfficientNetV2B0(include_top=False, weights=None, input_shape=(224, 224, 3))
        elif base_model_name == "EfficientNetV2S":
             base = tf.keras.applications.EfficientNetV2S(include_top=False, weights=None, input_shape=(224, 224, 3))
        
        # Construct a likely head
        x = base.output
        x = tf.keras.layers.GlobalAveragePooling2D()(x)
        # Try finding the output layer size from the class mapping (3 classes: Normal, Ischemia, Bleeding)
        predictions = tf.keras.layers.Dense(3, activation='softmax')(x)
        
        model = tf.keras.models.Model(inputs=base.input, outputs=predictions)
        
        try:
            model.load_weights(MODEL_PATH, by_name=True, skip_mismatch=False)
            print(f"SUCCESS: Loaded weights into {base_model_name} (exact match or compatible)")
            return True
        except ValueError as e:
             print(f"Mismatch for {base_model_name}:")
             # Print just the first few lines of error to keep it clean
             print(str(e)[:500] + "...")
             return False
        except Exception as e:
            print(f"Error loading into {base_model_name}: {e}")
            return False

    except Exception as e:
        print(f"Error building {base_model_name}: {e}")
        return False

models_to_test = ["EfficientNetB0", "EfficientNetB1", "EfficientNetB2", "EfficientNetV2B0"]

for m in models_to_test:
    if build_and_load(m):
        break
