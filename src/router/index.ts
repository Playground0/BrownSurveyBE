import express from 'express';
import authentication from './authentication';
import users from './users';
import forms from './forms';
import misc from './miscellaneous';

const router = express.Router();

export default () : express.Router => {
    authentication(router);
    users(router);
    forms(router);
    misc(router);
    return router;
}