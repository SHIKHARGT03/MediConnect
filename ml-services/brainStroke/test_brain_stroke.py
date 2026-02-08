import os
import sys

# Add the parent directory (ml-services) to sys.path to allow imports if running directly
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

import brainStroke.predict as bs

images = ["ct1.png", "ct2.png", "ct3.png"]

for name in images:
    p = os.path.join(parent_dir, "testImage", name)
    print(f"Testing with image: {p}")
    if not os.path.exists(p):
        print(f"Error: Test image not found at {p}")
    else:
        try:
            img = bs.image.load_img(p, target_size=(224, 224))
            arr = bs.image.img_to_array(img)
            import numpy as np
            arr = np.expand_dims(arr, axis=0)
            arr = bs.preprocess_input(arr)
            preds = bs.model.predict(arr)
            idx = int(np.argmax(preds))
            print({"prediction": bs.index_to_class[idx], "confidence": round(float(np.max(preds)) * 100, 2), "probs": preds[0].tolist()})
        except Exception as e:
            print(f"An error occurred during prediction: {e}")
