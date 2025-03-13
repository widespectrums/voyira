import BaseService from "../services/base/base.service.js";
import  sequelize  from "../config/database.js";
import { NotFoundError, BadRequestError } from "../errors/api.error.js";

export default class ShippingMethodService extends BaseService {
    constructor(shippingMethodRepository) {
        super(shippingMethodRepository);
    }

    getAllActiveMethods = async () => {
        return await this.repository.findAllActive();
    };

    updateFreeShippingThreshold = async (methodId, threshold) => {
        if (threshold < 0) {
            throw new BadRequestError("Threshold cannot be negative");
        }

        return await sequelize.transaction(async (transaction) => {
            const method = await this.repository.findById(methodId, { transaction });
            if (!method) {
                throw new NotFoundError("Shipping method not found");
            }

            await this.repository.updateThreshold(methodId, threshold, transaction);
            return await this.repository.findById(methodId, { transaction });
        });
    };

    updateBaseFee = async (methodId, baseFee) => {
        if (baseFee < 0) {
            throw new BadRequestError("Base fee cannot be negative");
        }

        return await sequelize.transaction(async (transaction) => {
            const method = await this.repository.findById(methodId, { transaction });
            if (!method) {
                throw new NotFoundError("Shipping method not found");
            }

            await this.repository.updateBaseFee(methodId, baseFee, transaction);
            return await this.repository.findById(methodId, { transaction });
        });
    };

    toggleMethodStatus = async (methodId) => {
        return await sequelize.transaction(async (transaction) => {
            const method = await this.repository.findById(methodId, { transaction });
            if (!method) {
                throw new NotFoundError("Shipping method not found");
            }

            await this.repository.update(methodId, { is_active: !method.is_active }, { transaction });
            return await this.repository.findById(methodId, { transaction });
        });
    };

    createShippingMethod = async (data) => {
        return await this.repository.create(data);
    };
};