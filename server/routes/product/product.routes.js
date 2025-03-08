import express from "express";
import {authMiddleware} from "../../middlewares/auth.middleware.js";
import {productController} from "../../controller/index.js";
import apiLimiter from "../../middlewares/ratelimit.middleware.js";
import { validateParams, validateBody } from "../../validations/index.js";
import { baseValidation } from "../../validations/index.js";

const router = express.Router();

// Apply rate limiting to all product routes
router.use(apiLimiter);

// Public routes
router.get("/", productController.getAllProducts);
router.get("/slug/:slug", productController.getProductBySlug);
router.get("/:productId", productController.getProductDetails);

// Admin-only routes
router.post("/",
    authMiddleware(["ROLE_ADMIN"]),
    productController.createProduct
);

router.patch("/:productId",
    authMiddleware(["ROLE_ADMIN"]),
    productController.updateProduct
);

router.delete("/:productId",
    authMiddleware(["ROLE_ADMIN"]),
    productController.deleteProduct
);

export default router;