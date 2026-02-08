import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "brain_stroke_efficientnet.h5")
CLASS_MAP_PATH = os.path.join(BASE_DIR, "class_mapping.json")
TEST_IMAGE_PATH = os.path.join(os.path.dirname(os.path.dirname(BASE_DIR)), "ml-services", "testImage", "ct1.png")
# Using previous logic for test image path: parent of ml-services/brainStroke is ml-services. 
# so parent_dir = ml-services.
# then join(parent_dir, testImage, ct1.png)

print(f"Base Dir: {BASE_DIR}")
print(f"Model Path: {MODEL_PATH}")
print(f"Exists: {os.path.exists(MODEL_PATH)}")
print(f"Class Map Path: {CLASS_MAP_PATH}")
print(f"Exists: {os.path.exists(CLASS_MAP_PATH)}")

# Reconstruct test image path as per test_brain_stroke.py logic
current_dir = BASE_DIR
parent_dir = os.path.dirname(current_dir) # ml-services
TEST_IMAGE_PATH_2 = os.path.join(parent_dir, "testImage", "ct1.png")
print(f"Test Image Path: {TEST_IMAGE_PATH_2}")
print(f"Exists: {os.path.exists(TEST_IMAGE_PATH_2)}")
