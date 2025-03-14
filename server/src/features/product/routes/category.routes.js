import express from "express";
import CategoryController from "../controllers/category.controller.js";

const categoryController = new CategoryController();
const router = express.Router();

router.post("/",
    categoryController.createCategory,
    );

router.get("/",
    categoryController.getFullCategoryTree)

router.get("/subcategories/:parentId",
    categoryController.getSubCategories
    );

export default router;