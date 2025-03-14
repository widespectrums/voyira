import {ValidationError} from "../errors/api.error.js";

const validate = (schema, data, options = {}) => {
    const {error, value} = schema.validate(data, {
        abortEarly: false,
        allowUnknown: false,
        ...options
    });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path.join("."),
            message: detail.message
        }));
        throw new ValidationError("Validation Error", errors);
    }
    return value;
};

export const validateBody = (schema) => (req, res, next) => {
    try {
        req.body = validate(schema, req.body);
        next();
    } catch (error) {
        next(error);
    }
};

export const validateParams = (schema) => (req, res, next) => {
    try {
        req.params = validate(schema, req.params);
        next();
    } catch (error) {
        next(error);
    }
};

export const validateQuery = (schema) => (req, res, next) => {
    try {
        req.query = validate(schema, req.query);
        next();
    } catch (error) {
        next(error);
    }
};