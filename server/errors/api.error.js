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
