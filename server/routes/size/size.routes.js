import express from "express";
import {sizeController} from "../../controller/index.js";

const router = express.Router();

router.post("/", sizeController.createSize);

export default router;