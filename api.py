from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os

app = Flask(__name__)
CORS(app)  # Allow communication with Node.js backend

# Load YOLO Model
model = YOLO("yolov8n.pt")

@app.route("/detect", methods=["POST"])
def detect_objects():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files["image"]
    image_path = "tomoto.jpg"
    image.save(image_path)

    # Run object detection
    results = model(image_path)
    detected_items = [model.names[int(box[5])] for box in results[0].boxes.data] if results[0].boxes.data.numel() > 0 else []
    # detected_counts = dict(Counter(detected_counts))

    return jsonify({"detected_items": detected_items})

if __name__ == "__main__":
    app.run(port=5001, debug=True)

