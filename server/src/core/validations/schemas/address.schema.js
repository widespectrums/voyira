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
    fullAddress: Joi.string().max(600).required(),
};

export const createAddressSchema = Joi.object({
    ...addressBaseSchema,
});

export const updateAddressSchema = Joi.object({
    addressTitle: Joi.string().min(3).max(50),
    firstName: Joi.string().min(2).max(50),
    lastName: Joi.string().min(2).max(50),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    country: Joi.string().max(100),
    city: Joi.string().max(100),
    district: Joi.string().max(100),
    neighborhood: Joi.string().max(200),
    fullAddress: Joi.string().max(600),
}).min(1);