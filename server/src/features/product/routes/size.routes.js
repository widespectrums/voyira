import express from "express";
import SizeController from "../controllers/size.controller.js";

const sizeController = new SizeController();
const router = express.Router();

router.post("/", sizeController.createSize);

export default router;