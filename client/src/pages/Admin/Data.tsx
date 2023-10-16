import { useMutation, useQuery } from "@tanstack/react-query";
import axxios from "../../axxios";
import {
    Anchor,
    Button,
    Flex,
    Stack,
    Table,
    Text,
    Title,
    Tooltip,
} from "@mantine/core";
import { ISubmit } from "../../types";
import { Download } from "tabler-icons-react";
import { saveAs } from "file-saver";
import { truncate } from "lodash";

const Data = () => {
    const request = useQuery(["submits"], () =>
        axxios.get<ISubmit[]>("/submits")
    );

    const downloadCsv = useMutation(
        () =>
            axxios.get<Blob>("/dataset", {
                responseType: "blob",
            }),
        {
            onSuccess: (response) => {
                saveAs(response.data, "dataset.csv");
            },
        }
    );

    const download = () => {
        downloadCsv.mutate();
    };

    return (
        <Stack>
            <Flex justify="space-between">
                <Title>Data</Title>

                <Button
                    onClick={download}
                    variant="light"
                    rightIcon={<Download size=".9rem" />}
                >
                    CSV
                </Button>
            </Flex>

            {(request.data?.data.length ?? 0) > 0 && (
                <Table verticalSpacing="md">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Skill</th>
                            <th>Question</th>
                            <th>Answer</th>
                            <th>Video</th>
                        </tr>
                    </thead>

                    <tbody>
                        {request.data?.data.map((submit) => (
                            <tr
                                key={
                                    submit.userId + submit.answer.id.toString()
                                }
                            >
                                <td>{submit.userId.slice(-6).toUpperCase()}</td>
                                <td>
                                    {truncate(
                                        submit.answer.question.skill.name
                                    )}
                                </td>
                                <td>
                                    <Tooltip
                                        label={submit.answer.question.text}
                                    >
                                        <Text>
                                            {truncate(
                                                submit.answer.question.text
                                            )}
                                        </Text>
                                    </Tooltip>
                                </td>
                                <td>{truncate(submit.answer.text)}</td>
                                <td>
                                    <Anchor href={submit.clip} target="_blank">
                                        Clip
                                    </Anchor>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {request.data?.data.length === 0 && (
                <Text>Users have not taken any tests yet</Text>
            )}
        </Stack>
    );
};

export default Data;
