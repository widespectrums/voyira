import BaseRepository from "../../../core/base/base.repository.js";
import Product from "../models/product.model.js";
import CategoryRepository from "./category.repository.js";
import {Op} from "sequelize";

export default class ProductRepository extends BaseRepository {
    constructor() {
        super(Product);
    };

    findBySlug = async (slug, options = {}) => {
        return await this.model.findOne({
            where: { slug },
            attributes: ['id', 'name', 'slug', 'price', 'description', 'stock', 'active']


        });
    }

    getAllProducts = async (options = {}) => {
        const {
            page = 1,
            limit = 10,
            sort = 'createdAt',
            order = 'DESC',
            filters = {},
            include = []
        } = options;

        const offset = (page - 1) * limit;

        const whereConditions = this.buildWhereConditions(filters);

        const orderOptions = [[sort, order]];

        const { rows: products, count: totalProducts } = await this.model.findAndCountAll({
            where: whereConditions,
            include,
            limit,
            offset,
            distinct: true, // İlişkiler sebebiyle tekrarlı kayıtları önler
            order: orderOptions
        });

        const totalPages = Math.ceil(totalProducts / limit);

        return {
            products,
            pagination: {
                total: totalProducts,
                totalPages,
                currentPage: parseInt(page),
                pageSize: parseInt(limit),
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    };

    buildWhereConditions = (filters) => {
        const whereConditions = {};
        if (filters.name) {
            whereConditions.name = { [this.model.sequelize.Op.iLike]: `%${filters.name}%` };
        }

        if (filters.minPrice) {
            whereConditions.price = {
                ...(whereConditions.price || {}),
                [this.model.sequelize.Op.gte]: filters.minPrice
            };
        }

        if (filters.maxPrice) {
            whereConditions.price = {
                ...(whereConditions.price || {}),
                [this.model.sequelize.Op.lte]: filters.maxPrice
            };
        }

        if (filters.brand_id) {
            whereConditions.brand_id = filters.brand_id;
        }

        if (filters.active !== undefined) {
            whereConditions.active = filters.active;
        }

        return whereConditions;
    };

    findProductsByCategoryId = async (categoryId, options = {}) => {
        const {
            page = 1,
            limit = 10,
            sort = 'createdAt',
            order = 'DESC',
            filters = {},
            includeSubCategories = true
        } = options;

        const offset = (page - 1) * limit;
        const whereConditions = this.buildWhereConditions(filters);

        // Kategori ID'lerine göre çekme işlemi
        const categoryRepository = new CategoryRepository();

        // Eğer alt kategoriler de isteniyorsa
        let categoryIds = [categoryId];

        if (includeSubCategories) {
            const subCategoryIds = await categoryRepository.findAllSubCategoryIds(categoryId);
            categoryIds = [...new Set([...categoryIds, ...subCategoryIds])];
        }

        const include = [
            {
                model: this.model.sequelize.models.Category,
                as: 'categories',
                through: {
                    attributes: []
                },
                where: {
                    id: {
                        [Op.in]: categoryIds
                    }
                }
            },
            // Diğer ilişkileri de ekleyebilirsiniz
            {
                model: this.model.sequelize.models.Brand,
                as: 'brand'
            },
            {
                model: this.model.sequelize.models.Image,
                as: 'images',
                where: { is_primary: true },
                required: false
            }
        ];

        const { rows: products, count: totalProducts } = await this.model.findAndCountAll({
            where: whereConditions,
            include,
            limit,
            offset,
            distinct: true,
            order: [[sort, order]]
        });

        const totalPages = Math.ceil(totalProducts / limit);

        return {
            products,
            pagination: {
                total: totalProducts,
                totalPages,
                currentPage: parseInt(page),
                pageSize: parseInt(limit),
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    };

}