from deepface import DeepFace

# content of test_sample.py
def inc(x):
    return x + 1

# """ This will train a IRT model, and fit its parameters
# """ 
# def test_knowledge_tracing_component():

#     assert inc(3) == 5


def test_face_detection_works():
    features = DeepFace.analyze(img_path="assets/face.jpg", actions=['emotion'])
    print(features.emotion)