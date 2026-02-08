# app.py

from flask import Flask, request, jsonify
import sys
import os

import requests
from io import BytesIO
from PIL import Image

sys.path.append(os.path.join(os.path.dirname(__file__), "predictors"))
from diabetes import predict_diabetes
from predictors.heart_disease import predict_heart_disease
from brainStroke.predict import predict_brain_stroke


app = Flask(__name__)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "ml-service",
        "model": "diabetes-xgboost"
    }), 200


@app.route("/predict/diabetes", methods=["POST"])
def diabetes_prediction():
    try:
        data = request.get_json()

        if not data:
            return jsonify({ "message": "No input data provided" }), 400

        result = predict_diabetes(data)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "message": "Prediction failed",
            "error": str(e)
        }), 500

@app.route("/predict/heart_disease", methods=["POST"])
def heart_disease_prediction():
    try:
        data = request.get_json()

        if not data:
            return jsonify({ "message": "No input data provided" }), 400

        result = predict_heart_disease(data)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "message": "Prediction failed",
            "error": str(e)
        }), 500

@app.route("/predict/breast_cancer", methods=["POST"])
def breast_cancer_prediction():
    try:
        from predictors.breast_cancer import predict_breast_cancer
        data = request.get_json()

        if not data:
            return jsonify({ "message": "No input data provided" }), 400

        result = predict_breast_cancer(data)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "message": "Prediction failed",
            "error": str(e)
        }), 500

@app.route("/predict/brain_stroke", methods=["POST"])
def brain_stroke_prediction():
    try:
        data = request.get_json()

        if not data or "imageUrl" not in data:
            return jsonify({"message": "No imageUrl provided"}), 400

        image_url = data["imageUrl"]

        # Download image from Cloudinary
        response = requests.get(image_url, timeout=5)
        response.raise_for_status()

        # Load image into memory
        image = Image.open(BytesIO(response.content)).convert("RGB")

        # Pass image (or temp path if your model expects path)
        result = predict_brain_stroke(image)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "message": "Prediction failed",
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
