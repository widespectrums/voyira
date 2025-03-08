import models from "../../models/index.js";
import BaseRepository from "../base/base.repository.js";
const { Brand } = models;

export default class BrandRepository extends BaseRepository {
    constructor() {
        super(Brand);
    };

    findByName = async (name, options = {}) => {
        return this.model.findOne({ where: { name }, ...options });
    };
};