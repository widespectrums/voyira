import BaseService from "../../../core/base/base.service.js";
import BrandRepository from "../repositories/brand.repository.js";

export default class BrandService extends BaseService {
    constructor() {
        const brandRepository = new BrandRepository();
        super(brandRepository);
    };

    createBrand = async (brandData) => {
        const existingBrand = await this.repository.findByName(brandData.name);
        if (existingBrand) throw new Error("Brand already exists!");
        return this.repository.create({...brandData});
    };

};
