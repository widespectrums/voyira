import BaseRepository from "../../../core/base/base.repository.js";
import Size from "../models/size.model.js";

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