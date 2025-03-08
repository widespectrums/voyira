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
    };

    getProductDetails = async (req, res, next) => {
        try {
            const product = await this.service.getProductDetails(req.params.productId);
            console.log("Received Body:", product);
            return this.handleResponse(res, {product});
        } catch (error) {
            this.handleError(next, error);
        }
    };

    getAllProducts = async (req, res, next) => {
        try {
            const queryParams = req.query;
            const result = await this.service.getAllProducts(queryParams);

            return this.handleResponse(res, {
                data: result.products,
                pagination: result.pagination,
            });


            /*
            // Başarılı yanıt döndür
            return res.status(200).json({
                success: true,
                data: result.products,
                pagination: result.pagination
            });
            */
        } catch (error) {
            this.handleError(next, error);
        }
    }
}