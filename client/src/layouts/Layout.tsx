import { UserButton, useAuth } from "@clerk/clerk-react";
import { Container, Flex, Group, Image, Text } from "@mantine/core";
import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { setGetToken } from "../axxios";

const Layout = () => {
  const { getToken } = useAuth();
  const [ready, setReady] = useState(false);

  // get an access token from Clerk and save it to local storage, axxios will read it from there
  useEffect(() => {
    setGetToken(getToken);
    setReady(true);
  }, [getToken]);

  if (!ready) return null;

  return (
    <Container pb="xl">
      <Flex justify="space-between" py="xl" mb="xl">
        <Group>
          <Image src="/brain.png" height={24} width={24} />
          <Text>Knowledge Tracing</Text>
        </Group>

        <UserButton />
      </Flex>

      <Outlet />
    </Container>
  );
};

export default Layout;
