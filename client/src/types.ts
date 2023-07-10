export interface ISkill {
    id: number,
    name: string,
    questions: IQuestion[]
    status: 'DRAFT' | 'LIVE'
}

export interface IQuestion {
    id: number,
    text: string
    answers: Answer[]
}


export interface Answer {
    id: number,
    text: string
}

export interface Submit {
    id: number,
    user: string,
    question: IQuestion
    answer: Answer
}
