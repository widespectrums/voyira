import express from "express";
import multer from "multer";
import { imageController } from "../../controller/index.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import apiLimiter from "../../middlewares/ratelimit.middleware.js";
import { validateParams } from "../../validations/index.js";
import { baseValidation } from "../../validations/index.js";

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

export default router;