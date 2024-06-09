import express from 'express';
import authController from './auth.controller';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/signup/google', authController.signUpWithGoogle);
router.post('/login/google', authController.loginWithGoogle);
router.post('/signup/apple', authController.signUpWithApple);
router.post('/login/apple', authController.loginWithApple);

export default router;
