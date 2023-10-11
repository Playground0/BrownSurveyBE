import express from 'express';

import { deleteUserById, getUserById, getUsers } from '../models/users';
import { getFormByUser } from '../models/forms';
import { ShowDraftedForms, ShowFormsOnDashboard } from '../models/UIModels/forms';
import { UserAnalytics } from '../models/UIModels/User';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const deleteUser = await deleteUserById(id);

        return res.json(deleteUser);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const userInfo = req.body;

        if (!id) {
            res.sendStatus(400);
        }

        const user = await getUserById(id);
        if (user) {
            user.username = userInfo.username;
            user.fullname = userInfo.fullname;
            user.email = userInfo.email;
            user.phonenumber = userInfo.phonenumber;
            user.location = userInfo.location;
            user.age = userInfo.age;
            await user?.save();
            return res.status(200).json(user).end();
        }
        return res.sendStatus(400);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
export const getUserDetails = async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;
    if (!userId) {
        let response = {
            Action: "User Details",
            ActionStatus: "Failed - Wrong Request",
            Response: ""
        }
        return res.status(400).json(response);
    }
    try {
        const userDetails = await getUserById(userId);
        if (!userDetails) {
            let response = {
                Action: "User Details",
                ActionStatus: "Failed - No Details found",
                Response: ""
            }
            return res.status(400).json(response);
        }
        return res.status(200).json(userDetails);
    }
    catch (err) {
        let response = {
            Action: "User Details",
            ActionStatus: "Failed - Something went wrong",
            Response: ""
        }
        return res.status(400).json(response);
    }
}
export const getUserForms = async (req: express.Request, res: express.Response) => {
    const { userId, drafted } = req.params;
    console.log(drafted)
    if (!userId) {
        let response = {
            Action: "Get User Form Details",
            ActionStatus: "Failed - Wrong Request",
            Response: ""
        }
        return res.status(400).json(response);
    }
    try {
        const userDetails: any[] = await getFormByUser(userId);
        if (!userDetails.length) {
            let response = {
                Action: "Get User Form Details",
                ActionStatus: "Failed - No Details found",
                Response: ""
            }
            return res.status(400).json(response);
        }
        let returnForms: ShowFormsOnDashboard[] = mapFormResponses(userDetails);
        if(drafted === "Y"){
            returnForms = returnForms.filter((ele) => ele.status === "Draft");
            console.log(returnForms);
            let newDraftedForms: ShowDraftedForms[] = mapDraftedFormResponses(returnForms);
            console.log(newDraftedForms);
            return res.status(200).json(newDraftedForms);
        }
        else{
            return res.status(200).json(returnForms);
        }
    }
    catch (err) {
        let response = {
            Action: "Get User Form Details",
            ActionStatus: "Failed - Something went wrong",
            Response: ""
        }
        return res.status(400).json(response);
    }
}
export const getAnalyticsData = async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;
    if (!userId) {
        let response = {
            Action: "Get User Form Analytics",
            ActionStatus: "Failed - Wrong Request",
            Response: ""
        }
        return res.status(400).json(response);
    }
    try {
        const userDetails: any[] = await getFormByUser(userId);
        if (!userDetails.length) {
            let response = {
                Action: "Get User Form Analytics",
                ActionStatus: "Success - No Details found",
                Response: ""
            }
            return res.status(201).json(response);
        }

        const returnForms: ShowFormsOnDashboard[] = mapFormResponses(userDetails);
        let response: UserAnalytics = {
            formsCreated: returnForms.length,
            responses: getResponses(returnForms),
            activeForms: returnForms.filter((ele: ShowFormsOnDashboard) => ele.status === "Public").length,
            currenPlan: "Basic"
        }
        return res.status(200).json(response);
    }
    catch (err) {
        let response = {
            Action: "Get User Form Analytics",
            ActionStatus: "Failed - Something went wrong",
            Response: ""
        }
        return res.status(400).json(response);
    }
}
export const getDraftedForms = async (req: express.Request, res: express.Response) => {
    let {userId} = req.params;

}
function getResponses(forms: ShowFormsOnDashboard[]) {
    let responseCount = 0;
    forms.forEach((ele: ShowFormsOnDashboard) => responseCount = responseCount + ele.participants);
    return responseCount;
}
function mapFormResponses(userDetails: any[]) {
    return userDetails.map((elem) => {
        return {
            Id: elem._id,
            formname: elem.fm_title,
            type: elem.fm_type,
            participants: elem.fm_submit_users.length,
            status: elem.fm_status,
            startDate: elem.fm_created_date,
            endDate: elem.fm_expiry_date
        }
    });
}
function mapDraftedFormResponses(userDetails: any[]) {
    return userDetails.map((elem) => {
        return {
            Id: elem.Id,
            formname: elem.formname,
            type: elem.type,
            startDate: elem.startDate,
        }
    });
}