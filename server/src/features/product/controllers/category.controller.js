import BaseController from "../../../core/base/base.controller.js";
import CategoryService from "../services/category.service.js";

export default class CategoryController extends BaseController {
    constructor() {
        const categoryService = new CategoryService();
        super(categoryService);
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

    updateCategory = async (req, res, next) => {
        try {
            const categoryId = req.params.id;
            const updatedCategory = await this.service.updateCategory(categoryId, req.body);
            this.handleResponse(res, { category: updatedCategory }, 200);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    deleteCategory = async (req, res, next) => {
        try {
            const categoryId = req.params.id;
            const result = await this.service.deleteWithSubCategories(categoryId);

            this.handleResponse(res, {
                message: `Category deleted with ${result.deletedSubCategories} subcategories`,
                deletedItems: {
                    mainCategory: result.mainCategory,
                    deletedSubCategoriesCount: result.deletedSubCategories
                }
            }, 200);
        } catch (error) {
            this.handleError(next, error);
        }
    };
};
