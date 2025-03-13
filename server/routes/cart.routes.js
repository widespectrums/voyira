import express from "express";
import { cartController } from "../controller/index.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import apiLimiter from "../middlewares/ratelimit.middleware.js";

import { cartValidation } from "../validations/cart.validation.js";

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