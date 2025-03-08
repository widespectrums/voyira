import models from "../../models/index.js";
import BaseRepository from "../base/base.repository.js";
const { Category } = models;

export default class CategoryRepository extends BaseRepository {
    constructor() {
        super(Category);
    };

    getSubCategories = async (parentId, options = {}) => {
        const parentCategory = await this.model.findByPk(parentId);
        if (!parentCategory) {
            console.log('Parent category not found');
            return [];
        }
        return await this.model.findAll({
            where: {
                parent_id: parentId
            },
            raw: true
        });
    };
    getCategoryTree = async (options = {}) => {
        return this.model.findAll({
            where: { parent_id: null },
            include: [
                {
                    model: this.model,
                    as: 'subCategories',
                    nested: true
                }
            ],
            ...options
        });
    };
};
