import express from "express";
import { authMiddleware } from "../../../core/milddlewares/auth.middleware.js";
import apiLimiter from "../../../core/milddlewares/ratelimit.middleware.js";
import { shippingValidation } from "../../../core/validations/shipping.validation.js";
import ShippingMethodController from "../../auth/controllers/shippingMethod.controller.js";

const shippingMethodController = new ShippingMethodController();
const router = express.Router();

// Apply middleware
router.use(apiLimiter);

// Public route - All users can see available shipping methods
router.get(
    "/methods",
    shippingMethodController.getAllMethods
);

// Admin routes - Only admins can manage shipping methods
router.post(
    "/methods",
    authMiddleware(["ROLE_ADMIN"]), // Rol isimlerini kendi sisteminize göre ayarlayın
    shippingMethodController.createMethod
);

router.patch(
    "/methods/:methodId/threshold",
    authMiddleware(["ROLE_ADMIN"]), // Rol isimlerini kendi sisteminize göre ayarlayın
    shippingMethodController.updateFreeShippingThreshold
);

router.patch(
    "/methods/:methodId/fee",
    authMiddleware(["ROLE_ADMIN"]), // Rol isimlerini kendi sisteminize göre ayarlayın
    shippingMethodController.updateBaseFee
);

router.patch(
    "/methods/:methodId/toggle",
    authMiddleware(["ROLE_ADMIN"]), // Rol isimlerini kendi sisteminize göre ayarlayın
    shippingMethodController.toggleMethodStatus
);

export default router;