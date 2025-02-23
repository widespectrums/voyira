import BaseService from "./base.service.js";
import {NotFoundError} from "../errors/api.error.js";

export default class AddressService extends BaseService {
    constructor(repository, userRepository) {
        super(repository);
        this.userRepository = userRepository;
    };

    async createUserAddress(userId, addressData) {
        const user = await this.userRepository.findById(userId);
        console.log(userId)
        if (!user) throw new NotFoundError("User not found!");
        return this.repository.create({...addressData, userId});
    };
}