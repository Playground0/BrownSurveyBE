import express from 'express';

import { deleteUser, getAllUsers, getAnalyticsData, getUserDetails, getUserForms, getUserRoles, updateUser} from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';


export default (router: express.Router) => {
    router.get('/users',isAuthenticated, getAllUsers);
    router.delete('/users/:id',isAuthenticated, isOwner, deleteUser);
    router.patch('/users/:id', updateUser);
    router.get('/users/:userId', getUserDetails);
    router.get('/users/forms/:userId/:drafted', getUserForms);
    router.get('/users/forms/get/analytics/:userId',getAnalyticsData);
    router.get('/users/get/Roles',getUserRoles);
};