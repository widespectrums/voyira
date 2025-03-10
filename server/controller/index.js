import AuthController from './auth.controller.js';
import UserController from './user.controller.js';
import AddressController from "./address.controller.js";
import ImageController from "./image.controller.js";
import {
    addressService,
    userService,
    productService,
    categoryService,
    brandService,
    tagService,
    colorService,
    sizeService,
    imageService
} from "../services/index.js";
import ProductController from "./product.controller.js";
import CategoryController from "./category.controller.js";
import BrandController from "./brand.controller.js";
import TagController from "./tag.controller.js";
import ColorController from "./color.controller.js";
import SizeController from "./size.controller.js";


export const authController = new AuthController();
export const userController = new UserController(userService);
export const addressController = new AddressController(addressService);
export const productController = new ProductController(productService);
export const categoryController = new CategoryController(categoryService);
export const brandController = new BrandController(brandService);
export const tagController = new TagController(tagService);
export const colorController = new ColorController(colorService);
export const sizeController = new SizeController(sizeService);
export const imageController = new ImageController(imageService, productService);