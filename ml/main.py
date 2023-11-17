from defs import Tutor, User

# import gymnasium
# from gymnasium.envs.registration import register


def main():
    tutor = Tutor()
    user = User()

    for _ in range(1000):
        knowledge_component = tutor.find_next_knowledge_component(
            user.last_emotion, user.last_answer
        )
        user.please_answer(knowledge_component)


main()

# Register our user model as a valid environment
# register(
#     id="user-model",
#     entry_point="components.simulated-user:UserModelEnv",
# )

# env = gymnasium.make("user-model")
# observation, info = env.reset()

# for _ in range(1000):
#     action = env.action_space.sample()  # agent policy that uses the observation and info
#     observation, reward, terminated, truncated, info = env.step(action)

#     if terminated or truncated:
#         observation, info = env.reset()

# env.close()
