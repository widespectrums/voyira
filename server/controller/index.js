import AuthController from './auth.controller.js';
import UserController from './user.controller.js'
import AddressController from "./address.controller.js";
import {addressService, userService, productService} from "../services/index.js";
import ProductController from "./product.controller.js";


export const authController = new AuthController();
export const userController = new UserController(userService);
export const addressController = new AddressController(addressService);
export const productController = new ProductController(productService);