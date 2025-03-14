import express from "express";
import ImageController from "../controllers/image.controller.js";
import multer from "multer";
import { authMiddleware } from "../../../core/milddlewares/auth.middleware.js";
import apiLimiter from "../../../core/milddlewares/ratelimit.middleware.js";
import {dirname} from "path";
import fs from "fs";

const imageController = new ImageController();
const router = express.Router();

// Configure multer for memory storage (we'll process the files in the service)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Apply middleware
router.use(apiLimiter);

// Routes for product images
router.post(
    "/products/:productId/images",
    authMiddleware(["ROLE_ADMIN"]), // Only admin can upload images
    upload.single('image'),
    imageController.uploadProductImage
);

router.get(
    "/products/:productId/images",
    imageController.getProductImages
);

router.patch(
    "/products/:productId/images/:imageId/primary",
    authMiddleware(["ROLE_ADMIN"]),
    imageController.setAsPrimaryImage
);

router.patch(
    "/products/:productId/images/reorder",
    authMiddleware(["ROLE_ADMIN"]),
    imageController.reorderImages
);

router.delete(
    "/images/:imageId",
    authMiddleware(["ROLE_ADMIN"]),
    imageController.deleteImage
);

router.get(
    "/file/:filename",
    (req, res, next) => {
        try {
            const { filename } = req.params;
            const filePath = path.join(dirname(__dirname), '../../uploads/products', filename);

            if (fs.existsSync(filePath)) {
                return res.sendFile(filePath);
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Image not found"
                });
            }
        } catch (error) {
            next(error);
        }
    }
);

export default router;