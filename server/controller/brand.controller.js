import BaseController from "./base.controller.js";

export default class BrandController extends BaseController {
    constructor(service) {
        super(service);
    };

    createBrand = async (req, res, next) => {
        try {
            const brand = await this.service.createBrand(req.body);
            console.log("Received Body: ", req.body);
            this.handleResponse(res, {brand}, 201);
        } catch (error) {
            this.handleError(next, error);
        }
    };
};