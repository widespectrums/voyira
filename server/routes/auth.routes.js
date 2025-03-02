import express from 'express';
import { authController } from "../controller/index.js";
import { validateBody, authValidation } from '../validations/index.js';
import {authRateLimiter} from "../middlewares/ratelimit.middleware.js";
import * as userValidation from "../validations/schemas/user.schema.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";
export * as authValidation from "../validations/schemas/auth.schema.js";

const router = express.Router();

router.post('/initialize-registration',
    authRateLimiter,
    validateBody(authValidation.initializeRegistrationSchema),
    authController.initializeRegistration);


router.post('/resend-verification-email',
    authRateLimiter,
    authMiddleware,
    validateBody(authValidation.resendEmailVerificationSchema),
    authController.resendVerificationEmail);

router.post('/complete-registration',
    authRateLimiter,
    validateBody(authValidation.completeRegistrationSchema),
    authController.completeRegistration);

router.post('/send-forget-password-otp',
    authRateLimiter,
    authMiddleware,
    validateBody(authValidation.sendForgetPasswordOtpSchema),
    authController.sendForgetPasswordOtp);

router.post('/recover-password',
    authRateLimiter,
    authMiddleware,
    validateBody(authValidation.recoverPasswordSchema),
    authController.recoverPassword);

router.post('/login',
    authRateLimiter,
    validateBody(userValidation.loginSchema),
    authController.login);

router.post('/logout', authController.logout);

router.post('/me/email/initialize-change',
    authRateLimiter,
    authMiddleware,
    validateBody(authValidation.initiateEmailChangeSchema),
    authController.initializeEmailChange);

router.post('/me/email/verify',
    authRateLimiter,
    authMiddleware,
    validateBody(authValidation.verifyEmailChangeSchema),
    authController.verifyEmailChange);

export default router;
