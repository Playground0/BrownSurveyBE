import express from 'express';
import { deleteForm, getAllForms, newForm, updateForm, getFormDetails, titleAuthentication, getFormConfiguration, newFormAnswer, getTrendingForm, updateStatus } from '../controllers/forms';


export default (router: express.Router) => {
    router.get('/forms/getAll',getAllForms);
    router.get('/forms/:formType/getAll',getAllForms);
    router.get('/forms/getTrendingForm',getTrendingForm);
    router.post('/forms/new',newForm);
    router.get('/forms/titleAuthentication/:title/:category/:type',titleAuthentication);
    router.get('/forms/admin/:formType/:configuratioName',getFormConfiguration);
    router.post('/forms/submitAnswer',newFormAnswer);
    router.patch('/forms/udpateStatus/:formId/:status',updateStatus);
    router.route('/forms/:id')
    .get(getFormDetails)
    .patch(updateForm)
    .delete(deleteForm);
};