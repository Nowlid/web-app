import { Router } from 'express';
import * as usersController from './Routes/usersController.js';

export const route = (() => {
    const apiRouter = Router();

    apiRouter.route('/register').get(usersController.default.register);
    apiRouter.route('/login').get(usersController.default.login);
    apiRouter.route('/validate/:token').get(usersController.default.validate);

    apiRouter.route('/register').post(usersController.default.createAccount);
    apiRouter.route('/login').post(usersController.default.connectAccount);

    // apiRouter.route('/edit').delete(usersController.default.edit);

    apiRouter.route('/delete').delete(usersController.default.delete);

    return apiRouter;
})()