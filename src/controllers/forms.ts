import express from 'express';

import { createNewForm, getFormByName, getForms, getFormById, deleteFormById } from '../models/forms';

export const getAllForms = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getForms();

        return res.status(200).json(users);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
export const newForm = async (req: express.Request, res: express.Response) => {
    try {
        console.log(req.body);

        const { formname, formtype, formcategory } = req.body;
        console.log(formname, formtype, formcategory);
        if (!formname || !formtype || !formcategory) {

            return res.sendStatus(400);
        }

        const existingForm = await getFormByName(formname);
        console.log("existing form:" + existingForm);
        if (existingForm) {
            return res.sendStatus(400);
        }

        const form = await createNewForm({
            formname: formname,
            formtype: formtype,
            formcategory: formcategory
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

        if(!id)
        {
            // res.sendStatus(400);
            return res.status(400).send({message: "ID not present"});
        }

        console.log(id, updateFormBody?.formname, updateFormBody?.formtype, updateFormBody?.formcategory);
        if (!updateFormBody?.formname || !updateFormBody?.formtype || !updateFormBody?.formcategory) {
            return res.status(400).send({message: "missing parameters"});
        }

        const form = await getFormById(id);
        console.log(form);
        if (form) {
            form.formname = updateFormBody.formname;
            form.formtype = updateFormBody.formtype;
            form.formcategory = updateFormBody.formcategory;
            await form?.save();
            return res.status(200).json(form).end();
        }
        return res.sendStatus(400);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
export const deleteForm  = async (req:express.Request, res: express.Response) => {
    try{
        const { id } = req.params;
        const deleteUser = await deleteFormById(id);

        return res.json(deleteUser);

    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
} 