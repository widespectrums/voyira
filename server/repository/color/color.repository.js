import BaseRepository from "../base.repository.js";
import models from "../../models/index.js"
const { Color } = models;

export default class ColorRepository extends BaseRepository {
    constructor() {
        super(Color);
    }

    findByName(name, options = {}) {
        return this.model.findOne({
            where: { name },
            ...options,
        })
    };
}