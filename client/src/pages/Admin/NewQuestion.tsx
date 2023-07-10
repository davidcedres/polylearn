import {
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  Flex,
  Stack,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { nanoid } from "nanoid";
import { Trash } from "tabler-icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ISkill } from "../../types";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const NewQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) throw new Error("Id missing");

  const [text, setText] = useState("");
  const [answers, setAnswers] = useState<{ id: string; text: string }[]>([
    { id: nanoid(), text: "" },
    { id: nanoid(), text: "" },
  ]);

  const skillRequest = useQuery(["skill", id], () =>
    axios.get<ISkill>(`http://localhost:3000/skills/${id}`)
  );

  const questionRequest = useMutation(
    () =>
      axios.post("http://localhost:3000/questions", {
        text,
        answers,
        skillId: +id,
      }),
    {
      onSuccess: () => {
        toast.success("Question Created");
        navigate(`/skills/${id}`);
      },
    }
  );

  const items = [
    { title: "Skills", to: "/" },
    { title: skillRequest.data?.data.name, to: `/skills/${id}` },
    { title: "New Question", to: "" },
  ].map((item, index) => (
    <Anchor component={Link} to={item.to} key={index}>
      {item.title}
    </Anchor>
  ));

  const addAnswer = () => {
    setAnswers((prev) => [...prev, { id: nanoid(), text: "" }]);
  };

  const deleteAnswer = (id: string) => {
    setAnswers((prev) => prev.filter((answer) => answer.id !== id));
  };

  const changeAnswer = (id: string, value: string) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.id === id ? { id: answer.id, text: value } : answer
      )
    );
  };

  const save = () => {
    // TODO: instead of passing data here, it's reading it from state
    // not sure if okay
    questionRequest.mutate();
  };

  return (
    <Stack>
      <Breadcrumbs>{items}</Breadcrumbs>

      <TextInput
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Question"
        label="Question"
        withAsterisk
      />

      {answers.map((answer, index) => (
        <Flex align="flex-end" key={answer.id}>
          <TextInput
            placeholder={"Answer"}
            value={answer.text}
            onChange={(e) => changeAnswer(answer.id, e.target.value)}
            label={`Answer ${index + 1}`}
            w="100%"
            pr="sm"
          />

          <Box onClick={() => deleteAnswer(answer.id)}>
            <Trash color="tomato" />
          </Box>
        </Flex>
      ))}

      <Button onClick={addAnswer} variant="light">
        Add Answer
      </Button>

      <Button onClick={save} loading={questionRequest.isLoading}>
        Save
      </Button>
    </Stack>
  );
};

export default NewQuestion;
