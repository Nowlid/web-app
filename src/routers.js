import { Router } from 'express';
import * as usersController from './Routes/usersController.js';

export const userRoute = (() => {
    const apiRouter = Router();

    apiRouter.route('/register').get(usersController.default.register)
    apiRouter.route('/login').get(usersController.default.login);
    apiRouter.route('/delete').get(usersController.default.delete);
    apiRouter.route('/').get(usersController.default.user);
    
    apiRouter.route('/register').post(usersController.default.createAccount);
    apiRouter.route('/login').post(usersController.default.connectAccount);
    apiRouter.route('/validate').post(usersController.default.validate);

    // apiRouter.route('/edit').delete(usersController.default.edit);

    apiRouter.route('/delete/:token').get(usersController.default.deleteConfirm);
    apiRouter.route('/logout').get(usersController.default.logoutAccount);

    return apiRouter;
})()