import BaseRepository from "../base.repository.js";
import models from "../../models/index.js"
const { Tag } = models;

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