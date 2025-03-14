import BaseRepository from "../../../core/base/base.repository.js";
import Tag from "../models/tag.model.js";

export default class TagRepository extends BaseRepository {
    constructor() {
        super(Tag);
    };

    findByName(name, options = {}) {
        return this.model.findOne({
            where: { name },
            ...options,
        })
    };
};