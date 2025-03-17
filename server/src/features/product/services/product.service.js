import BaseService from "../../../core/base/base.service.js";
import slugify from "slugify";

// Modeller doğrudan import edildi
import Brand from "../../product/models/brand.model.js";
import Category from "../../product/models/category.model.js";
import Image from "../../product/models/image.model.js";
import Tag from "../../product/models/tag.model.js";
import Color from "../../product/models/color.model.js";
import Size from "../../product/models/size.model.js";

// Repository'ler import edildi
import ProductRepository from "../repositories/product.repository.js";
import BrandRepository from "../repositories/brand.repository.js";
import ProductCategoriesRepository from "../repositories/product-categories.repository.js";
import ProductTagsRepository from "../repositories/product-tags.repository.js";
import ProductColorsRepository from "../repositories/product-colors.repository.js";
import ProductSizesRepository from "../repositories/product-sizes.repository.js";
import CategoryRepository from "../repositories/category.repository.js";
import TagRepository from "../repositories/tag.repository.js";
import ColorRepository from "../repositories/color.repository.js";
import SizeRepository from "../repositories/size.repository.js";
import ImageRepository from "../repositories/image.repository.js";

export default class ProductService extends BaseService {
    constructor() {
        const productRepository = new ProductRepository();
        super(productRepository);

        this.brandRepository = new BrandRepository();

        this.categoryRepository = new CategoryRepository();
        this.productCategoriesRepository = new ProductCategoriesRepository(this.categoryRepository);

        this.tagRepository = new TagRepository();
        this.productTagsRepository = new ProductTagsRepository(this.tagRepository);

        this.colorRepository = new ColorRepository();
        this.productColorsRepository = new ProductColorsRepository(this.colorRepository);

        this.sizeRepository = new SizeRepository();
        this.productSizesRepository = new ProductSizesRepository(this.sizeRepository);


        this.imageRepository = new ImageRepository();
    };


    createProduct = async (productData) => {
        let transaction = null;

        try {
            await this.validateBrand(productData.brand_id);
            const {sizes, size_id, colors, color_id, tags, tag_id, categories, category_id, ...productDetails} = productData;
            productData.slug = await this.generateUniqueSlug(productData.name);

            transaction = await this.repository.startTransaction();
            const product = await this.repository.create(productDetails, {transaction});
            await Promise.all([
                this.addCategoriesToProduct(product.id, categories, category_id, transaction),
                this.addTagsToProduct(product.id, tags, tag_id, transaction),
                this.addColorsToProduct(product.id, colors, color_id, transaction),
                this.addSizesToProduct(product.id, sizes, size_id, transaction)
            ]);
            await transaction.commit();
            transaction = null;
            return await this.repository.findById(product.id, {
                include: [
                    { model: Brand, as: 'brand' },
                    { model: Category, as: 'categories' },
                    { model: Image, as: 'images' },
                    { model: Tag, as: 'tags' },
                    { model: Color, as: 'colors' },
                    { model: Size, as: 'sizes' }
                ]
            });
        } catch (error) {
            if (transaction) {
                await transaction.rollback()
                    .catch(rollbackError => {
                        console.error("Error during transaction rollback:", rollbackError.message);
                    });
            }
            console.error("Error in createProduct:", error);
            throw error;
        }
    };

