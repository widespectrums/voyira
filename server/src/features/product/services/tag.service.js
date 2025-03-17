import BaseService from "../../../core/base/base.service.js";
import TagRepository from "../repositories/tag.repository.js";
import {NotFoundError} from "../../../core/errors/api.error.js";

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

    updateTag = async (id, data) => {
        const tag = await this.repository.findById(id);
        if (!tag) throw new NotFoundError(`Tag with id ${id} not found!`);
        return this.repository.updateTag(id, data);
    };

    deleteTag = async (id) => {
        const tag = await this.repository.findById(id);
        if (!tag) throw new NotFoundError(`Tag with id ${id} not found!`);
        return this.repository.deleteTag(id);
    };

    getAllTags = async (options = {}) => {
        try {
            const tags = await this.repository.findAll(options);
            return tags;
        } catch (error) {
            console.error("Error getting all tags:", error);
            throw error;
        }
    };

    getTagById = async (id, options = {}) => {
        try {
            const tag = await this.repository.findById(id, options);
            if (!tag) throw new NotFoundError(`Tag with id ${id} not found!`);
            return tag;
        } catch (error) {
            console.error(`Error getting tag with id ${id}:`, error);
            throw error;
        }
    };
};
