import BaseRepository from "../../../core/base/base.repository.js";
import ProductSizes from "../models/product-sizes.model.js";

export default class ProductSizesRepository extends BaseRepository {
    constructor(sizeRepository) {
        super(ProductSizes);
        this.sizeRepository = sizeRepository;
    };

    addRelationsToProduct = async (productId, sizeIds, transaction) => {
        await this.validateSizes(sizeIds);
        const sizeRelations = sizeIds.map(sizeId => ({
            product_id: productId,
            size_id: sizeId,
        }));
        return await this.model.bulkCreate(sizeRelations, {transaction});
    };

    removeRelationsFromProduct = async (productId, transaction) => {
        return await this.model.destroy({
            where: { product_id: productId },
            transaction
        });
    };

    updateProductSizes = async (productId, sizeIds, transaction) => {
        await this.removeRelationsFromProduct(productId, transaction);
        if (sizeIds.length > 0) {
            await this.addRelationsToProduct(productId, sizeIds, transaction);
        }
    };

    validateSizes = async (sizeIds) => {
        for (const sizeId of sizeIds) {
            const size = await this.sizeRepository.findById(sizeId);
            if (!size) throw new Error(`Invalid size: ${sizeId}`);
        }
    };
}