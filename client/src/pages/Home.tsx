import { useUser } from "@clerk/clerk-react";
import Admin from "./Admin/Admin";
import Progress from "./Progress";

const Home = () => {
  const { user } = useUser();

  const admin = user?.publicMetadata.role === "admin";

  return admin ? <Admin /> : <Progress />;
};

export default Home;
