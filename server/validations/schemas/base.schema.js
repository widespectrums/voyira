import Joi from 'joi';

export const idSchema = Joi.string().guid({
    version: ["uuidv4"]
}).messages({
    "string.guid": "Invalid UUID format!",
    "any.required": "ID is required!"
});

export const timestampSchema = Joi.date().iso().messages({
    "date.base": "Invalid date format!",
    "date.isoDate": "Require ISO 8601 date format!"
});