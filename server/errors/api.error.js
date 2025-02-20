export class ApiError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    };
}

export class ValidationError extends ApiError {
    constructor(message = "Validation Error", details) {
        super(message, 400, details);
    };
}

export class NotFoundError extends ApiError {
    constructor(message = "Resource Not Found") {
        super(message, 404);
    };
}

export class ConflictError extends ApiError {
    constructor(message = "Conflict Occurred") {
        super(message, 409);
    };
}

export class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    };
}

export class ForbiddenError extends ApiError {
    constructor(message = "Forbidden") {
        super(message, 403);
    };
}