import BaseService from "../../../core/base/base.service.js";
import CategoryRepository from "../repositories/category.repository.js";
import {NotFoundError} from "../../../core/errors/api.error.js";

export default class CategoryService extends BaseService {
    constructor() {
        const categoryRepository = new CategoryRepository();
        super(categoryRepository);
    };

    createCategory = async (categoryData) => {
        if (categoryData.parent_id) {
            const parent = await this.repository.findById(categoryData.parent_id);
            if (!parent) throw new Error('Invalid parent category');
        }
        return this.repository.create(categoryData);
    };

    getFullCategoryTree = async () => {
        return await this.repository.getCategoryTree();
    };

    getSubCategories = async (parentId) => {
        return await this.repository.getSubCategories(parentId);
    };

    deleteWithSubCategories = async (categoryId) => {
        const result = await this.repository.deleteWithSubCategories(categoryId);
        return result;
    };

    updateCategory = async (id, data) => {
        const category = await this.repository.findById(id);
        if (!category) {
            throw new NotFoundError(`Category with id ${id} not found!`);
        }

        if (data.parent_id && data.parent_id !== 0 && data.parent_id !== null) {
            const parent = await this.repository.findById(data.parent_id);
            if (!parent) {
                throw new Error('Invalid parent category');
            }
        }

        return this.repository.updateCategory(id, data);
    };
};
