import { Button, Stack, Text, Title } from "@mantine/core";
import { useCamera } from "../../useCamera";
import { Link, useParams } from "react-router-dom";

const Check = () => {
    const { id } = useParams();
    const { onPreview } = useCamera();

    if (!id) throw new Error("Id missing");

    return (
        <Stack align="center" spacing="lg">
            <Title>Empezar la prueba</Title>

            <Text>Tu rostro sera grabado para propositos educativos</Text>

            <video
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                ref={onPreview}
                id="player"
                autoPlay
                muted
                style={{
                    width: 256,
                    height: 256,
                    borderRadius: "50%",
                    objectFit: "cover",
                }}
            />

            <Link to={"/evaluation/" + id}>
                <Button>Comenzar</Button>
            </Link>
        </Stack>
    );
};

export default Check;
