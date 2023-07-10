import Lottie from "lottie-react";
import data from '../assets/success.json'
import { Stack, Text } from "@mantine/core";
import { useNavigate } from "react-router";

const Success = () => {
    const navigate = useNavigate()

    const done = () => {
        navigate('/', { replace: true })
    }

    return (
        <Stack w='256px' align='center' mx='auto' mt='128px'>
            <Lottie animationData={data} loop={false} onComplete={done} />
            <Text>Test completed!</Text>
        </Stack>
    )
}

export default Success