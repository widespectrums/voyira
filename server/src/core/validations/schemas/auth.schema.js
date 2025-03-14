import Joi from 'joi';
import {emailVerificationSchema} from "./user.schema.js";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const initializeRegistrationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email!",
    }),
});

export const completeRegistrationSchema = initializeRegistrationSchema.keys({
    firstName: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Name can not be blank!",
        "string.min": "Name should be minimum {#limit} letters!",
        "string.max": "Name should be maximum {#limit} letters!"
    }),
    lastName: Joi.string().min(2).max(50).required(),
    password: Joi.string()
        .pattern(passwordRegex)
        .required()
        .messages({
            "string.pattern.base": "The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        }),
    emailVerifyOtp: Joi.string().min(6).max(6).required()
});

export const resendEmailVerificationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email!",
    }),
});

export const sendForgetPasswordOtpSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email!",
    }),
});

export const recoverPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email!",
    }),
    forgetPasswordOtp: Joi.string().min(6).max(6).required(),
    password: Joi.string()
        .pattern(passwordRegex)
        .required()
        .messages({
            "string.pattern.base": "The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        }),
});

export const initiateEmailChangeSchema = Joi.object({
    newEmail: Joi.string().email().required()
});

export const verifyEmailChangeSchema = Joi.object({
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required()
});