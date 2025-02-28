import {NotFoundError} from "../errors/api.error.js";

export default class BaseService {
    constructor(repository) {
        this.repository = repository;
    };

    create = async (data, options = {}) => {
        return this.repository.create(data, options);
    };

    getById = async (id, options = {}) => {
        const record = await this.repository.findById(id, options);
        if (!record) throw new NotFoundError(`${this.repository.model.name} not found!`);
        return record;
    };

    update = async (id, data, options = {}) => {
        return this.repository.update(id, data, options);
    };

    delete = async (id, options = {}) => {
        return this.repository.delete(id, { ...options, force: false });
    };
};
