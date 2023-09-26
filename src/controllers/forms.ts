import express from 'express';

import { createNewForm, getFormByName, getForms, getFormById, deleteFormById, Question, SubmitUser, Option, submitFormAnswer } from '../models/forms';
import { FormAnswerModel, FormQuestions, FormUIModel, QuestionOptions, ShowFormOnHome } from '../models/UIModels/forms'
import { getConfigurationByType } from '../models/admin_configurations';

export const getAllForms = async (req: express.Request, res: express.Response) => {
    try {
        const { formType } = req.params;
        let allForm: any[] = await getForms();
        if(formType){
            allForm = allForm.filter((ele) => ele.fm_type === formType && ele.fm_status === "Public");
        }
        const returnForms: ShowFormOnHome[] = allForm.map((elem) => {
            return {
                Id: elem._id,
                formType: elem.fm_type,
                formTitle: elem.fm_title,
                userID: elem.fm_userId,
                userCount: elem.fm_submit_users.length,
                createdOn: elem.fm_created_date,
                createdBy: elem.fm_username
            }
        });

        return res.status(200).json(returnForms);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
export const getFormDetails = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const form : any = await getFormById(id);
        const convertedForm = form ? mapFormDetails(form) : {};
        return res.status(200).json(convertedForm);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
export const newForm = async (req: express.Request, res: express.Response) => {
    try {
        const formModel: FormUIModel = req.body;
        if (!formModel.formTitle || !formModel.formType || !formModel.formCategory) {
            return res.sendStatus(400);
        }
        const form = await createNewForm({
            fm_userId: formModel.userID,
            fm_username: formModel.userName,
            fm_category_Id: formModel.formCategory,
            fm_type: formModel.formType,
            fm_title: formModel.formTitle,
            fm_status: formModel.formStatus,
            fm_stage: formModel.formStage,
            fm_submit_count: "0",
            fm_created_date: formModel.formCreationDate,
            fm_expiry_date: formModel.formExpirydate,
            fm_expired: false,
            fm_submit_users: [],
            fm_questions: mapFormQuestionForDB(formModel.formQuestions)
        });
        return res.status(200).json(form).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
export const updateForm = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const updateFormBody = req.body;

        if (!id) {
            return res.status(400).send({ message: "ID not present" });
        }

        console.log(id, updateFormBody?.formTitle, updateFormBody?.formType, updateFormBody?.formCategory);
        if (!updateFormBody?.formTitle || !updateFormBody?.formType || !updateFormBody?.formCategory) {
            return res.status(400).send({ message: "missing parameters" });
        }

        const form = await getFormById(id);
        if (form) {
            await form?.save();
            return res.status(200).json(form).end();
        }
        return res.sendStatus(400);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
export const deleteForm = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const deleteUser = await deleteFormById(id);
        let responseBody = {
            fm_id: id,
            form: deleteUser,
            fm_action: "DELETE",
            fm_action_status: "SUCCED"
        }
        return res.status(200).json(responseBody).end();

    } catch (error) {
        console.log(error);
        let responseBody = {
            fm_id: id,
            form: "",
            fm_action: "DELETE",
            fm_action_status: "FAILED"
        }
        return res.status(400).json(responseBody).end();
    }
}
export const titleAuthentication = async (req: express.Request, res: express.Response) => {
    const { title } = req.params;
    try {
        const existingForm = await getFormByName(title);
        let reponse = {
            Match: existingForm ? true : false,
            Action: "CHECK_TITLE_MATCH",
            Status: "SUCCED"
        }
        return res.status(200).json(reponse).end();
    } catch (error) {
        return res.status(400).json(
            {
                Match: "",
                Action: "CHECK_TITLE_MATCH",
                Status: "FAILED"
            }
        ).end();;
    }
}
export const getFormConfiguration = async (req: express.Request, res:express.Response) => {
    let { formType, configuratioName } = req.params;
    try{
        let values = await getConfigurationByType(configuratioName);
        let collections : any[] | undefined = values?.collections;
        if(!collections){
            return res.status(200).json(values?.collections);
        }
        const convertedCollections = checkForQuestionTypes(configuratioName,collections,formType);
        return res.status(200).json(convertedCollections);
        
    }catch(error){
        return res.sendStatus(400);
    }
}
export const newFormAnswer = async (req: express.Request, res:express.Response) => {
    try {
        const formModel: FormAnswerModel = req.body;
        console.log(formModel)
        const form = await submitFormAnswer({
            sbt_userId: formModel.userID,
            sbt_username: formModel.userName,
            sbt_fm_id: formModel.formId,
            sbt_fm_name: formModel.formTitle,
            sbt_category: formModel.formCategory,
            sbt_type: formModel.formType,
            sbt_submitted_date: formModel.SubmitDate,
            sbt_fm_questions : formModel.formAnswer,
            sbt_res_name: formModel.name,
            sbt_res_email: formModel.email,
            sbt_res_age: formModel.age,
            sbt_res_location: formModel.location
        });
        let updateForm: any = await getFormById(formModel.formId);
        updateForm.fm_submit_users.push({
            st_userId:form.sbt_userId,
			st_username: form.sbt_username 
        });
        updateForm.fm_submit_count = Number(updateForm.fm_submit_count) + 1;
        updateForm.save();

        return res.status(200).json({
            Id : formModel.formId,
            FormName: formModel.formTitle,
            Action: "FORM_SUBMIT",
            ActionStatus: "SUCCED"
        }).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
export const getTrendingForm = async (req:express.Request, res:express.Response) => {
    try {
        let allForm: any[] = await getForms();
        let totalCount = 0;
        let returnForms: ShowFormOnHome | null = null;
        let trendingObject: any;
        allForm.forEach((ele) => {
            if(ele.fm_submit_count > totalCount){
                totalCount = ele.fm_submit_count;
                trendingObject = ele;
            }
        });
        returnForms = {
            Id: trendingObject._id,
            formType: trendingObject.fm_type,
            formTitle: trendingObject.fm_title,
            userID: trendingObject.fm_userId,
            userCount: trendingObject.fm_submit_users.length,
            createdOn: trendingObject.fm_created_date,
            createdBy: trendingObject.fm_username
        }
        return res.status(200).json(returnForms);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
function checkForQuestionTypes(configuratioName:string,collections: any[],formType:string) : any[]{
    if(configuratioName !== "Question Types"){
        return collections;
    }
    return collections.filter((ele) => ele.formType.includes(formType));
}
function mapFormDetails(form: any): FormUIModel {
    return {
        Id: form._id,
        userID: form.fm_userId,
        userName: form.fm_username,
        formTitle: form.fm_title,
        formType: form.fm_type,
        formCategory: form.fm_category_Id,
        formStatus: form.fm_status,
        formStage: form.fm_stage,
        formCreationDate: form.fm_created_date,
        formExpirydate: form.fm_expiry_date,
        formQuestions: mapFormQuestionForUI(form.fm_questions)
    }
}
function mapFormQuestionForDB(formQuestions: FormQuestions[]): Question[] {
    return formQuestions.map((ele: FormQuestions) => {
        return {
            qs_title: ele?.question,
            qs_options: mapOptionsForDB(ele?.options),
            qs_type_Id: ele.type
        }
    });
}
function mapFormQuestionForUI(formQuestions: Question[]): FormQuestions[] {
    return formQuestions.map((ele: Question) => {
        return {
            question: ele.qs_title,
            options: mapOptionsForUI(ele.qs_options),
            type: ele.qs_type_Id.toString(),
        }
    });
}
function mapOptionsForDB(formOption: QuestionOptions | undefined | null) : Option | undefined | null{
    if(!formOption){
        return null;
    }
    return {
        option1: formOption.option1,
        option2: formOption.option2,
        option3: formOption.option3,
        option4: formOption.option4,
        answer1: formOption.answer1,
        answer2: formOption.answer2
    }
}
function mapOptionsForUI(formOption: Option | undefined | null) : QuestionOptions | undefined | null{
    if(!formOption){
        return null;
    }
    return {
        option1: formOption.option1,
        option2: formOption.option2,
        option3: formOption.option3,
        option4: formOption.option4,
        answer1: formOption.answer1,
        answer2: formOption.answer2
    }
}
