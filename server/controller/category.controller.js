import BaseController from "./base.controller.js";

export default class CategoryController extends BaseController {
    constructor(service) {
        super(service);
    };

    createCategory = async (req, res, next) => {
        try {
            const category = await this.service.createCategory(req.body);
            this.handleResponse(res, {category}, 201);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    getFullCategoryTree = async (req, res, next) => {
        try {
            const categoryTree = await this.service.getFullCategoryTree();
            if (!categoryTree || categoryTree.length === 0) {
                return this.handleResponse(res, { categoryTree: [] }, 404);
            }
            this.handleResponse(res, { categoryTree });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    getSubCategories = async (req, res, next) => {
        try {
            const subCategories = await this.service.getSubCategories(req.params.parentId);
            if (!subCategories || subCategories.length === 0) {
                return this.handleResponse(res, { subCategories: [] }, 404);
            }
            return this.handleResponse(res, { subCategories });
        } catch (error) {
            this.handleError(next, error);
        }
    };
};
