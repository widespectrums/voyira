import BaseRepository from "../base.repository.js";
import models from "../../models/index.js";
const { ProductColors } = models;

export default class ProductColorsRepository extends BaseRepository {
    constructor(colorRepository) {
        super(ProductColors);
        this.colorRepository = colorRepository;
    };

    addRelationsToProduct = async (productId, colorIds, transaction) => {
        await this.validateColors(colorIds);
        const colorRelations = colorIds.map(colorId => ({
            product_id: productId,
            color_id: colorId,
        }));
        return await this.model.bulkCreate(colorRelations, {transaction});
    };

    removeRelationsFromProduct = async (productId, transaction) => {
        return await this.model.destroy({
            where: { product_id: productId },
            transaction
        });
    };

    updateProductColors = async (productId, colorIds, transaction) => {
        await this.removeRelationsFromProduct(productId, transaction);
        if (colorIds.length > 0) {
            await this.addRelationsToProduct(productId, colorIds, transaction);
        }
    };

    validateColors = async (colorIds) => {
        for (const colorId of colorIds) {
            const color = await this.colorRepository.findById(colorId);
            if (!color) throw new Error(`Invalid color: ${colorId}`);
        }
    };
}