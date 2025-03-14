import BaseRepository from "../../../core/base/base.repository.js";
import Brand from "../models/brand.model.js";

export default class BrandRepository extends BaseRepository {
    constructor() {
        super(Brand);
    };

    findByName = async (name, options = {}) => {
        return this.model.findOne({ where: { name }, ...options });
    };
};