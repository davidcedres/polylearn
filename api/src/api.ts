import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

app.post("/skills", async (req, res) => {
    const skill = await prisma.skill.create({ data: req.body });
    res.json(skill);
});

app.get("/skills", async (req, res) => {
    const skills = await prisma.skill.findMany({
        include: {
            questions: true,
        },
        orderBy: {
            id: 'asc'
        },
    })

    res.json(skills);
});

app.get("/skills/:id", async (req, res) => {
    const skill = await prisma.skill.findUnique({
        where: {
            id: +req.params.id,
        },
    });

    res.json(skill);
});

app.post("/questions", async (req, res) => {
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

app.get("/questions", async (req, res) => {
    const questions = await prisma.question.findMany({
        include: {
            answers: true
        },
        where: {
            skillId: +req.query.skillId!
        }
    });
    res.json(questions);
});

app.post("/submits", async (req, res) => {
    try {
        const submit = await prisma.submit.create({ data: req.body });
        res.json(submit);
    }
    catch (error) {
        res.json({ bad: true })
    }
});

// TODO
app.get("/submits", async (req, res) => {
    const submits = await prisma.submit.findMany();
    res.json(submits);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
