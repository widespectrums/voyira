import UserRepository from '../repository/user.repository.js';
import AddressRepository from '../repository/address.repository.js';
import UserService from '../services/user.service.js'
import AuthService from '../services/auth.service.js';
import EmailService from '../services/email.service.js';
import AddressService from "./address.service.js";
import ProductService from "./product.service.js";
import {ProductRepository} from "../repository/index.js";
import {BrandRepository} from "../repository/index.js";

const userRepository = new UserRepository();
const addressRepository = new AddressRepository();

const emailService = new EmailService();

const productRepository = new ProductRepository();
const brandRepository = new BrandRepository();


export const userService = new UserService(userRepository, addressRepository);
export const authService = new AuthService(userRepository, emailService);
export const addressService = new AddressService(addressRepository, userRepository)

export const productService = new ProductService(productRepository, brandRepository);