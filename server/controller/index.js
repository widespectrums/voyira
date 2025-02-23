import AuthController from './auth.controller.js';
import UserController from './user.controller.js'
import AddressController from "./address.controller.js";
import {addressService, userService} from "../services/index.js";


export const authController = new AuthController();
export const userController = new UserController(userService);
export const addressController = new AddressController(addressService);