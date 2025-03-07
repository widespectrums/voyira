import express from "express";
import {tagController} from "../controller/index.js";

const router = express.Router();

router.post("/", tagController.createTag);

export default router;