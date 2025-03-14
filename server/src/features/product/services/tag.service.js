import BaseService from "../../../core/base/base.service.js";
import TagRepository from "../repositories/tag.repository.js";

export default class TagService extends BaseService {
    constructor() {
        const tagRepository = new TagRepository();
        super(tagRepository);
    };

    createTag = async (tagData) => {
        const existingTag = await this.repository.findByName(tagData.name);
        if (existingTag) throw new Error("Tag already exists!")
        return this.repository.create(tagData);
    };
};
