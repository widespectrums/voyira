import BaseService from "./base.service.js";
import models from "../models/index.js";

export default class ProductService extends BaseService {
    constructor(repository, brandRepository, categoryRepository, tagRepository, colorRepository, sizeRepository) {
        super(repository);
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.colorRepository = colorRepository;
        this.sizeRepository = sizeRepository;
    };

    createProduct = async (productData) => {
        try {
            const {sizes, size_id, colors, color_id ,tags, tag_id, categories, category_id, ...productDetails } = productData;
            if (productDetails.brand_id) {
                const brand = await this.brandRepository.findById(productDetails.brand_id);
                if (!brand) throw new Error("Invalid brand!");
            }
            const product = await this.repository.create({...productDetails});
            const categoriesToAdd = [];
            if (categories && Array.isArray(categories)) {
                for (const categoryId of categories) {
                    const category = await this.categoryRepository.findById(categoryId);
                    if (!category) throw new Error(`Invalid category: ${categoryId}`);
                    categoriesToAdd.push(categoryId);
                }
            }
            else if (category_id) {
                const category = await this.categoryRepository.findById(category_id);
                if (!category) throw new Error("Invalid category!");
                categoriesToAdd.push(category_id);
            }

            // Add categories using Sequelize's native methods if available
            // This assumes your repository.create returns the Sequelize model instance
            if (product.addCategories && categoriesToAdd.length > 0) {
                await product.addCategories(categoriesToAdd);
            }
            // Or manually create junction records
            else if (categoriesToAdd.length > 0) {
                for (const categoryId of categoriesToAdd) {
                    try {
                        await models.ProductCategories.create({
                            product_id: product.id,
                            category_id: categoryId
                        });
                    } catch (error) {
                        console.error(`Error adding category ${categoryId}:`, error.message);
                        // Continue with other categories if one fails
                    }
                }
            }

            // Reload product with associations if needed
            // const fullProduct = await this.repository.findById(product.id, { include: ['categories'] });
            // return fullProduct;


            // ***** TAG EKLEME KISMI *******
            const tagsToAdd = [];
            if (tags && Array.isArray(tags)) {
                for (const tagId of tags) {
                    const tag = await this.tagRepository.findById(tagId);
                    if (!tag) throw new Error(`Invalid tag: ${tagId}`);
                    tagsToAdd.push(tagId);
                }
            }
            else if (tag_id) {
                const tag = await this.tagRepository.findById(tag_id);
                if (!tag) throw new Error("Invalid tag!");
                tagsToAdd.push(tag_id);
            }

            // daha sonra bu metotu kullan!!! bunu taşı
            if (product.addTags && tagsToAdd.length > 0) {
                await product.addTags(tagsToAdd);
            }
            // Or manually create junction records
            else if (tagsToAdd.length > 0) {
                for (const tagId of tagsToAdd) {
                    try {
                        await models.ProductTags.create({
                            product_id: product.id,
                            tag_id: tagId
                        });
                    } catch (error) {
                        console.error(`Error adding tag ${tagId}:`, error.message);
                        // Continue with other categories if one fails
                    }
                }
            }


            // *** COLOR ***
            const colorsToAdd = [];
            if (colors && Array.isArray(colors)) {
                for (const colorId of colors) {
                    const color = await this.colorRepository.findById(colorId);
                    if (!color) throw new Error(`Invalid color: ${colorId}`);
                    colorsToAdd.push(colorId);
                }
            }
            else if (color_id) {
                const color = await this.tagRepository.findById(color_id);
                if (!color) throw new Error("Invalid color!");
                tagsToAdd.push(color_id);
            }

            // daha sonra bu metotu kullan!!! bunu taşı
            if (product.addColors && colorsToAdd.length > 0) {
                await product.addColors(colorsToAdd);
            }
            // Or manually create junction records
            else if (colorsToAdd.length > 0) {
                for (const colorId of colorsToAdd) {
                    try {
                        await models.ProductColors.create({
                            product_id: product.id,
                            color_id: colorId
                        });
                    } catch (error) {
                        console.error(`Error adding tag ${colorId}:`, error.message);
                        // Continue with other categories if one fails
                    }
                }
            }


            return product;
        } catch (error) {
            console.error("Error in createProduct:", error);
            throw error;
        }
    };
};
