import BaseRepository from "../../../core/base/base.repository.js";
import Category from "../models/category.model.js";
import { Op } from "sequelize";

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

    findAllSubCategoryIds = async (categoryId) => {
        const allCategoryIds = [categoryId];
        const directChildren = await this.model.findAll({
            where: { parent_id: categoryId },
            attributes: ['id']
        });

        if (directChildren.length === 0) {
            return allCategoryIds;
        }

        const childIds = directChildren.map(child => child.id);

        for (const childId of childIds) {
            const subChildIds = await this.findAllSubCategoryIds(childId);
            allCategoryIds.push(...subChildIds);
        }

        return allCategoryIds;
    };

    deleteWithSubCategories = async (categoryId, options = {}) => {
        const transaction = options.transaction || await this.startTransaction();
        const newOptions = { ...options, transaction };

        try {
            const category = await this.model.findByPk(categoryId);
            if (!category) {
                throw new Error(`Category with id ${categoryId} not found!`);
            }

            const categoryData = category.toJSON();
            const allCategoryIds = await this.findAllSubCategoryIds(categoryId);
            const uniqueIds = [...new Set(allCategoryIds)];
            const allIdsToDelete = [...uniqueIds];
            const deleteResult = await this.bulkDelete(allIdsToDelete, newOptions);

            if (!options.transaction) {
                await transaction.commit();
            }

            return {
                mainCategory: categoryData,
                deletedSubCategories: allIdsToDelete.length - 1, // Ana kategori hariç
                success: true
            };
        } catch (error) {
            if (!options.transaction) {
                await transaction.rollback();
            }
            console.error("Error deleting category with subcategories:", error);
            throw error;
        }
    };

    updateCategory = async (id, data, options = {}) => {
        const transaction = options.transaction || await this.startTransaction();
        const newOptions = { ...options, transaction };

        try {
            const category = await this.model.findByPk(id);
            if (!category) {
                throw new Error(`Category with id ${id} not found!`);
            }

            if (data.parent_id !== undefined) {

                if (parseInt(id) === parseInt(data.parent_id)) {
                    throw new Error("A category cannot be its own parent");
                }

                if (parseInt(data.parent_id) !== 0 && parseInt(data.parent_id) !== null) {
                    const subCategoryIds = await this.findAllSubCategoryIds(id);
                    if (subCategoryIds.includes(parseInt(data.parent_id))) {
                        throw new Error("Circular dependency detected. A category cannot be a child of its own subcategory");
                    }
                }
            }

            await category.update(data, newOptions);

            if (!options.transaction) {
                await transaction.commit();
            }

            return category;
        } catch (error) {
            if (!options.transaction) {
                await transaction.rollback();
            }
            console.error("Error updating category:", error);
            throw error;
        }
    };
};
