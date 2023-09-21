import express from 'express';
import { createUser, getUserByEmail, getUserById } from '../models/users'
import { authentication, random } from '../helpers/index';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        
        if (!user) {
            return res.status(400).json({
                Action: "Login",
                Action_Status: "LOGIN FAILED - USER NOT FOUND",
            });
        }

        if (!user.authentication?.salt) {
            return res.status(403).json({
                Action: "Login",
                Action_Status: "LOGIN FAILED - AUTHENTICATION FAILED"
            });
        }
        const expectedHash = authentication(user?.authentication?.salt, password);

        if (user.authentication.password !== expectedHash) {
            return res.status(403).json({
                Action: "Login",
                Action_Status: "LOGIN FAILED - PASSWORD DID NOT MATCH"
            });
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        // res.cookie('BS-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });
        let returnObj = {
            Action: "Login",
            Action_Status: "SUCCESS",
            Response: {
                id: user._id,
                email: user.email,
                username: user.username,
                sessionToken: user.authentication.sessionToken
            }
        }
        return res.status(200).json(returnObj).end();


    } catch (error) {
        console.log(error);
        res.status(400).json({
            Action: "Login",
            Action_Status: "SOMETHING WENT WRONG"
        });
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({
                Action: "Login",
                Action_Status: "Sign Up FAILED - Missing Information",
            });
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(403).json({
                Action: "Login",
                Action_Status: "Sign Up FAILED - USER Exists",
            });
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });
        return res.status(200).json({
            Action: "Login",
            Action_Status: "Sign Up FAILED - USER Exists",
            Response: {
                username: user.username,
                email: user.email
            }
        }).end();

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            Action: "Login",
            Action_Status: "Sign Up FAILED - Something went wrong!",
        });;
    }
}

export const logout = async (req:express.Request,res: express.Response) => {
    try{
    const { id } = req.params;
    const { email } = req.body;
    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    if (!user) {
        return res.status(400).json({
            Action: "Log Out",
            Action_Status: "LOGOUT FAILED - USER NOT FOUND",
        });
    }
    if (!user.authentication?.salt) {
        return res.status(403).json({
            Action: "Log Out",
            Action_Status: "LOGOUT FAILED - AUTHENTICATION FAILED"
        });
    }
    if(user.email !== email){
        return res.status(403).json({
            Action: "Log Out",
            Action_Status: "LOGOUT FAILED - AUTHENTICATION FAILED"
        });
    }
    user.authentication.sessionToken = "";
    user.save();

    let returnObj = {
        Action: "Log Out",
        Action_Status: "SUCCESS",
        Response: {
            email: user.email,
            username: user.username
        }
    }
    return res.status(200).json(returnObj).end();

    }catch (error) {
        console.log(error);
        res.status(400).json({
            Action: "Login",
            Action_Status: "SOMETHING WENT WRONG"
        });
    }
}