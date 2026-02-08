import tensorflow as tf
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "brain_stroke_efficientnet.h5")

print(f"TensorFlow Version: {tf.__version__}")
try:
    print(f"Keras Version: {tf.keras.__version__}")
except:
    print("Keras version not directly available via tf.keras.__version__")

print(f"Attempting to load model from: {MODEL_PATH}")

try:
    # Try loading with compile=False to see if it bypasses the issue
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print("Successfully loaded model with compile=False")
    print(model.summary())
except Exception as e:
    print(f"Error loading model with compile=False: {e}")

try:
    # Try loading with legacy h5 format explicitly if available/needed
    # or other specific options
    pass
except Exception as e:
    print(e)
