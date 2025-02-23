export default class BaseController {
    constructor(service) {
        this.service = service;
    };

    handleResponse(res, data, statusCode = 200) {
        res.status(statusCode).json({
            success: true,
            data
        });
    };

    handleError(next, error) {
        next(error);
    };
};
