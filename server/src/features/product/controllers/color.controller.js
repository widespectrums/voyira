import BaseController from "../../../core/base/base.controller.js";
import ColorService from "../services/color.service.js";

export default class ColorController extends BaseController {
    constructor() {
        const colorService = new ColorService();
        super(colorService);
    };

    createColor = async (req, res, next) => {
        try {
            const color = await this.service.createColor(req.body);
            console.log("Received Body: ", req.body);
            this.handleResponse(res, {color}, 201)
        } catch (error) {
            this.handleError(next, error);
        }
    };
}