    getAllProducts = async (queryParams = {}) => {
        try {
            const {
                page,
                limit,
                sort_by,
                sort_order,
                name,
                min_price,
                max_price,
                brand_id,
                category_id,
                tag_id,
                color_id,
                size_id,
                active,
                include_relations = true // Parameter to determine if we should include relations
            } = queryParams;

            // Filtering options
            const filters = {
                name,
                minPrice: min_price,
                maxPrice: max_price,
                brand_id,
                active: active === 'true' ? true : active === 'false' ? false : undefined
            };

            // Include relations
            const includeOptions = [];

            if (include_relations) {
                includeOptions.push(
                    { model: Brand, as: 'brand' },
                    { model: Category, as: 'categories' },
                    { model: Tag, as: 'tags' },
                    { model: Color, as: 'colors' },
                    { model: Size, as: 'sizes' },
                    {
                        model: Image,
                        as: 'images',
                        where: { is_primary: true },
                        required: false
                    }
                );
            }

            // Add category filter if specified
            if (category_id) {
                const categoryIncludeOption = includeOptions.find(opt => opt.as === 'categories');
                if (categoryIncludeOption) {
                    categoryIncludeOption.where = { id: category_id };
                }
            }

            // Similar for other relational filters
            if (tag_id) {
                const tagIncludeOption = includeOptions.find(opt => opt.as === 'tags');
                if (tagIncludeOption) {
                    tagIncludeOption.where = { id: tag_id };
                }
            }

            if (color_id) {
                const colorIncludeOption = includeOptions.find(opt => opt.as === 'colors');
                if (colorIncludeOption) {
                    colorIncludeOption.where = { id: color_id };
                }
            }

            if (size_id) {
                const sizeIncludeOption = includeOptions.find(opt => opt.as === 'sizes');
                if (sizeIncludeOption) {
                    sizeIncludeOption.where = { id: size_id };
                }
            }

            // Send query parameters to the repository
            const result = await this.repository.getAllProducts({
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                sort: sort_by || 'createdAt',
                order: sort_order || 'DESC',
                filters,
                include: includeOptions
            });

            return result;
        } catch (error) {
            console.error("Error in getAllProducts:", error);
            throw error;
        }
    };

    async getProductDetails(productId) {
        const product = await this.repository.findById(productId, {
            include: [
                { model: this.brandRepository.model, as: 'brand' },
                { model: this.categoryRepository.model, as: 'categories' },
                { model: this.tagRepository.model, as: 'tags' },
                { model: this.colorRepository.model, as: 'colors' },
                { model: this.sizeRepository.model, as: 'sizes' },
                { model: Image, as: 'images', order: [['is_primary', 'DESC'], ['order', 'ASC']] }
            ]
        });

        if (!product) throw new Error('Product not found');
        return product;
    }

    getProductBySlug = async (slug) => {
        const product = await this.repository.findBySlug(slug);
        if (!product) throw new Error('Product not found');
        return await this.getProductDetails(product.id);
    };

    updateProduct = async (productId, updateData) => {
        let transaction = null;
        try {
            // Validate brand if provided
            if (updateData.brand_id) {
                await this.validateBrand(updateData.brand_id);
            }

            // Extract relation IDs from the update data
            const {
                sizes, size_id,
                colors, color_id,
                tags, tag_id,
                categories, category_id,
                ...productDetails
            } = updateData;

            // If name is updated, generate a new slug
            if (productDetails.name) {
                productDetails.slug = await this.generateUniqueSlug(productDetails.name, productId);
            }

            transaction = await this.repository.startTransaction();

            // Update the product details
            await this.repository.update(productId, productDetails, { transaction });

            // Update relations if provided
            const updatePromises = [];

            if (categories || category_id) {
                updatePromises.push(
                    this.productCategoriesRepository.updateProductCategories(
                        productId,
                        this.combineIds(categories, category_id),
                        transaction
                    )
                );
            }

            if (tags || tag_id) {
                updatePromises.push(
                    this.productTagsRepository.updateProductTags(
                        productId,
                        this.combineIds(tags, tag_id),
                        transaction
                    )
                );
            }

            if (colors || color_id) {
                updatePromises.push(
                    this.productColorsRepository.updateProductColors(
                        productId,
                        this.combineIds(colors, color_id),
                        transaction
                    )
                );
            }

            if (sizes || size_id) {
                updatePromises.push(
                    this.productSizesRepository.updateProductSizes(
                        productId,
                        this.combineIds(sizes, size_id),
                        transaction
                    )
                );
            }

            // Wait for all relation updates to complete
            if (updatePromises.length > 0) {
                await Promise.all(updatePromises);
            }

            await transaction.commit();
            transaction = null;

            // Return the updated product with all its relations
            return await this.getProductDetails(productId);
        } catch (error) {
            if (transaction) {
                await transaction.rollback()
                    .catch(rollbackError => {
                        console.error("Error during transaction rollback:", rollbackError.message);
                    });
            }
            console.error("Error in updateProduct:", error);
            throw error;
        }
    };

