import {
  Anchor,
  Breadcrumbs,
  Button,
  Flex,
  Stack,
  Title,
  Table,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { ISkill, IQuestion } from "../../types";
import { Link } from "react-router-dom";
import axxios from "../../axxios";

const Skill = () => {
  const { id } = useParams();

  if (!id) throw new Error("Id missing");

  const request = useQuery(["skill", id], () =>
    axxios.get<ISkill>(`/skills/${id}`)
  );

  const questionsRequest = useQuery(["questions", id], () =>
    axxios.get<IQuestion[]>("/questions", {
      params: {
        skillId: id,
      },
    })
  );

  const items = [
    { title: "Skills", to: "/" },
    { title: request.data?.data.name, to: "" },
  ].map((item, index) => (
    <Anchor component={Link} to={item.to} key={index}>
      {item.title}
    </Anchor>
  ));

  if (!request.data || !questionsRequest.data) return null;

  return (
    <Stack>
      <Breadcrumbs>{items}</Breadcrumbs>

      <Flex justify="space-between">
        <Title>{request.data?.data.name}</Title>

        <Button variant="light" component={Link} to="questions/new">
          New Question
        </Button>
      </Flex>

      {(questionsRequest.data?.data.length ?? 0) > 0 && (
        <Table verticalSpacing="md" highlightOnHover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th># Questions</th>
            </tr>
          </thead>

          <tbody>
            {questionsRequest.data?.data.map((question) => (
              <tr key={question.id} onClick={() => null}>
                <td>{question.id}</td>
                <td>{question.text}</td>
                <td>{question.answers.length} Answers</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {questionsRequest.data?.data.length === 0 && (
        <Text>No questions have been registered yet</Text>
      )}
    </Stack>
  );
};

export default Skill;
