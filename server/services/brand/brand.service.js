import BaseService from "../base.service.js";

export default class BrandService extends BaseService {
    constructor(repository) {
        super(repository);
    };

    createBrand = async (brandData) => {
        const existingBrand = await this.repository.findByName(brandData.name);
        if (existingBrand) throw new Error("Brand already exists!");
        return this.repository.create({...brandData});
    };

};