import express from "express";
import BrandController from "../controllers/brand.controller.js";

const brandController = new BrandController();
const router = express.Router();

router.post("/", brandController.createBrand);

export default router;