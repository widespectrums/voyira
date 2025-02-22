import express from 'express';
import { authController } from "../controller/index.js";
import { validateBody, authValidation } from '../validations/index.js';
import {authRateLimiter} from "../middlewares/ratelimit.middleware.js";
import * as userValidation from "../validations/schemas/user.schema.js";

const router = express.Router();

router.post('/initialize-registration',
    authRateLimiter,
    validateBody(authValidation.initializeRegistrationSchema),
    authController.initializeRegistration);


router.post('/resend-verification-email',
    authRateLimiter,
    validateBody(authValidation.resendEmailVerificationSchema),
    authController.resendVerificationEmail);

router.post('/complete-registration',
    authRateLimiter,
    validateBody(authValidation.completeRegistrationSchema),
    authController.completeRegistration);

router.post('/login',
    authRateLimiter,
    validateBody(userValidation.loginSchema),
    authController.login);

router.post('/logout', authController.logout);

export default router;
