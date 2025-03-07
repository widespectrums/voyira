import BaseController from "./base.controller.js";

export default class TagController extends BaseController {
    constructor(service) {
        super(service);
    };

    createTag = async (req, res, next) => {
        try {
            const tag = await this.service.createTag(req.body);
            console.log("Received Body: ", req.body);
            this.handleResponse(res, {tag}, 201);
        } catch (error) {
            this.handleError(next, error);
        }
    };
}