import express from "express";
import {authMiddleware} from "../../middlewares/auth.middleware.js";
import {productController} from "../../controller/index.js";

const router = express.Router();
//router.use(authMiddleware());

router.post("/", productController.createProduct);
router.get("/:slug", productController.getProductBySlug)

router.get("/:productId", productController.getProductDetails)
router.get("/", productController.getAllProducts)
export default router;