import { Check, PlayerPlay } from "tabler-icons-react";
import { Flex, Modal, Stack, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { ISkill } from "../../types";
import axxios from "../../axxios";
import TermsOfUse from "../../components/TermsOfUse";
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from "react";

const Progress = () => {
  // hooks
  const { user } = useUser();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // state
  const [tosModal, setTosModal] = useState(false)

  // queries
  const skillsRequest = useQuery(["skills"], () =>
    axxios.get<(ISkill & { completed: boolean })[]>("/skills", {
      params: { status: "LIVE" },
    })
  );

  const userRequest = useQuery(['user'], () => axxios.get('/users/' + user!.id), {
    retry: false
  })

  const createUserRequest = useMutation((body: { id: string, signature: string }) =>
    axxios.post('/users', body))

  useEffect(() => {
    if (userRequest.status === 'loading') {
      return
    }

    setTosModal(userRequest.isError)
  }, [userRequest.isError, userRequest.isFetched, userRequest.status])

  const handleSignature = (png: string) => {
    createUserRequest.mutate({ id: user!.id, signature: png }, {
      onSuccess: () => {
        void userRequest.refetch()
      }
    })
  }

  const handleStartTest = (skill: ISkill & { completed: boolean }) => {
    if (userRequest.status === 'loading') return
    if (skill.completed) return
    if (userRequest.isError) return setTosModal(true)

    navigate(`/evaluation/${skill.id}`)
  }

  return (
    <Stack>
      <Title>{t("welcome")}</Title>

      {skillsRequest.data?.data.length === 0 && (
        <Text>No tests are available right now</Text>
      )}

      {skillsRequest.data?.data.map((skill) => (
        <Flex
          key={skill.id}
          p="xl"
          justify="space-between"
          sx={{
            borderColor: "#C1C2C5",
            borderWidth: "1px",
            borderStyle: "solid",
            cursor: !skill.completed ? "pointer" : undefined,
          }}
          align="center"
          onClick={() => handleStartTest(skill)}
        >
          <Stack>
            <Text fw="bold">{skill.name}</Text>
            <Text>
              {skill.questions.length} {t("questions")}
            </Text>
          </Stack>

          {skill.completed ? (
            <Check color="#00b341" />
          ) : (
            <PlayerPlay color="#00abfb" />
          )}
        </Flex>
      ))}

      <Modal
        opened={tosModal}
        onClose={() => setTosModal(false)}
        w="lg"
        size="xl"
        title="Términos y condiciones"
      >
        <TermsOfUse onSignature={handleSignature} loading={createUserRequest.isLoading} />
      </Modal>
    </Stack>
  );
};

export default Progress;
