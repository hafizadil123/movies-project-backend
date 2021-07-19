/* eslint-disable max-len */
import { Router } from 'express';
import UsersController from '../controllers/user.controller';
import authenticate from '../middleware/authenticate';
import profile from '../middleware/profile-media';
import errorHandler from '../middleware/error-handler';
import UserController from '../controllers/user.controller';


const users = new Router();

// Users Routes
users.get('/test', (req, res) => {
  res.json({
    message: 'welcome its live now',
  });
});
users.post('/register', UsersController.register);
users.post('/login', UsersController.login);
users.post('/activate-user', UsersController.activateUser);
users.post('/forgot-password', UsersController.forgetPassword);
users.post('/verify-code', UsersController.verifyCode);
users.post('/update-password', UsersController.updatePassword);
users.post('/create-checkout-session', UserController.charge);
users.post('/charge', UserController.chargeFromCustomer);
users.get('/get-movies', UserController.getMovies);

users.use(errorHandler);

export default users;
