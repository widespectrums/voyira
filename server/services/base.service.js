import {NotFoundError} from "../errors/api.error.js";

export default class BaseService {
    constructor(repository) {
        this.repository = repository;
    };

    async create(data, options = {}) {
        return this.repository.create(data, options);
    };

    async getById(id, options = {}) {
        const record = await this.repository.findById(id, options);
        if (!record) throw new NotFoundError(`${this.repository.model.name} not found!`);
        return record;
    };

    async update(id, data, options = {}) {
        return this.repository.update(id, data, options);
    };

    async delete(id, options = {}) {
        return this.repository.delete(id, options);
    };
};