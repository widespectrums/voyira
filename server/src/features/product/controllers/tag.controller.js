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
}