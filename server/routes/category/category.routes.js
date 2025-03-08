import express from "express";
import {categoryController} from "../../controller/index.js";

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