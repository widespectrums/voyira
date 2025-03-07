import BaseService from "./base.service.js";

export default class SizeService extends BaseService {
    constructor(repository) {
        super(repository);
    };

    createSize = async (sizeData) => {
        const existingSize = await this.repository.findByName(sizeData.name);
        if (existingSize) throw new Error("Size already exists!")
        return this.repository.create(sizeData);
    };
}