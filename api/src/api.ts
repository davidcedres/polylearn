import "dotenv/config";
import {
    ClerkExpressRequireAuth,
    RequireAuthProp,
    users,
} from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import { stringify } from "csv-stringify/sync";
import cors from "cors";
import express from "express";

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

const port = 8080;

app.post("/skills", ClerkExpressRequireAuth(), async (req, res) => {
    const skill = await prisma.skill.create({ data: req.body });
    res.json(skill);
});


app.get(
    "/skills",
    ClerkExpressRequireAuth(),
    // @ts-expect-error
    async (req: RequireAuthProp<express.Request>, res) => {
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
            where: { user: userId },
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

        console.log(skillsWithCompletion);

        res.json(skillsWithCompletion);
    }
);

app.get("/skills/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const skill = await prisma.skill.findUnique({
        where: {
            id: +req.params.id,
        },
    });

    res.json(skill);
});

app.post("/questions", ClerkExpressRequireAuth(), async (req, res) => {
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
});

app.get("/questions", ClerkExpressRequireAuth(), async (req, res) => {
    const questions = await prisma.question.findMany({
        include: {
            answers: true,
        },
        where: {
            skillId: +req.query.skillId!,
        },
    });
    res.json(questions);
});

app.post("/submits", ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const submit = await prisma.submit.create({ data: req.body });
        res.json(submit);
    }

    catch (error) {
        // fails silently, good for double attempts
        res.json({ bad: true });
    }
});

app.get("/submits", ClerkExpressRequireAuth(), async (req, res) => {
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

    res.json(submits);
});

app.get("/dataset", ClerkExpressRequireAuth(), async (req, res) => {

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
            submit.user,
            submit.answer.question.skill.name,
            submit.answer.question.text,
            submit.answer.text,
        ]);

        const str = stringify(data);

        res.status(200).send(str);
    }

    catch (error) {
        res.json({ bad: true })
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
