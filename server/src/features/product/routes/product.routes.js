import express from "express";
import {authMiddleware} from "../../../core/milddlewares/auth.middleware.js";
import apiLimiter from "../../../core/milddlewares/ratelimit.middleware.js";
import ProductController from "../controllers/product.controller.js";

const productController = new ProductController();
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