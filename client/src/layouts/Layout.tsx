import { UserButton } from "@clerk/clerk-react";
import { Container, Flex, Group, Image, Text } from "@mantine/core";
import { Outlet } from "react-router";

const Layout = () => {
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
