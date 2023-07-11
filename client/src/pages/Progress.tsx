import { Flex, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { ISkill } from "../types";
import { Check, PlayerPlay } from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import axxios from "../axxios";

const Progress = () => {
  const navigate = useNavigate();

  const request = useQuery(["skills"], () =>
    axxios.get<(ISkill & { completed: boolean })[]>("/skills", {
      params: { status: "LIVE" },
    })
  );

  const onClick = (id: number) => {
    navigate(`/evaluation/${id}`);
  };

  return (
    <Stack>
      <Title>Welcome</Title>

      {request.data?.data.length === 0 && (
        <Text>No tests are available right now</Text>
      )}

      {request.data?.data.map((skill) => (
        <Flex
          key={skill.id}
          p="xl"
          justify="space-between"
          sx={{
            borderRadius: "8px",
            borderColor: "#C1C2C5",
            borderWidth: "1px",
            borderStyle: "solid",
            cursor: !skill.completed ? "pointer" : undefined,
          }}
          align="center"
          onClick={() => !skill.completed && onClick(skill.id)}
        >
          <Stack>
            <Text fw="bold">{skill.name}</Text>
            <Text>{skill.questions.length} questions</Text>
          </Stack>

          {skill.completed ? (
            <Check color="#00b341" />
          ) : (
            <PlayerPlay color="#00abfb" />
          )}
        </Flex>
      ))}
    </Stack>
  );
};

export default Progress;
