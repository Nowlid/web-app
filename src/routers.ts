import { Router } from 'express';

import * as usersController from './Routes/usersController';

export const userRoute = ((): Router => {
  const apiRouter = Router();

  apiRouter.route('/register').get(usersController.register);
  apiRouter.route('/login').get(usersController.login);
  apiRouter.route('/delete').get(usersController.delete_);
  apiRouter.route('/').get(usersController.user);

  apiRouter.route('/register').post(usersController.createAccount);
  apiRouter.route('/login').post(usersController.connectAccount);
  apiRouter.route('/validate').post(usersController.validate);

  // apiRouter.route('/edit').delete(usersController.default.edit);

  apiRouter.route('/delete/:token').get(usersController.deleteConfirm);
  apiRouter.route('/logout').get(usersController.logoutAccount);

  return apiRouter;
})();
