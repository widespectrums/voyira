import Joi from 'joi';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const userBaseSchema = {
    firstName: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Name can not be blank!",
        "string.min": "Name should be minimum {#limit} letters!",
        "string.max": "Name should be maximum {#limit} letters!"
    }),
    lastName: Joi.string().min(2).max(50).required(),
    username: Joi.string(),
    email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email!",
    }),
};

export const createUserSchema = Joi.object({
    ...userBaseSchema,
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).messages({
        "string.pattern.base": "Please enter a valid phone number!",
    }),
    password: Joi.string()
        .pattern(passwordRegex)
        .required()
        .messages({
            "string.pattern.base": "The password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        }),
    gender: Joi.string().valid('MAN', 'WOMAN', "OTHER"),
    dateOfBirth: Joi.date().max("now").iso()
});

export const updateUserSchema = Joi.object({
    ...userBaseSchema,
    password: Joi.string().pattern(passwordRegex),
}).min(1).messages({
    "object.min": "At least one field is required for an update."
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const emailVerificationSchema = Joi.object({
    otp: Joi.string().length(6).required()
});