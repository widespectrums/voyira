import express from "express";
import TagController from "../controllers/tag.controller.js";

const tagController = new TagController();
const router = express.Router();

router.post("/", tagController.createTag);

router.get("/", tagController.getAllTags);

router.get("/:id", tagController.getTagById);

router.patch("/:id", tagController.updateTag);

router.delete("/:id", tagController.deleteTag);

export default router;
