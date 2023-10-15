import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

await prisma.skill.createMany({
    data: [
        { name: "Vocabulario y semántica", status: "LIVE" },
        { name: "Ortografía y gramática", status: "LIVE" },
        { name: "Redacción y estructura", status: "LIVE" },
        { name: "Tipos de texto", status: "LIVE" },
        { name: "Autores y obras clásicas", status: "LIVE" },
    ],
});

await prisma.question.createMany({
    data: [
        {
            text: '¿La palabra "amable" es un adjetivo?',
            skillId: 1,
        },
        {
            text: '¿"Grande" y "pequeño" son sinónimos?',
            skillId: 1,
        },
        {
            text: '¿"Malo" y "bueno" son sinónimos?',
            skillId: 1,
        },
        {
            text: '¿La palabra "brillante" es un sustantivo?',
            skillId: 1,
        },
        {
            text: "¿Una onomatopeya es una palabra que imita un sonido?",
            skillId: 1,
        },
        {
            text: '¿La palabra "efímero" significa que algo es difícil de apreciar?',
            skillId: 1,
        },
        {
            text: '¿La letra "b" se escribe antes de "m" y "p"?',
            skillId: 2,
        },
        {
            text: '¿"Haber" es un verbo y "a ver" es una expresión?',
            skillId: 2,
        },
        {
            text: '¿La letra "h" se escribe antes de "e" y "i"?',
            skillId: 2,
        },
        {
            text: '¿"Había" y "habían" son formas verbales en singular?',
            skillId: 2,
        },
        {
            text: "¿Los signos de puntuación no tienen importancia en la escritura?",
            skillId: 2,
        },
        {
            text: '¿La letra "c" en español puede representar tres sonidos diferentes?',
            skillId: 2,
        },
        {
            text: "¿Un párrafo es un conjunto de oraciones que tratan sobre un mismo tema?",
            skillId: 3,
        },
        {
            text: "¿Un cuento es una narración extensa?",
            skillId: 3,
        },
        {
            text: "¿El tema de un texto es el mensaje que el autor quiere transmitir?",
            skillId: 3,
        },
        {
            text: "¿La introducción de un texto es la parte inicial que presenta el tema y los objetivos del texto?",
            skillId: 3,
        },
        {
            text: "¿Un cuento tiene una estructura básica que consiste en introducción, desarrollo y desenlace?",
            skillId: 3,
        },
        {
            text: "¿La estructura de un ensayo se compone de una introducción, un desarrollo y las referencias?",
            skillId: 3,
        },
        {
            text: "¿Un cuento y una novela son lo mismo?",
            skillId: 4,
        },
        {
            text: "¿Un texto descriptivo no utiliza adjetivos?",
            skillId: 4,
        },
        {
            text: "¿Una carta formal tiene una estructura y un lenguaje específico?",
            skillId: 4,
        },
        {
            text: "¿Una biografía es la historia de la vida de una persona escrita por otra persona?",
            skillId: 4,
        },
        {
            text: "¿Un poema es un tipo de texto que utiliza versos y estrofas para transmitir emociones y sentimientos?",
            skillId: 4,
        },
        {
            text: "¿Una reseña es un tipo de texto que presenta una crítica o análisis?",
            skillId: 4,
        },
        {
            text: "¿Fue Homero el autor de la Ilíada y la Odisea, dos de las obras más antiguas de la literatura occidental?",
            skillId: 5,
        },
        {
            text: "¿Es Lope de Vega el autor español considerado el padre del teatro español?",
            skillId: 5,
        },
        {
            text: "¿Es William Shakespeare el autor inglés más famoso de la literatura europea y el autor de obras como El Quijote, Don Juan o La Celestina?",
            skillId: 5,
        },
        {
            text: "¿Es Lev Tolstói el autor ruso de obras maestras como Crimen y castigo, Lolita o El maestro y Margarita?",
            skillId: 5,
        },
        {
            text: "¿Fue Alejandro Dumas el autor francés que escribió El principito, Madame Bovary y Los miserables?",
            skillId: 5,
        },
        {
            text: "¿Es Dante Alighieri el autor de la obra La Divina Comedia?",
            skillId: 5,
        },
    ],
});

for (let id = 1; id <= 30; id++) {
    await prisma.answer.createMany({
        data: [
            { text: "Si", questionId: id },
            { text: "No", questionId: id },
        ],
    });
}

console.log("Done!");
