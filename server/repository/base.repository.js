import {Model} from "sequelize";

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
        return this.model.findByPk(id, options);
    };

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
};
