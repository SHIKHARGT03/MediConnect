import os
import pickle
import numpy as np

# -----------------------------
# Paths
# -----------------------------
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(
    BASE_DIR, "..", "saved_models", "breast_cancer_model.pkl"
)

def _load_bundle():
    if not os.path.exists(MODEL_PATH):
        try:
            import train_breast_cancer
        except Exception as e:
            raise RuntimeError(str(e))
    return pickle.load(open(MODEL_PATH, "rb"))

_bundle = _load_bundle()
model = _bundle["model"]
FEATURE_ORDER = _bundle["feature_order"]

# -----------------------------
# Prediction function
# -----------------------------
def predict_breast_cancer(data):
    features = [data.get(feat, 0) for feat in FEATURE_ORDER]
    features = np.array(features).reshape(1, -1)

    pred = model.predict(features)[0]
    prob = float(model.predict_proba(features)[0][pred])

    return {
        "prediction": int(pred),
        "confidence": prob
    }
