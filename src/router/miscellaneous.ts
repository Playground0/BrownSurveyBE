import express from 'express';
import { getContributorsListForUI } from '../controllers/misc';

export default (router: express.Router) => {
    router.get('/misc/contributorsList', getContributorsListForUI);
};