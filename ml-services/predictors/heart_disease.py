import os
import pickle
import numpy as np
import pandas as pd
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler

# -----------------------------
# Paths
# -----------------------------
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "..", "saved_models", "heart_disease_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "..", "saved_models", "heart_disease_scaler.pkl")
DATASET_PATH = os.path.join(BASE_DIR, "..", "datasets", "heart_failure_clinical_records_dataset.csv")

# -----------------------------
# Feature order (MUST MATCH TRAINING)
# -----------------------------
FEATURE_ORDER = [
    "age",
    "sex",
    "cp",
    "trestbps",
    "chol",
    "fbs",
    "restecg",
    "thalach",
    "exang",
    "oldpeak",
    "slope",
    "ca",
    "thal",
]


def train_and_save_model():
    # Train an SVM with probability estimates and save model + scaler
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Training dataset not found at {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)

    X = df[FEATURE_ORDER].fillna(0)
    y = df["target"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = SVC(probability=True)
    model.fit(X_scaled, y)

    save_dir = os.path.dirname(MODEL_PATH)
    os.makedirs(save_dir, exist_ok=True)

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    with open(SCALER_PATH, "wb") as f:
        pickle.dump(scaler, f)

    return model, scaler


# -----------------------------
# Load model & scaler (lazy load/train on first prediction)
# -----------------------------
# We'll defer heavy training/load until a request arrives so the Flask
# app can start quickly. `load_model_if_needed()` will populate the
# module-level `model` and `scaler` variables.
model = None
scaler = None


def load_model_if_needed():
    global model, scaler
    if model is not None and scaler is not None:
        return

    # Try to load from disk first
    try:
        model = pickle.load(open(MODEL_PATH, "rb"))
        scaler = pickle.load(open(SCALER_PATH, "rb"))
        return
    except Exception:
        # If loading fails, attempt to train and save a model
        model, scaler = train_and_save_model()



# -----------------------------
# Prediction function
# -----------------------------
def predict_heart_disease(data):
    # Ensure model and scaler are available (loads or trains if needed)
    load_model_if_needed()

    # Build a DataFrame with column names so scaler doesn't warn
    import pandas as pd

    row = {feat: data.get(feat, 0) for feat in FEATURE_ORDER}
    features_df = pd.DataFrame([row], columns=FEATURE_ORDER)

    # Scale
    features_scaled = scaler.transform(features_df)

    # Predict
    pred = int(model.predict(features_scaled)[0])
    prob_arr = model.predict_proba(features_scaled)[0]
    try:
        prob = float(prob_arr[pred])
    except Exception:
        prob = float(np.max(prob_arr))

    return {
        "prediction": pred,
        "confidence": prob,
    }
