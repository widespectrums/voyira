import BaseController from "./base.controller.js";

export default class ColorController extends BaseController {
    constructor(service) {
        super(service);
    };

    createColor = async (req, res, next) => {
        try {
            const color = await this.service.createColor(req.body);
            console.log("Received Body: ", req.body);
            this.handleResponse(res, {color}, 201)
        } catch (error) {
            this.handleError(next, error);
        }
    };
}