    deleteProduct = async (productId) => {
        let transaction = null;
        try {
            // First check if the product exists
            const product = await this.repository.findById(productId);
            if (!product) throw new Error('Product not found');

            transaction = await this.repository.startTransaction();

            // Delete all related records
            await Promise.all([
                this.productCategoriesRepository.removeRelationsFromProduct(productId, transaction),
                this.productTagsRepository.removeRelationsFromProduct(productId, transaction),
                this.productColorsRepository.removeRelationsFromProduct(productId, transaction),
                this.productSizesRepository.removeRelationsFromProduct(productId, transaction),
                // Remove product images from filesystem and database
                this.imageRepository.deleteByProductId(productId, transaction)
            ]);

            // Now delete the product itself
            await this.repository.delete(productId, { transaction, force: false });

            await transaction.commit();
            transaction = null;

            return true;
        } catch (error) {
            if (transaction) {
                await transaction.rollback()
                    .catch(rollbackError => {
                        console.error("Error during transaction rollback:", rollbackError.message);
                    });
            }
            console.error("Error in deleteProduct:", error);
            throw error;
        }
    };

    addCategoriesToProduct = async (productId, categories, categoryId, transaction) => {
        const categoryIds = this.combineIds(categories, categoryId);
        if (categoryIds.length === 0) return;

        await this.productCategoriesRepository.addRelationsToProduct(
            productId,
            categoryIds,
            transaction
        );
    };

    addTagsToProduct = async (productId, tags, tagId, transaction) => {
        const tagIds = this.combineIds(tags, tagId);
        if (tagIds.length === 0) return;

        await this.productTagsRepository.addRelationsToProduct(
            productId,
            tagIds,
            transaction
        );
    }

    addColorsToProduct = async (productId, colors, colorId, transaction) => {
        const colorIds = this.combineIds(colors, colorId);
        if (colorIds.length === 0) return;

        await this.productColorsRepository.addRelationsToProduct(
            productId,
            colorIds,
            transaction
        );
    }

    addSizesToProduct= async (productId, sizes, sizeId, transaction) => {
        const sizeIds = this.combineIds(sizes, sizeId);
        if (sizeIds.length === 0) return;

        await this.productSizesRepository.addRelationsToProduct(
            productId,
            sizeIds,
            transaction
        );
    }

    combineIds(items, singleId) {
        const ids = [];
        if (items && Array.isArray(items)) {
            const validItems = items.filter(id => id !== null && id !== undefined);
            ids.push(...validItems)
        }
        if (singleId) {ids.push(singleId);}
        return ids;
    }

    validateBrand = async (brandId) => {
        if (!brandId) return;
        const brand = await this.brandRepository.findById(brandId);
        if (!brand) throw new Error("Invalid brand!");
    };

    generateUniqueSlug = async (name, excludeId = null) => {
        let baseSlug = slugify(name, { lower: true, strict: true, locale: 'tr'});
        let counter = 1;
        let uniqueSlug = baseSlug;

        while (true) {
            const existing = await this.repository.findBySlug(uniqueSlug);
            if (!existing || existing.id === excludeId) break;
            uniqueSlug = `${baseSlug}-${counter++}`;
        }
        return uniqueSlug;
    };

    getProductsByCategoryId = async (categoryId, queryParams = {}) => {
        try {
            const {
                page,
                limit,
                sort_by,
                sort_order,
                name,
                min_price,
                max_price,
                brand_id,
                color_id,
                size_id,
                active,
                include_subcategories = true
            } = queryParams;

            // Filtreleme seçenekleri
            const filters = {
                name,
                minPrice: min_price,
                maxPrice: max_price,
                brand_id,
                active: active === 'true' ? true : active === 'false' ? false : undefined
            };

            // Kategori repoya gönderilecek parametreler
            const result = await this.repository.findProductsByCategoryId(categoryId, {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                sort: sort_by || 'createdAt',
                order: sort_order || 'DESC',
                filters,
                includeSubCategories: include_subcategories === 'true' || include_subcategories === true
            });

            return result;
        } catch (error) {
            console.error("Error in getProductsByCategoryId:", error);
            throw error;
        }
    };
};
