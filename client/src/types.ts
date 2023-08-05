export interface ISkill {
  id: number;
  name: string;
  questions: IQuestion[];
  status: "DRAFT" | "LIVE";
}

export interface IQuestion {
  id: number;
  text: string;
  answers: IAnswer[];
  skill: ISkill;
}

export interface IAnswer {
  id: number;
  text: string;
  question: IQuestion;
}

export interface ISubmit {
  userId: string;
  answer: IAnswer;
}
