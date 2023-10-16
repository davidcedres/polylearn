import { useCallback, useRef, useState } from "react";
import { useEffectOnce } from "react-use";

export const useCamera = () => {
    const [camera, setCamera] = useState<string>("");

    const mediaRecorder = useRef<MediaRecorder>();
    const recording = useRef<boolean>(false);
    const shouldStop = useRef(false);
    const stopped = useRef(false);
    const storeVideo = useRef<(value: File | PromiseLike<File>) => void>();
    const videoChunks = useRef<Blob[]>([]);

    // let's find camera devices, put them on a state, and pick the first one as active one
    useEffectOnce(() => {
        const cb = async () => {
            await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            const devices = await navigator.mediaDevices.enumerateDevices();

            const cams = devices.filter(
                (device) => device.kind === "videoinput"
            );
            setCamera(cams[0].deviceId);
        };

        void cb();
    });

    const onPreview = useCallback(
        async (node: HTMLVideoElement | null) => {
            if (node === null) return;

            node.srcObject = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    deviceId: camera,
                },
            });
        },
        [camera]
    );

    const startRecording = async () => {
        videoChunks.current = [];
        recording.current = true;

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                deviceId: camera,
            },
        });

        mediaRecorder.current = new MediaRecorder(stream, {
            mimeType: "video/webm",
        });

        mediaRecorder.current.addEventListener("error", () => {
            console.log("Recording failed");
        });

        mediaRecorder.current.addEventListener("start", () => {
            console.log("Recording started");
        });

        mediaRecorder.current.addEventListener(
            "dataavailable",
            function (e: BlobEvent) {
                if (e.data.size > 0) {
                    videoChunks.current.push(e.data);
                }

                if (
                    shouldStop.current &&
                    !stopped.current &&
                    mediaRecorder.current != null
                ) {
                    mediaRecorder.current.stop();
                    stopped.current = true;
                    shouldStop.current = false;
                }
            }
        );

        mediaRecorder.current.addEventListener("stop", () => {
            console.log("Recording stopped");

            const blob = new Blob(videoChunks.current);
            const file = new File([blob], "video");

            if (storeVideo.current === undefined)
                throw new Error(
                    "No callback was given where to submit the video file to"
                );

            storeVideo.current?.(file);

            recording.current = false;
            stopped.current = false;
            videoChunks.current = [];
        });

        mediaRecorder.current.start();
    };

    const stopRecording = () => {
        if (mediaRecorder.current === undefined)
            throw new Error("Can't stop a recording that never started");

        shouldStop.current = true;

        const promise = new Promise<File>((resolve) => {
            storeVideo.current = resolve;
        });

        mediaRecorder.current.requestData();
        return promise;
    };

    return {
        onPreview,
        startRecording,
        stopRecording,
        recording,
    };
};
