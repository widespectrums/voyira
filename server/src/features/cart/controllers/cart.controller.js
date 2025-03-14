import BaseController from "../../../core/base/base.controller.js";
import { NotFoundError, BadRequestError } from "../../../core/errors/api.error.js";

export default class CartController extends BaseController {
    constructor(cartService) {
        super(cartService);
    }

    getUserCart = async (req, res, next) => {
        try {
            // req.auth.userId kullanımı
            const userId = req.auth?.userId;

            if (!userId) {
                throw new BadRequestError("Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın.");
            }

            const cart = await this.service.getUserCart(userId);

            this.handleResponse(res, { cart });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    addItemToCart = async (req, res, next) => {
        try {
            // req.auth.userId kullanımı
            const userId = req.auth?.userId;

            if (!userId) {
                throw new BadRequestError("Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın.");
            }

            const { productId, quantity = 1, colorId = null, sizeId = null } = req.body;

            if (!productId) {
                throw new BadRequestError("Product ID is required");
            }

            const cart = await this.service.addItemToCart(
                userId,
                productId,
                parseInt(quantity),
                colorId,
                sizeId
            );

            this.handleResponse(res, { cart });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    updateItemQuantity = async (req, res, next) => {
        try {
            // req.auth.userId kullanımı
            const userId = req.auth?.userId;

            if (!userId) {
                throw new BadRequestError("Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın.");
            }

            const { itemId } = req.params;
            const { quantity } = req.body;

            if (!quantity) {
                throw new BadRequestError("Quantity is required");
            }

            const cart = await this.service.updateItemQuantity(
                userId,
                itemId,
                parseInt(quantity)
            );

            this.handleResponse(res, { cart });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    removeItemFromCart = async (req, res, next) => {
        try {
            // req.auth.userId kullanımı
            const userId = req.auth?.userId;

            if (!userId) {
                throw new BadRequestError("Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın.");
            }

            const { productId } = req.params;

            const cart = await this.service.removeItemFromCart(userId, productId);

            this.handleResponse(res, { cart });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    clearCart = async (req, res, next) => {
        try {
            // req.auth.userId kullanımı
            const userId = req.auth?.userId;

            if (!userId) {
                throw new BadRequestError("Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın.");
            }

            const cart = await this.service.clearCart(userId);

            this.handleResponse(res, { cart });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    setShippingMethod = async (req, res, next) => {
        try {
            // req.auth.userId kullanımı
            const userId = req.auth?.userId;

            if (!userId) {
                throw new BadRequestError("Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın.");
            }

            const { shippingMethodId } = req.body;

            if (!shippingMethodId) {
                throw new BadRequestError("Shipping method ID is required");
            }

            const cart = await this.service.setShippingMethod(userId, shippingMethodId);

            this.handleResponse(res, { cart });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    completeCart = async (req, res, next) => {
        try {
            // req.auth.userId kullanımı
            const userId = req.auth?.userId;

            if (!userId) {
                throw new BadRequestError("Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın.");
            }

            const cart = await this.service.completeCart(userId);

            this.handleResponse(res, { cart });
        } catch (error) {
            this.handleError(next, error);
        }
    };
}