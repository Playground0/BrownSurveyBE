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
}
export interface ShowFormOnHome{
    Id: string | null,
    formType: string,
    formTitle: string,
    userID: string,
}