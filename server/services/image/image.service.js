import BaseService from "../base/base.service.js";
import { NotFoundError } from "../../errors/api.error.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class ImageService extends BaseService {
    constructor(repository) {
        super(repository);
        this.uploadDir = path.join(dirname(__dirname), '../../uploads/products');
        this.ensureUploadDirExists();
    }

    ensureUploadDirExists() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    uploadProductImage = async (productId, file, options = {}) => {
        try {
            // Generate a unique filename
            const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
            const filepath = path.join(this.uploadDir, filename);

            // Save the file to the server
            fs.writeFileSync(filepath, file.buffer);

            // Create a relative URL path for the image
            const imageUrl = `/uploads/products/${filename}`;

            // Determine if this is the primary image
            const isPrimary = options.isPrimary || false;
            const order = options.order || 0;

            // Save the image data to the database
            const imageData = {
                url: imageUrl,
                product_id: productId,
                is_primary: isPrimary,
                order: order
            };

            const transaction = options.transaction;
            const savedImage = await this.repository.createProductImage(imageData, transaction);

            return savedImage;
        } catch (error) {
            throw error;
        }
    };

    getProductImages = async (productId) => {
        return this.repository.findByProductId(productId);
    };

    setAsPrimaryImage = async (imageId, productId, transaction) => {
        const image = await this.repository.findById(imageId);
        if (!image) {
            throw new NotFoundError("Image not found");
        }

        if (image.product_id !== productId) {
            throw new NotFoundError("Image does not belong to the specified product");
        }

        return this.repository.updatePrimaryImage(imageId, productId, transaction);
    };

    reorderImages = async (productId, imageIds, transaction) => {
        // Verify all imageIds belong to the product
        const images = await this.repository.findByProductId(productId);
        const existingIds = images.map(img => img.id);

        const allValid = imageIds.every(id => existingIds.includes(id));
        if (!allValid) {
            throw new NotFoundError("One or more images do not belong to the specified product");
        }

        return this.repository.reorderImages(productId, imageIds, transaction);
    };

    deleteImage = async (imageId, options = {}) => {
        const image = await this.repository.findById(imageId);
        if (!image) {
            throw new NotFoundError("Image not found");
        }

        // Delete file from filesystem
        try {
            const filePath = path.join(dirname(__dirname), '..', '..', image.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            // Continue with DB deletion even if file deletion fails
        }

        // Delete from database
        return this.repository.delete(imageId, options);
    };

    deleteProductImages = async (productId, transaction) => {
        const images = await this.repository.findByProductId(productId);

        // Delete files from filesystem
        for (const image of images) {
            try {
                const filePath = path.join(dirname(__dirname), '..', '..', image.url);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (error) {
                console.error("Error deleting file:", error);
                // Continue with next image even if this deletion fails
            }
        }

        // Delete from database
        return this.repository.deleteByProductId(productId, transaction);
    };
};