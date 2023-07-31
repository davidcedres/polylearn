import { RedirectToSignIn } from "@clerk/clerk-react";
import { Button, Stack, Text, Title } from "@mantine/core";
import { useState } from "react";

const Home = () => {
  const [userWantsToLogIn, setUserWantsToLogIn] = useState(false);

  const login = () => {
    setUserWantsToLogIn(true);
  };

  return (
    <Stack pt="128px">
      {userWantsToLogIn && <RedirectToSignIn />}

      <Title sx={{ fontSize: 86 }} lh={1.1} c="#1F2226">
        Personalized{" "}
        <Text span c="#408CFF" inherit>
          Learning
        </Text>{" "}
        for Everyone
      </Title>

      <Text sx={{ fontSize: 18 }} w="75%">
        AI-powered personalized learning that adapts to you.
      </Text>

      <Button sx={{ alignSelf: "flex-start" }} onClick={login}>
        Start Now
      </Button>
    </Stack>
  );
};

export default Home;
