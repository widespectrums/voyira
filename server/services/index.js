import UserRepository from '../repository/user.repository.js';
import AddressRepository from '../repository/address.repository.js';
import UserService from '../services/user.service.js'
import AuthService from '../services/auth.service.js';
import EmailService from '../services/email.service.js';
import AddressService from "./address.service.js";
import ProductService from "./product.service.js";
import BrandService from "./brand.service.js";
import CategoryService from "./category.service.js";
import TagService from "./tag.service.js";
import ColorService from "./color.service.js";
import {
    BrandRepository, CategoryRepository, ProductRepository,
    TagRepository, ColorRepository, SizeRepository
} from "../repository/index.js";
import SizeService from "./size.service.js";


const userRepository = new UserRepository();
const addressRepository = new AddressRepository();

const emailService = new EmailService();

const productRepository = new ProductRepository();
const brandRepository = new BrandRepository();
const categoryRepository = new CategoryRepository();
const tagRepository = new TagRepository();
const colorRepository = new ColorRepository();
const sizeRepository = new SizeRepository();


export const userService = new UserService(userRepository, addressRepository);
export const authService = new AuthService(userRepository, emailService);
export const addressService = new AddressService(addressRepository, userRepository)

export const productService = new ProductService(productRepository, brandRepository, categoryRepository, tagRepository, colorRepository, sizeRepository);
export const categoryService = new CategoryService(categoryRepository);
export const brandService = new BrandService(brandRepository);
export const tagService = new TagService(tagRepository);
export const colorService = new ColorService(colorRepository);
export const sizeService = new SizeService(sizeRepository);