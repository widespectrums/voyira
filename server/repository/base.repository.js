import {Model} from "sequelize";

export default class BaseRepository {
    constructor(model) {
        if (!(model.prototype instanceof Model)) {
            throw new Error("Invalid repository model schema!");
        }
        this.model = model;
    };

    async create(data, options = {}) {
        return this.model.create(data, options);
    };

    async findById(id, options = {}) {
        return this.model.findByPk(id, options);
    };

    async findAll(options = {}) {
        return this.model.findAll(options);
    };

    async update(id, data, options = {}) {
        const instance = await this.model.findByPk(id, options);
        if (!instance) throw new Error(`${this.model.name} not found!`);
        return instance.update(data, options);
    };

    async delete(id, options = {}) {
        const instance = await this.model.findByPk(id, options);
        if (!instance) throw new Error(`${this.model.name} not found!`);
        return instance.destroy(options);
    };
};
