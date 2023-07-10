import {
  Breadcrumbs,
  Button,
  Flex,
  Stack,
  Table,
  Title,
  Anchor,
  Text,
  Badge,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { ISkill } from "../../types";
import axxios from "../../axxios";

const Admin = () => {
  const navigate = useNavigate();

  const request = useQuery(["skills"], () => axxios.get<ISkill[]>("/skills"));

  const onClick = (id: number) => navigate(`/skills/${id}`);

  const items = [{ title: "Skills", to: "/" }].map((item, index) => (
    <Anchor component={Link} to={item.to} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <Stack>
      <Breadcrumbs>{items}</Breadcrumbs>

      <Flex justify="space-between">
        <Title>Admin</Title>

        <Button variant="light" component={Link} to="/skills/new">
          Add skill
        </Button>
      </Flex>

      {(request.data?.data.length ?? 0) > 0 && (
        <Table verticalSpacing="md" highlightOnHover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th># Questions</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {request.data?.data.map((skill) => (
              <tr key={skill.id} onClick={() => onClick(skill.id)}>
                <td>{skill.id}</td>
                <td>{skill.name}</td>
                <td>{skill.questions.length} Questions</td>
                <td>
                  <Badge color={skill.status === "DRAFT" ? "gray" : "green"}>
                    {skill.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {request.data?.data.length === 0 && (
        <Text>No skills have been registered yet</Text>
      )}
    </Stack>
  );
};

export default Admin;
