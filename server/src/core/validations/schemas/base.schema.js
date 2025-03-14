import Joi from 'joi';

export const idSchema = Joi.object({
    addressId: Joi.string().guid({ version: ["uuidv4"] }).required()
}).messages({
    "string.guid": "Invalid UUID format!",
    "any.required": "ID is required!"
});

export const timestampSchema = Joi.date().iso().messages({
    "date.base": "Invalid date format!",
    "date.isoDate": "Require ISO 8601 date format!"
});