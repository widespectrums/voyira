import BaseService from "../../../core/base/base.service.js";
import SizeRepository from "../repositories/size.repository.js";

export default class SizeService extends BaseService {
    constructor() {
        const sizeRepository = new SizeRepository()
        super(sizeRepository);
    };

    createSize = async (sizeData) => {
        const existingSize = await this.repository.findByName(sizeData.name);
        if (existingSize) throw new Error("Size already exists!")
        return this.repository.create(sizeData);
    };
};
