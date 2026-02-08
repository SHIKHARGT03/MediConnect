import h5py
import json
import os

model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "brain_stroke_efficientnet.h5")

try:
    with h5py.File(model_path, 'r') as f:
        if 'model_config' in f.attrs:
            config_str = f.attrs['model_config']
            if isinstance(config_str, bytes):
                config_str = config_str.decode('utf-8')
            print("MODEL_CONFIG_JSON_START")
            print(config_str)
            print("MODEL_CONFIG_JSON_END")
        else:
            print("No model_config found in attributes.")
        def has_layer(g, name):
            if name in g.keys():
                return True
            for k in g.keys():
                item = g[k]
                if isinstance(item, h5py.Group):
                    if has_layer(item, name):
                        return True
            return False
        if 'model_weights' in f.keys():
            print("MODEL_WEIGHTS_LAYER_CHECK_START")
            for ln in ["dense_2", "dense_3"]:
                try:
                    print(f"{ln}:{has_layer(f['model_weights'], ln)}")
                except Exception as e:
                    print(f"{ln}:False")
            print("MODEL_WEIGHTS_LAYER_CHECK_END")
except Exception as e:
    print(f"Error reading H5 file: {e}")
