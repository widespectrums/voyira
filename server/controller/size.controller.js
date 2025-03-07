import BaseController from "./base.controller.js";

export default class SizeController extends BaseController {
    constructor(service) {
        super(service);
    };

    createSize = async (req, res, next) => {
        try {
            const size = await this.service.createSize(req.body);
            console.log("Received Body: ", req.body);
            this.handleResponse(res, {size}, 201);
        } catch (error) {
            this.handleError(next, error);
        }
    };
}