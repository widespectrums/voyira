import express from 'express';
import { validateBody } from '../../../core/validations/validator.js';
import { authRateLimiter } from "../../../core/milddlewares/ratelimit.middleware.js";
import * as userValidation from "../../../core/validations/schemas/user.schema.js";
import * as authValidation from "../../../core/validations/schemas/auth.schema.js";
import AuthController from "../controllers/auth.controller.js";
import {authMiddleware} from "../../../core/milddlewares/auth.middleware.js";

const authController = new AuthController();
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

router.post('/send-forget-password-otp',
    authRateLimiter,
    validateBody(authValidation.sendForgetPasswordOtpSchema),
    authController.sendForgetPasswordOtp);

router.post('/recover-password',
    authRateLimiter,
    validateBody(authValidation.recoverPasswordSchema),
    authController.recoverPassword);

router.post('/login',
    authRateLimiter,
    validateBody(userValidation.loginSchema),
    authController.login);

router.post('/logout', authController.logout);

router.post('/me/email/initialize-change',
    authRateLimiter,
    authMiddleware(),
    validateBody(authValidation.initiateEmailChangeSchema),
    authController.initializeEmailChange);

router.post('/me/email/verify',
    authRateLimiter,
    authMiddleware(),
    validateBody(authValidation.verifyEmailChangeSchema),
    authController.verifyEmailChange);

export default router;
