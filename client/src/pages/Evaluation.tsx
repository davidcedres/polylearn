import { Stack, Title, Anchor, Flex, Text, Button } from "@mantine/core";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowBackUp } from "tabler-icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { IQuestion } from "../types";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const Evaluation = () => {
  const { user } = useUser()

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { id } = useParams();
  if (!id) throw new Error("Id missing");

  // keep track of what answers has the user picked
  const [answers, setAnswers] = useState<number[]>([])
  
  const [index, setIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<number>();

  const questionsRequest = useQuery(["questions", id], () =>
    axios.get<IQuestion[]>("http://localhost:3000/questions", {
      params: {
        skillId: id,
      },
    })
  );

  const submitRequest = useMutation((answerId: number) => axios.post('http://localhost:3000/submits', { 
      user: user!.id,
      answerId
   }))

  useEffect(() => {
    if (answers.length !== questionsRequest.data?.data.length) return
    if (submitRequest.isLoading) return

    console.log('Effect Called')

    // we know we reached the end
    const exec = async () => {
      await Promise.all(answers.map((answerId) => submitRequest.mutateAsync(answerId)))
      await queryClient.invalidateQueries(['skills'])
      navigate('/success')
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    exec()
    
  }, [answers, answers.length, navigate, queryClient, questionsRequest.data?.data.length, submitRequest])

  const next = () => {
    if (currentAnswer === undefined) throw new Error('Answer missing')

    setAnswers(prev => ([...prev, currentAnswer]))
    setIndex((prev) => (prev === questionsRequest.data?.data.length ?  prev : prev + 1));

    setCurrentAnswer(undefined)
  };

  const question = questionsRequest.data?.data[index];

  if (!question) return null;

  return (
    <Stack>
      <Anchor component={Link} to="/">
        <ArrowBackUp />
      </Anchor>

      <Title mb="xl">{question.text}</Title>

      {question.answers.map((answer) => (
        <Flex
          key={answer.id}
          p="md"
          justify="space-between"
          sx={{
            borderColor: "#C1C2C5",
            borderWidth: "1px",
            borderStyle: "solid",
            cursor: "pointer",
            backgroundColor: currentAnswer == answer.id ? '#E7F5FF' : 'white'
          }}
          align="center"
          onClick={() => setCurrentAnswer(answer.id)}
        >
          <Text>{answer.text}</Text>
        </Flex>
      ))}

      <Button sx={{ alignSelf: "flex-end" }} onClick={next} disabled={currentAnswer === undefined}>
        Next
      </Button>
    </Stack>
  );
};

export default Evaluation;
