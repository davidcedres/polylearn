import numpy as np
import gymnasium


class UserModelEnv(gymnasium.Env):

    """ As this is meant to model an student
        Let's do it this way:

        State: user holds emotion, with 6 possible values
        Actions: user might take one of two possible actions, responding correctly or incorrectly
    """
    def __init__(self):
        super().__init__()
        self.action_space = gymnasium.spaces.Discrete(5) # user will be able to respond to 5 different inputs (skills)
        self.observation_space = gymnasium.spaces.Discrete(6) # user will have 6 possible emotions on its face
        self.reset()

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        # self.action = 0
        # self.reward = 0
        return 0, {}

    def step(self, action):
        assert self.action_space.contains(action)
        self.action = action
        if self.action == 0:
            self.reward = np.random.choice(2, p=[0.5, 0.5])
        elif self.action == 1:
            self.reward = 100 * np.random.choice(2, p=[0.9, 0.1])
        return 0, self.reward, False, False, {}

    def render(self, mode="human", close=False):
        print("Action {}, reward {}".format(self.action, self.reward))