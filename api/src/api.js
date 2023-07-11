"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const client_1 = require("@prisma/client");
const sync_1 = require("csv-stringify/sync");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = 8080;
app.post("/skills", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield prisma.skill.create({ data: req.body });
    res.json(skill);
}));
app.get("/skills", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), 
// @ts-expect-error
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.auth.userId;
    const { role } = (yield clerk_sdk_node_1.users.getUser(userId)).publicMetadata;
    const skills = yield prisma.skill.findMany({
        include: {
            questions: true,
        },
        orderBy: {
            id: "asc",
        },
        where: Object.assign({}, (role !== "admin" && { status: "LIVE" })),
    });
    if (role === "admin")
        return res.json(skills);
    // so we gotta append .done to each skill for participants to know
    const submits = yield prisma.submit.findMany({
        where: { user: userId },
        include: {
            answer: {
                include: {
                    question: true,
                },
            },
        },
    });
    const completedSkills = new Set(submits.map((submit) => submit.answer.question.skillId));
    const skillsWithCompletion = skills.map((skill) => (Object.assign(Object.assign({}, skill), { completed: completedSkills.has(skill.id) })));
    console.log(skillsWithCompletion);
    res.json(skillsWithCompletion);
}));
app.get("/skills/:id", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield prisma.skill.findUnique({
        where: {
            id: +req.params.id,
        },
    });
    res.json(skill);
}));
app.post("/questions", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, answers, skillId } = req.body;
    const question = yield prisma.question.create({
        data: {
            text,
            skillId,
        },
    });
    yield Promise.all(answers.map((answer) => prisma.answer.create({
        data: {
            text: answer.text,
            questionId: question.id,
        },
    })));
    res.json({ good: true });
}));
app.get("/questions", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = yield prisma.question.findMany({
        include: {
            answers: true,
        },
        where: {
            skillId: +req.query.skillId,
        },
    });
    res.json(questions);
}));
app.post("/submits", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submit = yield prisma.submit.create({ data: req.body });
        res.json(submit);
    }
    catch (error) {
        res.json({ bad: true });
    }
}));
app.get("/submits", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const submits = yield prisma.submit.findMany({
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
}));
app.get("/dataset", (0, clerk_sdk_node_1.ClerkExpressRequireAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const submits = yield prisma.submit.findMany({
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
    const str = (0, sync_1.stringify)(data);
    res.attachment('dataset.csv').status(200).send(str);
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
