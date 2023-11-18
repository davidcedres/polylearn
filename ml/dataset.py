from deepface import DeepFace
import cv2
import os
import pandas as pd

print("Libraries loaded")


clip_to_emotion_map = {}

for filename in os.listdir("data/clips"):
    f = os.path.join("data/clips", filename)

    if not f.endswith(".webm"):
        continue

    id = f.split("/")[2].split(".")[0]

    video_capture = cv2.VideoCapture(f)

    if not video_capture.isOpened():
        print("Error opening video file " + f)
        continue

    # Our strategy for frame selection is taking the last frame
    # Last frame is stored in `frame`
    keep_processing = True
    frame = None

    while keep_processing:
        success, f = video_capture.read()

        if success == True:
            frame = f
        else:
            keep_processing = False

    img_path = "data/frames/{}.jpg".format(id)
    cv2.imwrite(img_path, frame)

    try:
        [features] = DeepFace.analyze(
            img_path=img_path, actions=["emotion"], silent=True
        )
        clip_to_emotion_map[id] = features["dominant_emotion"]
    except:
        print("Emotion not extracted from", img_path)

df = pd.read_csv("./data/dataset.csv")


def find_emotion(clip_file):
    file_name = clip_file.split(".")[0]
    return clip_to_emotion_map[file_name] if file_name in clip_to_emotion_map else None


df["emotion"] = df["clip_file"].apply(find_emotion)

df.dropna()

print("sample")
print(df.sample(10))

print("types of emotions found")
print(df["emotion"].unique())

print("general description")
print(df.describe())

# this project was moved to https://deepnote.com/workspace/david-cedres-61e2-c724727c-72d9-4adf-b52d-cbe52695c012/project/Final-Project-31d1365b-2509-4598-a96d-2c47b820dcc8/notebook/Final%20Project-4d39c43a48974c8b91a5762813455bf1
