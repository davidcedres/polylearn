import {
  Breadcrumbs,
  Button,
  Stack,
  TextInput,
  Title,
  Anchor,
} from "@mantine/core";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axxios from "../../axxios";

const NewSkill = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");

  const request = useMutation((name: string) =>
    axxios.post("/skills", { name, status: "DRAFT" })
  );

  const onSubmit = () => {
    request.mutate(text, {
      onSuccess: () => {
        toast.success("Saved");
        navigate("/");
      },
    });
  };

  const items = [
    { title: "Skills", to: "/" },
    { title: "New", to: "" },
  ].map((item, index) => (
    <Anchor component={Link} to={item.to} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <Stack maw="512px">
      <Breadcrumbs>{items}</Breadcrumbs>

      <Title>Add skill</Title>

      <TextInput
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Skill Name"
        label="Name"
        withAsterisk
      />

      <Button onClick={onSubmit} loading={request.isLoading}>
        Save
      </Button>
    </Stack>
  );
};

export default NewSkill;
