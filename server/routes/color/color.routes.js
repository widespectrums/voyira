import express from "express";
import {colorController} from "../../controller/index.js";

const router = express.Router();
router.post("/", colorController.createColor);

export default router;