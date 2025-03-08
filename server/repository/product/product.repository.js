import BaseRepository from "../base.repository.js";
import models from "../../models/index.js";
const { Product } = models;

export default class ProductRepository extends BaseRepository {
    constructor() {
        super(Product);
    };

    findBySlug = (slug, options = {}) => {
        return this.model.findOne({
            where: { slug },
            ...options
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
    }

}