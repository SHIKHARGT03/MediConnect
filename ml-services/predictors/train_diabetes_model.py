import os
import pandas as pd
import numpy as np
import pickle
from xgboost import XGBClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# Load dataset
csv_path = os.path.join(os.path.dirname(__file__), "..", "datasets", "diabetes.csv")
df = pd.read_csv(csv_path)

# Select features and target
FEATURE_ORDER = [
    "chol", "stab.glu", "hdl", "ratio", "glyhb", "age", "bp.1s", "bp.1d", "waist", "hip"
]
X = df[FEATURE_ORDER].fillna(0)
# Example target: glyhb > 7 means diabetic (adjust as needed)
y = (df["glyhb"] > 7).astype(int)

# Split and scale
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)

# Train model
model = XGBClassifier()
model.fit(X_train_scaled, y_train)

# Ensure saved_models directory exists
save_dir = os.path.join(os.path.dirname(__file__), "..", "saved_models")
os.makedirs(save_dir, exist_ok=True)

# Save model and scaler
pickle.dump(model, open(os.path.join(save_dir, "diabetes_model.pkl"), "wb"))
pickle.dump(scaler, open(os.path.join(save_dir, "diabetes_scaler.pkl"), "wb"))
print("Model and scaler saved to saved_models!")
