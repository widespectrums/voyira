import BaseController from "../../../core/base/base.controller.js";
import ProductService from "../services/product.service.js";

export default class ProductController extends BaseController {
    constructor() {
        const productService = new ProductService();
        super(productService);
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
            console.log("Product details retrieved:", product.id);
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
        } catch (error) {
            this.handleError(next, error);
        }
    };

    getProductBySlug = async (req, res, next) => {
        try {
            const product = await this.service.getProductBySlug(req.params.slug);
            return this.handleResponse(res, {product});
        } catch (error) {
            this.handleError(next, error);
        }
    };

    updateProduct = async (req, res, next) => {
        try {
            const productId = req.params.productId;
            const updatedProduct = await this.service.updateProduct(productId, req.body);
            return this.handleResponse(res, {product: updatedProduct});
        } catch (error) {
            this.handleError(next, error);
        }
    };

    deleteProduct = async (req, res, next) => {
        try {
            const productId = req.params.productId;
            await this.service.deleteProduct(productId);
            return this.handleResponse(res, null, 204);
        } catch (error) {
            this.handleError(next, error);
        }
    };
};
