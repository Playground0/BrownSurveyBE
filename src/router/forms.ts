import express from 'express';
import { deleteForm, getAllForms, newForm, updateForm, getFormDetails, titleAuthentication, getFormConfiguration } from '../controllers/forms';


export default (router: express.Router) => {
    router.get('/forms/getAll',getAllForms);
    router.post('/forms/new',newForm);
    router.get('/forms/titleAuthentication/:title',titleAuthentication);
    router.get('/forms/admin/:formType/:configuratioName',getFormConfiguration);
    router.route('/forms/:id')
    .get(getFormDetails)
    .patch(updateForm)
    .delete(deleteForm);
};