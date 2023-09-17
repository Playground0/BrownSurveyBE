import mongoose from "mongoose";

export class SubmitUser  {
    "st_userId" : string;
    "st_username": string;
}
export class Question {
    "qs_title": string;
    "qs_type_Id":string;
    "qs_options": Option | undefined | null;
}

export class Option {
    "option1": string;
    "option2": string;
    "option3": string;
    "option4": string;
    "answer1":string;
    "answer2":string;
}

const FormSchema = new mongoose.Schema({
    fm_userId: {type: String, required: true},
    fm_username: {type: String, required: true},
    fm_category_Id: {type: String, required: true},
    fm_type: {type: String, required: true},
    fm_title: {type: String, required: true},
    fm_status: {type: String, required: true},
    fm_stage: {type: String, required: true},
    fm_submit_count: String,
    fm_created_date: {type: String, required: true},
    fm_expiry_date: {type: String, required: true},
    fm_expired: {type: Boolean, required: true},
    fm_submit_users: [],
    fm_questions: []
});

const FormAnswerSchema = new mongoose.Schema({
    sbt_userId: {type: String, required: true},
    sbt_username: {type: String, required: true},
    sbt_fm_id:{type: String, required: true},
    sbt_fm_name: {type: String, required: true},
    sbt_category: {type: String, required: true},
    sbt_type: {type: String, required: true},
    sbt_submitted_date: {type: String, required: true},
    sbt_fm_questions : [],
});

export const FormModel = mongoose.model('Form', FormSchema);
export const FormAnswerModel = mongoose.model('FormAnswer', FormAnswerSchema);

export const getForms = () => FormModel.find().sort({ _id: -1 });
export const createNewForm = (values: Record<string, any>) => new FormModel(values).save().then((form) => form.toObject());
export const getFormByName = (formName:string) => FormModel.findOne({fm_title:formName});
export const getFormById = (id:string) => FormModel.findById(id);
export const deleteFormById = (id:string) => FormModel.findOneAndDelete({_id:id});
export const submitFormAnswer = (values: Record<string,any>) => new FormAnswerModel(values).save().then(((form) => form.toObject()));