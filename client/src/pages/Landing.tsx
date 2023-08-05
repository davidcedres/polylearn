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
        Aprendizaje{" "}
        <Text span c="#408CFF" inherit>
          Personalizado
        </Text>{" "}
        para Todos
      </Title>

      <Text sx={{ fontSize: 18 }} w="75%">
        Aprendizaje personalizado impulsado por IA que se adapta a ti.
      </Text>

      <Button sx={{ alignSelf: "flex-start" }} onClick={login}>
        Empezar
      </Button>
    </Stack>
  );
};

export default Home;
