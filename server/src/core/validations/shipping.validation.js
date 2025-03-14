import Joi from "joi";

export const shippingValidation = {
    createMethod: Joi.object({
        name: Joi.string().max(100).required().messages({
            "string.base": "Name must be a string",
            "string.max": "Name cannot exceed 100 characters",
            "any.required": "Name is required"
        }),
        description: Joi.string().max(255).allow(null, '').messages({
            "string.base": "Description must be a string",
            "string.max": "Description cannot exceed 255 characters"
        }),
        baseFee: Joi.number().min(0).default(0).messages({
            "number.base": "Base fee must be a number",
            "number.min": "Base fee cannot be negative"
        }),
        freeShippingThreshold: Joi.number().min(0).allow(null).messages({
            "number.base": "Free shipping threshold must be a number",
            "number.min": "Free shipping threshold cannot be negative"
        }),
        providerCode: Joi.string().max(50).allow(null, '').messages({
            "string.base": "Provider code must be a string",
            "string.max": "Provider code cannot exceed 50 characters"
        })
    }),

    updateThreshold: Joi.object({
        threshold: Joi.number().min(0).allow(null).required().messages({
            "number.base": "Threshold must be a number",
            "number.min": "Threshold cannot be negative",
            "any.required": "Threshold is required"
        })
    }),

    updateFee: Joi.object({
        baseFee: Joi.number().min(0).required().messages({
            "number.base": "Base fee must be a number",
            "number.min": "Base fee cannot be negative",
            "any.required": "Base fee is required"
        })
    })
};