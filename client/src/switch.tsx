import { useUser } from "@clerk/clerk-react";
import { Flex, Loader } from "@mantine/core";
import { Route, Routes } from "react-router";

import Landing from "./pages/Landing";
import Layout from "./layouts/Layout";

// admin pages
import Admin from "./pages/Admin/Admin";
import NewQuestion from "./pages/Admin/NewQuestion";
import NewSkill from "./pages/Admin/NewSkill";
import Skill from "./pages/Admin/Skill";

// student pages
import Evaluation from "./pages/Student/Evaluation";
import Progress from "./pages/Student/Progress";
import Success from "./pages/Student/Success";

const Switch = () => {
  const { user } = useUser();

  // not known who the user is or if session exists
  if (user === undefined)
    return (
      <Flex h="100vh" align="center" justify="center">
        <Loader />
      </Flex>
    );

  // public pages
  if (user === null)
    return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="*" element={<p>404</p>} />
        </Route>
      </Routes>
    );

  const role = user.publicMetadata.role ?? "student";

  // admin pages
  if (role === "admin")
    return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Admin />} />
          <Route path="/skills/:id" element={<Skill />} />
          <Route path="/skills/new" element={<NewSkill />} />
          <Route path="/skills/:id/questions/new" element={<NewQuestion />} />
        </Route>
      </Routes>
    );

  if (role === "student")
    return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Progress />} />
          <Route path="/evaluation/:id" element={<Evaluation />} />
          <Route path="/success" element={<Success />} />
        </Route>
      </Routes>
    );
};

export default Switch;
