import BaseRepository from "../../../core/base/base.repository.js";
import Color from "../models/color.model.js";

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