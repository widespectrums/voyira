// controller/index.js - Düzeltilmiş versiyon
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
    imageService,
    cartService,
    shippingMethodService
} from "../services/index.js";
import ProductController from "./product.controller.js";
import CategoryController from "./category.controller.js";
import BrandController from "./brand.controller.js";
import TagController from "./tag.controller.js";
import ColorController from "./color.controller.js";
import SizeController from "./size.controller.js";
import CartController from "./cart.controller.js";
import ShippingMethodController from "./shippingMethod.controller.js";

// Bu kısmı kaldırıyoruz, çünkü service/index.js'den zaten import ediyoruz
// import CartRepository from "../repository/cart.repository.js";
// import CartItemRepository from "../repository/cartItem.repository.js"; // Burası yanlıştı!
// import ShippingMethodRepository from "../repository/shippingMethod.repository.js";

// import CartService from "../services/cart.service.js";
// import ShippingMethodService from "../services/shippingMethod.service.js";

// const cartRepository = new CartRepository();
// const cartItemRepository = new CartItemRepository();
// const shippingMethodRepository = new ShippingMethodRepository();

// const shippingMethodService = new ShippingMethodService(shippingMethodRepository);
// const cartService = new CartService(cartRepository, cartItemRepository, productService);

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

export const cartController = new CartController(cartService);
export const shippingMethodController = new ShippingMethodController(shippingMethodService);