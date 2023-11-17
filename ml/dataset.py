from deepface import DeepFace
import cv2
import os

print("Libraries loaded")

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
        print("{} => {}".format(id + ".webm", features["dominant_emotion"]))
    except:
        print("Error processing ", img_path)
