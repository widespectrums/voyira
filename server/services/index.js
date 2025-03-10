import UserRepository from '../repository/user/user.repository.js';
import AddressRepository from '../repository/address/address.repository.js';
import ImageRepository from '../repository/image/image.repository.js';
import UserService from './user/user.service.js';
import AuthService from './auth/auth.service.js';
import EmailService from './email/email.service.js';
import AddressService from "./address/address.service.js";
import ProductService from "./product/product.service.js";
import BrandService from "./brand/brand.service.js";
import CategoryService from "./category/category.service.js";
import TagService from "./tag/tag.service.js";
import ColorService from "./color/color.service.js";
import SizeService from "./size/size.service.js";
import ImageService from "./image/image.service.js";
import {productSizesRepository} from "../repository/index.js";
import {productCategoriesRepository} from "../repository/index.js";
import {productColorsRepository} from "../repository/index.js";
import {productTagsRepository} from "../repository/index.js";

import {
    BrandRepository, CategoryRepository, ProductRepository,
    TagRepository, ColorRepository, SizeRepository
} from "../repository/index.js";


const userRepository = new UserRepository();
const addressRepository = new AddressRepository();
const imageRepository = new ImageRepository();

const emailService = new EmailService();

const productRepository = new ProductRepository();
const brandRepository = new BrandRepository();
const categoryRepository = new CategoryRepository();
const tagRepository = new TagRepository();
const colorRepository = new ColorRepository();
const sizeRepository = new SizeRepository();


export const userService = new UserService(userRepository, addressRepository);
export const authService = new AuthService(userRepository, emailService);
export const addressService = new AddressService(addressRepository, userRepository);

export const categoryService = new CategoryService(categoryRepository);
export const brandService = new BrandService(brandRepository);
export const tagService = new TagService(tagRepository);
export const colorService = new ColorService(colorRepository);
export const sizeService = new SizeService(sizeRepository);
export const imageService = new ImageService(imageRepository);

export const productService = new ProductService(
    productRepository, brandRepository, productCategoriesRepository,
    productTagsRepository, productColorsRepository, productSizesRepository,
    categoryRepository, tagRepository, colorRepository,
    sizeRepository, imageRepository
);