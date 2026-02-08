import os
import pandas as pd
import pickle

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# -----------------------------
# Paths
# -----------------------------
BASE_DIR = os.path.dirname(__file__)
DATASET_PATH = os.path.join(BASE_DIR, "..", "datasets", "breast_cancer.csv")
SAVE_DIR = os.path.join(BASE_DIR, "..", "saved_models")

os.makedirs(SAVE_DIR, exist_ok=True)

MODEL_PATH = os.path.join(SAVE_DIR, "breast_cancer_model.pkl")

# -----------------------------
# Load dataset
# -----------------------------
df = pd.read_csv(DATASET_PATH)

# -----------------------------
# Target handling
# -----------------------------
# If diagnosis is categorical (M / B)
if df["diagnosis"].dtype == object:
    df["diagnosis"] = df["diagnosis"].map({
        "M": 1,  # Malignant → High Risk
        "B": 0   # Benign → Low Risk
    })

# -----------------------------
# Features & Target
# -----------------------------
X = df.drop(columns=["diagnosis"])
y = df["diagnosis"].astype(int)

FEATURE_ORDER = list(X.columns)  # LOCK THIS ORDER

# -----------------------------
# Train-test split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# -----------------------------
# Train Random Forest
# -----------------------------
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,
    min_samples_split=2,
    min_samples_leaf=1,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# -----------------------------
# Save model + feature order
# -----------------------------
pickle.dump(
    {
        "model": model,
        "feature_order": FEATURE_ORDER
    },
    open(MODEL_PATH, "wb")
)

print("✅ Breast Cancer Random Forest model saved successfully")
