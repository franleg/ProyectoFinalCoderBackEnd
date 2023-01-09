import { Router } from 'express';
import { uploader } from '../utils.js';
import passport from 'passport';
import sessionsController from '../controllers/sessions.controller.js';

const router = Router();

// REGISTER
router.post('/register', uploader.single('avatar'), passport.authenticate('register', {failureRedirect: '/api/sessions/registerfail', failureFlash: true}), sessionsController.register);

// LOGIN
router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/loginfail', failureFlash: true}), sessionsController.login);

// REGISTER FAIL
router.get('/registerfail', sessionsController.registerFail);

// LOGIN FAIL
router.get('/loginfail', sessionsController.loginFail);
export default router;