import BaseController from "../../../core/base/base.controller.js";
import TagService from "../services/tag.service.js";

export default class TagController extends BaseController {
    constructor() {
        const tagService = new TagService();
        super(tagService);
    };

    createTag = async (req, res, next) => {
        try {
            const tag = await this.service.createTag(req.body);
            console.log("Received Body: ", req.body);
            this.handleResponse(res, {tag}, 201);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    updateTag = async (req, res, next) => {
        try {
            const tagId = req.params.id;
            const updatedTag = await this.service.updateTag(tagId, req.body);
            this.handleResponse(res, { tag: updatedTag }, 200);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    deleteTag = async (req, res, next) => {
        try {
            const tagId = req.params.id;
            const result = await this.service.deleteTag(tagId);

            this.handleResponse(res, {
                message: `Tag deleted successfully`,
                deletedTag: result.deletedTag
            }, 200);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    getAllTags = async (req, res, next) => {
        try {
            const options = {};
            if (req.query.sort) {
                const [field, order] = req.query.sort.split(':');
                options.order = [[field, order || 'ASC']];
            }
            if (req.query.limit) {
                options.limit = parseInt(req.query.limit);
            }
            if (req.query.offset) {
                options.offset = parseInt(req.query.offset);
            }
            const tags = await this.service.getAllTags(options);
            if (!tags || tags.length === 0) {
                return this.handleResponse(res, { tags: [] });
            }
            this.handleResponse(res, { tags });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    getTagById = async (req, res, next) => {
        try {
            const tagId = req.params.id;
            const options = {};
            if (req.query.include) {
                const includes = req.query.include.split(',');
                if (includes.includes('products')) {
                    options.include = ['products'];
                }
            }
            const tag = await this.service.getTagById(tagId, options);
            this.handleResponse(res, { tag });
        } catch (error) {
            this.handleError(next, error);
        }
    };
};
