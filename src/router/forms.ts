import express from 'express';
import { deleteForm, getAllForms, newForm, updateForm } from '../controllers/forms';


export default (router: express.Router) => {
    router.get('/forms/getForms',getAllForms);
    router.post('/forms/new',newForm);
    router.patch('/forms/:id',updateForm);
    router.delete('/forms/:id',deleteForm)
};