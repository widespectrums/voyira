import UserRepository from './user/user.repository.js';
import AddressRepository from './address/address.repository.js';
import ProductRepository from './product/product.repository.js';
import BrandRepository from './brand/brand.repository.js';
import CategoryRepository from './category/category.repository.js';
import TagRepository from './tag/tag.repository.js';
import ColorRepository from './color/color.repository.js';
import SizeRepository from './size/size.repository.js';
import ImageRepository from './image/image.repository.js';
import ProductCategoriesRepository from "./product/product-categories.repository.js";
import ProductSizesRepository from "./product/product-sizes.repository.js";
import ProductColorsRepository from "./product/product-colors.repository.js";
import ProductTagsRepository from "./product/product-tags.repository.js";

const categoryRepository = new CategoryRepository();
const sizeRepository = new SizeRepository();
const colorRepository = new ColorRepository();
const tagRepository = new TagRepository();

const productCategoriesRepository = new ProductCategoriesRepository(categoryRepository);
const productSizesRepository = new ProductSizesRepository(sizeRepository);
const productColorsRepository = new ProductColorsRepository(colorRepository);
const productTagsRepository = new ProductTagsRepository(tagRepository);

export {
    UserRepository, AddressRepository, ProductRepository,
    BrandRepository, CategoryRepository, TagRepository,
    ColorRepository, SizeRepository, ImageRepository,
    productCategoriesRepository, productSizesRepository,
    productTagsRepository, productColorsRepository
};