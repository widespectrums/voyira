import BaseController from "../../../core/base/base.controller.js";
import { NotFoundError, BadRequestError } from "../../../core/errors/api.error.js";
import ShippingMethodService from "../../cart/services/shippingMethod.service.js";

export default class ShippingMethodController extends BaseController {
    constructor() {
        const shippingMethodService = new ShippingMethodService();
        super(shippingMethodService);
    }

    getAllMethods = async (req, res, next) => {
        try {
            const methods = await this.service.getAllActiveMethods();

            this.handleResponse(res, { methods });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    createMethod = async (req, res, next) => {
        try {
            // Admin yetki kontrolü yapmaya gerek yok çünkü middleware'de yapılıyor
            const { name, description, baseFee, freeShippingThreshold, providerCode } = req.body;

            if (!name) {
                throw new BadRequestError("Name is required");
            }

            const method = await this.service.createShippingMethod({
                name,
                description,
                base_fee: baseFee || 0,
                free_shipping_threshold: freeShippingThreshold,
                provider_code: providerCode,
                is_active: true
            });

            this.handleResponse(res, { method }, 201);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    updateFreeShippingThreshold = async (req, res, next) => {
        try {
            const { methodId } = req.params;
            const { threshold } = req.body;

            if (threshold === undefined) {
                throw new BadRequestError("Threshold is required");
            }

            const method = await this.service.updateFreeShippingThreshold(
                methodId,
                parseFloat(threshold)
            );

            this.handleResponse(res, { method });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    updateBaseFee = async (req, res, next) => {
        try {
            const { methodId } = req.params;
            const { baseFee } = req.body;

            if (baseFee === undefined) {
                throw new BadRequestError("Base fee is required");
            }

            const method = await this.service.updateBaseFee(
                methodId,
                parseFloat(baseFee)
            );

            this.handleResponse(res, { method });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    toggleMethodStatus = async (req, res, next) => {
        try {
            const { methodId } = req.params;

            const method = await this.service.toggleMethodStatus(methodId);

            this.handleResponse(res, { method });
        } catch (error) {
            this.handleError(next, error);
        }
    };
}