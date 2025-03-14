import BaseRepository from "../../../core/base/base.repository.js";
import Category from "../models/category.model.js";

export default class CategoryRepository extends BaseRepository {
    constructor() {
        super(Category);
    };

    getAllCategories = async (options = {}) => {
        return await this.model.findAll({
            ...options,
            raw: true
        });
    };

    buildCategoryTree = (categories, parentId = null) => {
        return categories
            .filter(category => category.parent_id === parentId)
            .map(category => ({
                ...category,
                subCategories: this.buildCategoryTree(categories, category.id)
            }));
    };

    getSubCategories = async (parentId, options = {}) => {
        const parentCategory = await this.model.findByPk(parentId);
        if (!parentCategory) {
            console.log('Parent category not found');
            return [];
        }
        const allCategories = await this.getAllCategories(options);
        const directChildren = allCategories.filter(c => c.parent_id === parentId);
        return directChildren.map(child => ({
            ...child,
            subCategories: this.buildCategoryTree(allCategories, child.id)
        }));
    };

    getCategoryTree = async (options = {}) => {
        const allCategories = await this.getAllCategories(options);
        return this.buildCategoryTree(allCategories);
    };
};
