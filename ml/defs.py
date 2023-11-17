from deepface import DeepFace
import girth


class Tutor:
    """Smart tutor, using reinforcement learning
    it will try to maximize the learning of a student"""

    def __init__(self):
        pass

    def find_next_knowledge_component(emotion, answer):
        raise Exception("Not Implemented")


class User:
    """Computer model that will simulate a real user for the purposes of simulation
    It has two key components:

    - When a question is asked, an IRT model will say if the answer is likely to be known
    - With said value, an appropiate emotion will be calculated using a hidden markov model

    The user will emit both an answer (as correct as indicated by the IRT model),
    as well as an emotion."""

    def __init__(self):
        pass

    def please_answer(knowledge_component):
        raise Exception("Not Implemented")
