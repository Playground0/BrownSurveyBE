export interface FormUIModel {
    Id: string | null
    userID: string,
    userName: string,
    formTitle: string,
    formType: string,
    formCategory: string,
    formStatus: string,
    formStage: string,
    formCreationDate: string,
    formExpirydate: string,
    formQuestions: FormQuestions[]
}
export interface FormAnswerModel {
    Id: string | null
    userID: string,
    userName: string,
    formId:string,
    formTitle: string,
    formCategory: string,
    formType: string,
    SubmitDate: string,
    formAnswer: Answers[],
    name:string,
    email:string,
    age: string,
    location: string
}
export interface Answers{
    question: string,
    type: string,
    options:QuestionOptions | undefined | null
    Answer1: string,
    Answer2: string
}
export interface FormQuestions{
    question : string,
    type: string,
    options: QuestionOptions | undefined | null
}
export class QuestionOptions {
    "option1": string;
    "option2": string;
    "option3": string;
    "option4": string;
    "answer1":string;
    "answer2":string;
}
export interface ShowFormOnHome{
    Id: string | null,
    formType: string,
    formTitle: string,
    userID: string,
    userCount: string,
    createdOn: string,
    createdBy: string
}