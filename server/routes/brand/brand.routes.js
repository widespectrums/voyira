import express from "express";
import {brandController} from "../../controller/index.js";

const router = express.Router();

router.post("/", brandController.createBrand);

export default router;