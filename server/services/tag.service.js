import BaseService from "./base.service.js";

export default class TagService extends BaseService {
    constructor(repository) {
        super(repository);
    };

    createTag = async (tagData) => {
        const existingTag = await this.repository.findByName(tagData.name);
        if (existingTag) throw new Error("Tag already exists!")
        return this.repository.create(tagData);
    };
}