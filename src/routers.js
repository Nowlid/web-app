import { Router } from 'express';
import * as usersController from './Routes/usersController.js';

export const route = (() => {
    const apiRouter = Router();

    apiRouter.route('/register').get(usersController.default.register);
    apiRouter.route('/login').get(usersController.default.login);

    apiRouter.route('/register').post(usersController.default.createAccount);
    apiRouter.route('/login').post(usersController.default.connectAccount);

    return apiRouter;
})()