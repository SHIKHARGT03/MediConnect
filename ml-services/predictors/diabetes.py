import os
import pickle
import numpy as np
import pandas as pd

# Load model and scaler
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "saved_models", "diabetes_model.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "..", "saved_models", "diabetes_scaler.pkl")

model = pickle.load(open(MODEL_PATH, "rb"))
scaler = pickle.load(open(SCALER_PATH, "rb"))

FEATURE_ORDER = [
    "chol", "stab.glu", "hdl", "ratio", "glyhb", "age", "bp.1s", "bp.1d", "waist", "hip"
]

def predict_diabetes(data):
    # Build a DataFrame with proper column names so scaler keeps feature names
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
        "confidence": prob
    }