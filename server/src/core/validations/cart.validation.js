import Joi from "joi";

export const cartValidation = {
    addItem: Joi.object({
        productId: Joi.string().uuid().required().messages({
            "string.uuid": "Product ID must be a valid UUID",
            "any.required": "Product ID is required"
        }),
        quantity: Joi.number().integer().min(1).default(1).messages({
            "number.base": "Quantity must be a number",
            "number.integer": "Quantity must be an integer",
            "number.min": "Quantity must be at least 1"
        }),
        colorId: Joi.string().uuid().allow(null).messages({
            "string.uuid": "Color ID must be a valid UUID"
        }),
        sizeId: Joi.string().uuid().allow(null).messages({
            "string.uuid": "Size ID must be a valid UUID"
        })
    }),

    updateQuantity: Joi.object({
        quantity: Joi.number().integer().min(1).required().messages({
            "number.base": "Quantity must be a number",
            "number.integer": "Quantity must be an integer",
            "number.min": "Quantity must be at least 1",
            "any.required": "Quantity is required"
        })
    }),

    setShippingMethod: Joi.object({
        shippingMethodId: Joi.string().uuid().required().messages({
            "string.uuid": "Shipping method ID must be a valid UUID",
            "any.required": "Shipping method ID is required"
        })
    })
};