import BaseService from "../../../core/base/base.service.js";
import ColorRepository from "../repositories/color.repository.js";

export default class ColorService extends BaseService {
    constructor() {
        const colorRepository = new ColorRepository();
        super(colorRepository);

    };

    createColor = async (colorData) => {
        const existingColor = await this.repository.findByName(colorData.name);
        if (existingColor) throw new Error("Color already exists!");
        return this.repository.create(colorData);
    };
};
