import BaseRepository from "../base.repository.js";
import models from "../../models/index.js"
const { Size } = models;

export default class SizeRepository extends BaseRepository {
    constructor() {
        super(Size);
    };

    findByName(name, options = {}) {
        return this.model.findOne({
            where: { name },
            ...options,
        })
    };
};