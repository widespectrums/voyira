import express from "express";
import TagController from "../controllers/tag.controller.js";

const tagController = new TagController();
const router = express.Router();

router.post("/", tagController.createTag);

export default router;
