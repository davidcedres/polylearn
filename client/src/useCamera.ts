import { useCallback, useRef, useState } from "react";
import { useAsync } from "react-use";

export const useCamera = () => {
    const [camera, setCamera] = useState<string>("");

    const [previewReady, setPreviewReady] = useState(false);
    const [recording, setRecording] = useState(false);

    const streamRef = useRef<MediaStream>();
    const videoChunks = useRef<Blob[]>([]);
    const mediaRecorder = useRef<MediaRecorder>();

    const shouldStop = useRef(false);
    const stopped = useRef(false);
    const storeVideo = useRef<(value: File | PromiseLike<File>) => void>();

    // let's find camera devices, put them on a state, and pick the first one as active one
    useAsync(async () => {
        await navigator.mediaDevices.getUserMedia({
            video: true,
        });

        const devices = await navigator.mediaDevices.enumerateDevices();

        const cams = devices.filter((device) => device.kind === "videoinput");
        setCamera(cams[0].deviceId);
    }, []);

    const startPreview = useCallback(
        async (node: HTMLVideoElement | null) => {
            if (node === null) return;

            const mediaStream: MediaProvider =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        deviceId: camera,
                    },
                });

            node.srcObject = mediaStream;
            streamRef.current = mediaStream;
            setPreviewReady(true);
        },
        [camera]
    );

    const startRecording = () => {
        if (streamRef.current === undefined) {
            throw new Error("Stream not ready bro");
        }

        mediaRecorder.current = new MediaRecorder(streamRef.current, {
            mimeType: "video/webm",
        });

        mediaRecorder.current.addEventListener("error", () => {
            console.log("SOMETHING WENT REALLY WRONG");
        });

        mediaRecorder.current.addEventListener("start", () => {
            console.log("Recording");
        });

        mediaRecorder.current.addEventListener(
            "dataavailable",
            function (e: BlobEvent) {
                console.log("Data Requested");

                if (e.data.size > 0) {
                    videoChunks.current.push(e.data);
                }

                if (
                    shouldStop.current &&
                    !stopped.current &&
                    mediaRecorder.current != null
                ) {
                    console.log(
                        "And data requested determined it needs to stop"
                    );

                    mediaRecorder.current.stop();
                    stopped.current = true;
                }
            }
        );

        mediaRecorder.current.addEventListener("stop", () => {
            const blob = new Blob(videoChunks.current);
            const file = new File([blob], "video");

            if (storeVideo.current === undefined)
                throw new Error(
                    "No callback was given where to submit the video file to"
                );

            stopped.current = false;
            storeVideo.current?.(file);
            setRecording(false);
        });

        mediaRecorder.current.start();
        setRecording(true);
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
        startPreview,
        previewReady,
        startRecording,
        stopRecording,
        recording,
    };
};
