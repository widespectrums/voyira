import BaseService from "./base.service.js";

export default class ProductService extends BaseService {
    constructor(repository, brandRepository) {
        super(repository);
        this.brandRepository = brandRepository;
    };

    createProduct = async (productData) => {
        if (productData.brand_id) {
            const brand = await this.brandRepository.findById(productData.brand_id);
            if (!brand) throw new Error("Invalid brand!");
        }
        return this.repository.create({...productData});
    };
};