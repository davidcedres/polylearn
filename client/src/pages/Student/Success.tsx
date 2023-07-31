import Lottie from "lottie-react";
import data from "../../assets/success.json";
import { Stack, Text } from "@mantine/core";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const Success = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const done = () => {
    navigate("/", { replace: true });
  };

  return (
    <Stack w="256px" align="center" mx="auto" mt="128px">
      <Lottie animationData={data} loop={false} onComplete={done} />
      <Text>{t("success")}</Text>
    </Stack>
  );
};

export default Success;
