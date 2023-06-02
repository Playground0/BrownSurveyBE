import express from 'express';
import { deleteForm, getAllForms, newForm, updateForm, getFormDetails } from '../controllers/forms';


export default (router: express.Router) => {
    router.get('/forms/getAll',getAllForms);
    router.post('/forms/new',newForm);
    router.get('/forms/:id',getFormDetails);
    router.patch('/forms/:id',updateForm);
    router.delete('/forms/:id',deleteForm);
};