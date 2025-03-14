import BaseRepository from "../../../core/base/base.repository.js";
import Image from "../models/image.model.js";

export default class ImageRepository extends BaseRepository {
    constructor() {
        super(Image);
    }

    createProductImage = async (imageData, transaction) => {
        return this.create(imageData, { transaction });
    };

    findByProductId = async (productId, options = {}) => {
        return this.model.findAll({
            where: { product_id: productId },
            order: [
                ['is_primary', 'DESC'],
                ['order', 'ASC']
            ],
            ...options
        });
    };

    updatePrimaryImage = async (imageId, productId, transaction) => {
        // First, set all images of this product to not primary
        await this.model.update(
            { is_primary: false },
            {
                where: { product_id: productId },
                transaction
            }
        );

        // Then, set the specific image as primary
        return this.update(imageId, { is_primary: true }, { transaction });
    };

    reorderImages = async (productId, imageIds, transaction) => {
        const promises = imageIds.map((imageId, index) => {
            return this.model.update(
                { order: index },
                {
                    where: {
                        id: imageId,
                        product_id: productId
                    },
                    transaction
                }
            );
        });

        return Promise.all(promises);
    };

    deleteByProductId = async (productId, transaction) => {
        return this.model.destroy({
            where: { product_id: productId },
            transaction
        });
    };
};