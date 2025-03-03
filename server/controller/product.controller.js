import BaseController from "./base.controller.js";

export default class ProductController extends BaseController {
    constructor(service) {
        super(service);
    };

    createProduct = async (req, res, next) => {
        try {
            const product = await this.service.createProduct(req.body);
            console.log("Received Body:", req.body);
            this.handleResponse(res, {product}, 201);
        } catch (error) {
            this.handleError(next, error);
        }
    }
}