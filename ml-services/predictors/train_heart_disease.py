import os
import pandas as pd
import numpy as np
import pickle

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

# -----------------------------
# Paths
# -----------------------------
BASE_DIR = os.path.dirname(__file__)
DATASET_PATH = os.path.join(BASE_DIR, "..", "datasets", "heart_failure_clinical_records_dataset.csv")
SAVE_DIR = os.path.join(BASE_DIR, "..", "saved_models")

os.makedirs(SAVE_DIR, exist_ok=True)

MODEL_PATH = os.path.join(SAVE_DIR, "heart_disease_model.pkl")
SCALER_PATH = os.path.join(SAVE_DIR, "heart_disease_scaler.pkl")

# -----------------------------
# Load dataset
# -----------------------------
df = pd.read_csv(DATASET_PATH)

# -----------------------------
# Feature order (LOCKED)
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

X = df[FEATURE_ORDER].fillna(0)
y = df["target"].astype(int)

# -----------------------------
# Train-test split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# -----------------------------
# Scaling (MANDATORY for SVM)
# -----------------------------
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)

# -----------------------------
# Train SVM
# -----------------------------
model = SVC(
    kernel="rbf",
    probability=True,
    class_weight="balanced",
    random_state=42,
)

model.fit(X_train_scaled, y_train)

# -----------------------------
# Save model & scaler
# -----------------------------
pickle.dump(model, open(MODEL_PATH, "wb"))
pickle.dump(scaler, open(SCALER_PATH, "wb"))

print("✅ Heart Disease SVM model & scaler saved successfully")
