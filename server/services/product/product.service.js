import BaseService from "../base.service.js";
import models from "../../models/index.js";
import slugify from "slugify";

export default class ProductService extends BaseService {
    constructor(
        repository,
        brandRepository,
        productCategoriesRepository,
        productTagsRepository,
        productColorsRepository,
        productSizesRepository,

        categoryRepository,
        tagRepository,
        colorRepository,
        sizeRepository,
        imagesRepository,
    ) {
        super(repository);
        this.brandRepository = brandRepository;
        this.productCategoriesRepository = productCategoriesRepository;
        this.productTagsRepository = productTagsRepository;
        this.productColorsRepository = productColorsRepository;
        this.productSizesRepository = productSizesRepository;

        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.colorRepository = colorRepository;
        this.sizeRepository = sizeRepository;

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
                    { model: models.Brand, as: 'brand' },
                    { model: models.Category, as: 'categories' },
                    { model: models.Image, as: 'images' },
                    { model: models.Tag, as: 'tags' },
                    { model: models.Color, as: 'colors' },
                    { model: models.Size, as: 'sizes' }
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
                include_relations = true // İlişkileri dahil etmek isteyip istemediğimizi belirten parametre
            } = queryParams;

            // Filtreleme seçenekleri
            const filters = {
                name,
                minPrice: min_price,
                maxPrice: max_price,
                brand_id,
                active: active === 'true' ? true : active === 'false' ? false : undefined
            };

            // İlişkilerin dahil edilmesi
            const includeOptions = [];

            if (include_relations) {
                includeOptions.push(
                    { model: models.Brand, as: 'brand' },
                    { model: models.Category, as: 'categories' },
                    { model: models.Tag, as: 'tags' },
                    { model: models.Color, as: 'colors' },
                    { model: models.Size, as: 'sizes' }
                );
            }

            // Eğer kategori filtresi varsa
            if (category_id) {
                // İlişkisel filtreleme için özel koşullar ekleyebiliriz
                const categoryIncludeOption = includeOptions.find(opt => opt.as === 'categories');
                if (categoryIncludeOption) {
                    categoryIncludeOption.where = { id: category_id };
                }
            }

            // Benzer şekilde diğer ilişkisel filtreler için
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

            // Repository'e sorgu parametrelerini gönder
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
            ]
        });

        if (!product) throw new Error('Product not found');
        return product;
    }

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
};
