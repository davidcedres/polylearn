import { UserButton, useAuth } from "@clerk/clerk-react";
import { Container, Flex, Image } from "@mantine/core";
import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { setGetToken } from "../axxios";
import logoSrc from "../assets/images/logo2.png";
import { Link } from "react-router-dom";

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
        <Link to="/">
          <Image src={logoSrc} height={30} width="min" />
        </Link>

        {/* TODO: make this dynamic based on dev/prod environments */}
        <UserButton
          afterSignOutUrl={
            (import.meta.env.VITE_API_URL as string).includes('localhost')
              ? "http://127.0.0.1:5173/"
              : 'https://polylearn.io/'}
        />

      </Flex>

      <Outlet />
    </Container>
  );
};

export default Layout;
