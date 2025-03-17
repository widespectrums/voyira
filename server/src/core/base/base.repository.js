import {Model} from "sequelize";
import sequelize from "../../config/database.js";
import { Op } from "sequelize";


export default class BaseRepository {
    constructor(model) {
        if (!(model.prototype instanceof Model)) {
            throw new Error("Invalid repository models schema!");
        }
        this.model = model;
    };

    create = async (data, options = {}) => {
        return this.model.create(data, options);
    };

    findById = async (id, options = {}) => {
        try {
            const result = await this.model.findByPk(id, options);
            return result;
        } catch (error) {
            console.error(`Error in findById for ${this.model.name}:`, error);
            // Detaylı hata mesajını logla
            if (error.original) {
                console.error("SQL Error Details:", {
                    code: error.original.code,
                    detail: error.original.detail,
                    message: error.original.message,
                    query: error.sql
                });
            }
            throw error;
        }
    }

    findAll = async (options = {}) => {
        return this.model.findAll(options);
    };

    update = async (id, data, options = {}) => {
        const instance = await this.model.findByPk(id, options);
        if (!instance) throw new Error(`${this.model.name} not found!`);
        return instance.update(data, options);
    };

    delete = async (identifier, options = {}) => {
        let instance;
        if(identifier instanceof this.model) {
            instance = identifier;
        } else {
            instance = await this.model.findByPk(identifier, options);
            if (!instance) throw new Error(`${this.model.name} not found!`);
        }
        const useForce = options.force === true;
        return instance.destroy({ ...options, force: useForce });
    };

    startTransaction() {
        return sequelize.transaction();
    };

    bulkDelete = async (identifiers, options = {}) => {
        if (!Array.isArray(identifiers) || identifiers.length === 0) {
            return 0;
        }

        return this.model.destroy({
            where: {
                id: {
                    [Op.in]: identifiers
                }
            },
            ...options
        });
    };
};

