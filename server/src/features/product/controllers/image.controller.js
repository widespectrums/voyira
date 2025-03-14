import BaseController from "../../../core/base/base.controller.js";
import { NotFoundError } from "../../../core/errors/api.error.js";
import ImageService from "../services/image.service.js";
import ProductService from "../services/product.service.js";

export default class ImageController extends BaseController {
    constructor() {
        const imageService = new ImageService();
        super(imageService);

        this.productService = new ProductService();
    }

    uploadProductImage = async (req, res, next) => {
        try {
            const { productId } = req.params;
            const isPrimary = req.body.isPrimary === 'true';
            const order = parseInt(req.body.order || '0');

            // Check if product exists
            await this.productService.getById(productId);

            if (!req.file) {
                throw new Error("No file uploaded");
            }

            const image = await this.service.uploadProductImage(productId, req.file, {
                isPrimary,
                order
            });

            this.handleResponse(res, { image }, 201);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    getProductImages = async (req, res, next) => {
        try {
            const { productId } = req.params;

            // Check if product exists
            await this.productService.getById(productId);

            const images = await this.service.getProductImages(productId);
            this.handleResponse(res, { images });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    setAsPrimaryImage = async (req, res, next) => {
        try {
            const { productId, imageId } = req.params;

            // Check if product exists
            await this.productService.getById(productId);

            const image = await this.service.setAsPrimaryImage(imageId, productId);
            this.handleResponse(res, { image });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    reorderImages = async (req, res, next) => {
        try {
            const { productId } = req.params;
            const { imageIds } = req.body;

            if (!Array.isArray(imageIds)) {
                throw new Error("imageIds must be an array");
            }

            // Check if product exists
            await this.productService.getById(productId);

            await this.service.reorderImages(productId, imageIds);
            const images = await this.service.getProductImages(productId);

            this.handleResponse(res, { images });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    deleteImage = async (req, res, next) => {
        try {
            const { imageId } = req.params;

            await this.service.deleteImage(imageId);
            this.handleResponse(res, null, 204);
        } catch (error) {
            this.handleError(next, error);
        }
    };
};