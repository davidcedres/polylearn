from deepface import DeepFace
import cv2
import os
import pandas as pd

print("Libraries loaded")


clip_to_emotion_map = {}

for filename in os.listdir("raw/clips"):
    f = os.path.join("raw/clips", filename)

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

    img_path = "raw/frames/{}.jpg".format(id)
    cv2.imwrite(img_path, frame)

    try:
        [features] = DeepFace.analyze(
            img_path=img_path, actions=["emotion"], silent=True
        )
        clip_to_emotion_map[id] = features["dominant_emotion"]
    except:
        print("Emotion not extracted from", img_path)

df = pd.read_csv("./raw/dataset.csv")


def find_emotion(clip_file):
    file_name = clip_file.split(".")[0]
    return clip_to_emotion_map[file_name] if file_name in clip_to_emotion_map else None


df["emotion"] = df["clip_file"].apply(find_emotion)

print("sample")
print(df.sample(10))

print("types of emotions found")
print(df["emotion"].unique())

print("general description")
print(df.describe())
