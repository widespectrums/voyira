import BaseRepository from "../base.repository.js";
import models from "../../models/index.js";
const { ProductTags } = models;

export default class ProductTagsRepository extends BaseRepository {
    constructor(tagRepository) {
        super(ProductTags);
        this.tagRepository = tagRepository;
    };

    addRelationsToProduct = async (productId, tagIds, transaction) => {
        await this.validateTags(tagIds);
        const tagRelations = tagIds.map(tagId => ({
            product_id: productId,
            tag_id: tagId,
        }));
        return await this.model.bulkCreate(tagRelations, {transaction});
    };

    removeRelationsFromProduct = async (productId, transaction) => {
        return await this.model.destroy({
            where: { product_id: productId },
            transaction
        });
    };

    updateProductTags = async (productId, tagIds, transaction) => {
        await this.removeRelationsFromProduct(productId, transaction);
        if (tagIds.length > 0) {
            await this.addRelationsToProduct(productId, tagIds, transaction);
        }
    };

    validateTags = async (tagIds) => {
        for (const tagId of tagIds) {
            const tag = await this.tagRepository.findById(tagId);
            if (!tag) throw new Error(`Invalid tag: ${tagId}`);
        }
    };
}