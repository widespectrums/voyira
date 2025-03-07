import BaseService from "./base.service.js";

export default class ColorService extends BaseService {
    constructor(repository) {
        super(repository);

    };

    createColor = async (colorData) => {
        const existingColor = await this.repository.findByName(colorData.name);
        if (existingColor) throw new Error("Color already exists!");
        return this.repository.create(colorData);
    };
};