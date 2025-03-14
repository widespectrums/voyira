import BaseController from "../../../core/base/base.controller.js";
import BrandService from "../services/brand.service.js";

export default class BrandController extends BaseController {
    constructor() {
        const brandService = new BrandService();
        super(brandService);
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