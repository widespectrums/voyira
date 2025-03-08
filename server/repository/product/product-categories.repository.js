import models from "../../models/index.js";
import BaseRepository from "../base.repository.js";
const { ProductCategories } = models;

export default class ProductCategoriesRepository extends BaseRepository {
    constructor(categoryRepository) {
        super(ProductCategories);
        this.categoryRepository = categoryRepository;
    };

    addRelationsToProduct = async (productId, categoryIds, transaction) => {
        await this.validateCategories(categoryIds);
        const categoryRelations = categoryIds.map(categoryId => ({
            product_id: productId,
            category_id: categoryId,
        }));
        return await this.model.bulkCreate(categoryRelations, {transaction});
    };

    removeRelationsFromProduct = async (productId, transaction) => {
        return await this.model.destroy({
            where: { product_id: productId },
            transaction
        });
    };

    updateProductCategories = async (productId, categoryIds, transaction) => {
        await this.removeRelationsFromProduct(productId, transaction);
        if (categoryIds.length > 0) {
            await this.addRelationsToProduct(productId, categoryIds, transaction);
        }
    };

    validateCategories = async (categoryIds) => {
        for (const categoryId of categoryIds) {
            const category = await this.categoryRepository.findById(categoryId);
            if (!category) throw new Error(`Invalid category: ${categoryId}`);
        }
    };
};
