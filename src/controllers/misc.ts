import express from 'express';
import { getContributorsList } from '../models/admin_configurations';

export const getContributorsListForUI = async (req: express.Request, res: express.Response) => {
    try{
        const contributorsList = await getContributorsList();
        return res.status(200).json(contributorsList);
    }
    catch(error){
        console.log(error);
        return res.sendStatus(400); 
    }
}