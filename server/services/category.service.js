import BaseService from "./base.service.js";

export default class CategoryService extends BaseService {
    constructor(repository) {
        super(repository);
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
};
