import express from "express";
import { authMiddleware } from "../../../core/milddlewares/auth.middleware.js";
import apiLimiter from "../../../core/milddlewares/ratelimit.middleware.js";
import { cartValidation } from "../../../core/validations/cart.validation.js";
import CartController from "../controllers/cart.controller.js";

const cartController = new CartController();
const router = express.Router();

// Apply middleware
router.use(apiLimiter);
router.use(authMiddleware()); // Requires user authentication for all cart routes

// Cart routes
router.get(
    "/",
    cartController.getUserCart
);

router.post(
    "/items",

    cartController.addItemToCart
);

router.patch(
    "/items/:itemId",

    cartController.updateItemQuantity
);

router.delete(
    "/items/:productId",
    cartController.removeItemFromCart
);

router.delete(
    "/",
    cartController.clearCart
);

router.patch(
    "/shipping-method",
    cartController.setShippingMethod
);

router.post(
    "/complete",
    cartController.completeCart
);

export default router;