
import BaseRepository from "../../../core/base/base.repository.js";
import ShippingMethod from "../models/shippingMethod.model.js";

export default class ShippingMethodRepository extends BaseRepository {
    constructor() {
        super(ShippingMethod);
    }

    findAllActive = async (options = {}) => {
        return this.model.findAll({
            where: { is_active: true },
            ...options
        });
    };

    updateThreshold = async (methodId, threshold, transaction) => {
        return this.update(
            methodId,
            { free_shipping_threshold: threshold },
            { transaction }
        );
    };

    updateBaseFee = async (methodId, baseFee, transaction) => {
        return this.update(
            methodId,
            { base_fee: baseFee },
            { transaction }
        );
    };
}