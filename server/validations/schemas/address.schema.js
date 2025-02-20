import Joi from "joi";
import {idSchema, timestampSchema} from "./base.schema.js";

export const addressBaseSchema = {
    addressTitle: Joi.string().min(3).max(50).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    country: Joi.string().max(100),
    city: Joi.string().max(100),
    district: Joi.string().max(100),
    neighborhood: Joi.string().max(200),
    street: Joi.string().max(255),
    addressLine: Joi.string().max(600).required(),
};

export const createAddressSchema = Joi.object({
    ...addressBaseSchema,
    userId: idSchema.required(),
}); //.concat(timestampSchema);

export const updateAddressSchema = Joi.object({
    ...addressBaseSchema,
    userId: idSchema
}).min(1);