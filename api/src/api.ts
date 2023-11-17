import "dotenv/config";
import {
    ClerkExpressRequireAuth,
    RequireAuthProp,
    users,
    StrictAuthProp,
} from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import { stringify } from "csv-stringify/sync";
import cors from "cors";
import express, { Request } from "express";
import multerS3 from "multer-s3";
import { s3 } from "./s3.js";
import multer from "multer";
import { nanoid } from "nanoid";
import { Client as MinioClient } from "minio";

const minioClient = new MinioClient({
    endPoint: "files.polylearn.io",
    port: 443,
    useSSL: true,
    accessKey: process.env.MINIO_ACCESS_KEY_ID!,
    secretKey: process.env.MINIO_SECRET_ACCESS_KEY!,
});

declare global {
    namespace Express {
        interface Request extends StrictAuthProp {}
    }
}

const storage = multerS3({
    s3,
    bucket: "clips",
    acl: "public-read",
    key: function (req, file, cb) {
        cb(null, `${nanoid()}.webm`);
    },
});

const upload = multer({ storage });

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

app.get(
    "/users/:id",
    ClerkExpressRequireAuth(),
    async (req: RequireAuthProp<Request>, res) => {
        try {
            const user = await prisma.user.findFirstOrThrow({
                where: {
                    id: req.params.id,
                },
            });

            res.json(user);
        } catch (error) {
            res.status(404).json({ good: false });
        }
    }
);

app.post(
    "/users",
    ClerkExpressRequireAuth(),
    async (req: RequireAuthProp<Request>, res) => {
        const id = req.body.id as string;
        const signature = req.body.signature as string;

        await prisma.user.create({
            data: {
                id,
                signature,
            },
        });

        res.json({ good: true });
    }
);

app.post(
    "/skills",
    ClerkExpressRequireAuth(),
    async (req: RequireAuthProp<Request>, res) => {
        const skill = await prisma.skill.create({ data: req.body });
        res.json(skill);
    }
);

/* Exposes skills that belong to you

    As an admin user, you get to see all
    As an student, you get to see all, but with a .done[boolean] property
 */
app.get(
    "/skills",
    ClerkExpressRequireAuth(),
    async (req: RequireAuthProp<Request>, res) => {
        const userId = req.auth.userId;
        const { role } = (await users.getUser(userId)).publicMetadata;

        const skills = await prisma.skill.findMany({
            include: {
                questions: true,
            },
            orderBy: {
                id: "asc",
            },
            where: {
                ...(role !== "admin" && { status: "LIVE" }),
            },
        });

        if (role === "admin") return res.json(skills);

        // so we gotta append .done to each skill for participants to know
        const submits = await prisma.submit.findMany({
            where: { userId },
            include: {
                answer: {
                    include: {
                        question: true,
                    },
                },
            },
        });

        const completedSkills = new Set(
            submits.map((submit) => submit.answer.question.skillId)
        );

        const skillsWithCompletion = skills.map((skill) => ({
            ...skill,
            completed: completedSkills.has(skill.id),
        }));

        res.json(skillsWithCompletion);
    }
);

app.get(
    "/skills/:id",
    ClerkExpressRequireAuth(),
    async (req: RequireAuthProp<Request>, res) => {
        const skill = await prisma.skill.findUnique({
            where: {
                id: +req.params.id,
            },
        });

        res.json(skill);
    }
);

app.post(
    "/questions",
    ClerkExpressRequireAuth(),
    async (req: RequireAuthProp<Request>, res) => {
        const { text, answers, skillId } = req.body as {
            text: string;
            answers: { text: string; id: string }[];
            skillId: number;
        };

        const question = await prisma.question.create({
            data: {
                text,
                skillId,
            },
        });

        await Promise.all(
            answers.map((answer) =>
                prisma.answer.create({
                    data: {
                        text: answer.text,
                        questionId: question.id,
                    },
                })
            )
        );

        res.json({ good: true });
    }
);

app.get(
    "/questions",
    ClerkExpressRequireAuth(),
    async (req: RequireAuthProp<Request>, res) => {
        const questions = await prisma.question.findMany({
            include: {
                answers: true,
            },
            where: {
                skillId: +req.query.skillId!,
            },
        });

        res.json(questions);
    }
);

app.post(
    "/submits",
    ClerkExpressRequireAuth(),
    upload.single("clip"),
    async (req: RequireAuthProp<Request>, res) => {
        try {
            const submit = await prisma.submit.create({
                data: {
                    answerId: Number(req.body.answerId),
                    userId: req.body.userId,
                    // @ts-expect-error -- express is dumb
                    clip: req.file?.key,
                },
            });
            res.json(submit);
        } catch (error) {
            console.log(error);

            // fails silently, good for double attempts
            res.json({ bad: true });
        }
    }
);

app.get(
    "/submits",
    ClerkExpressRequireAuth(),
    async (req: RequireAuthProp<Request>, res) => {
        const submits = await prisma.submit.findMany({
            include: {
                answer: {
                    include: {
                        question: {
                            include: {
                                skill: true,
                            },
                        },
                    },
                },
            },
        });

        const val = await Promise.all(
            submits.map(async (submit) => ({
                ...submit,
                clip: await minioClient.presignedGetObject(
                    "clips",
                    submit.clip
                ),
            }))
        );

        res.json(val);
    }
);

app.get(
    "/dataset",
    ClerkExpressRequireAuth(),
    async (req: RequireAuthProp<Request>, res) => {
        try {
            const submits = await prisma.submit.findMany({
                include: {
                    answer: {
                        include: {
                            question: {
                                include: {
                                    skill: true,
                                },
                            },
                        },
                    },
                },
            });

            const data = submits.map((submit) => [
                submit.userId,
                submit.answer.question.skill.id,
                submit.answer.question.id,
                submit.answer.text,
                submit.clip,
            ]);

            const str = stringify(data);
            res.status(200).send(str);
        } catch (error) {
            res.json({ bad: true });
        }
    }
);

app.listen(process.env.PORT || 8080);
