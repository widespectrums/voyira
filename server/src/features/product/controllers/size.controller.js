import BaseController from "../../../core/base/base.controller.js";
import SizeService from "../services/size.service.js";

export default class SizeController extends BaseController {
    constructor() {
        const sizeService = new SizeService();
        super(sizeService);
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