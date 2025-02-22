import express from 'express';
import { authController } from "../controller/index.js";
import { userValidation, validateBody } from '../validations/index.js';
import {authRateLimiter} from "../middlewares/ratelimit.middleware.js";

const router = express.Router();

router.post('/register',
    validateBody(userValidation.createUserSchema),
    authController.register);

router.post('/login',
    authRateLimiter,
    validateBody(userValidation.loginSchema),
    authController.login);

router.post('/logout', authController.logout);

export default router;
