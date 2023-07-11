import { Stack, Tabs } from "@mantine/core";
import { Database, List } from "tabler-icons-react";
import Skills from "./Skills";
import Data from "./Data";

const Admin = () => {
  return (
    <Stack>
      <Tabs defaultValue="skills" variant="pills">
        <Tabs.List mb="md">
          <Tabs.Tab value="skills" icon={<List size="0.8rem" />}>
            Skills
          </Tabs.Tab>

          <Tabs.Tab value="data-set" icon={<Database size="0.8rem" />}>
            Data
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="skills" pt="xs">
          <Skills />
        </Tabs.Panel>

        <Tabs.Panel value="data-set" pt="xs">
          <Data />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default Admin;
