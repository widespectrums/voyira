import express from "express";
import ColorController from "../controllers/color.controller.js";

const colorController = new ColorController();
const router = express.Router();

router.post("/", colorController.createColor);

export default router;
