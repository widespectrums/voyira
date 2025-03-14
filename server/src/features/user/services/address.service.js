import BaseService from "../../../core/base/base.service.js";
import AddressRepository from "../repositories/address.repository.js";
import UserRepository from "../repositories/user.repository.js";
import {ForbiddenError, NotFoundError} from "../../../core/errors/api.error.js";

export default class AddressService extends BaseService {
    constructor() {
        const addressRepository = new AddressRepository();
        super(addressRepository);

        this.userRepository = new UserRepository();
    };

    createUserAddress = async (userId, addressData) => {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundError("User not found!");
        return this.repository.create({...addressData, userId});
    };

    getUserAddresses = async (userId) => {
        return this.repository.findAllAddressesByUser(userId, {attributes: {exclude: ['userId']}});
    };

    updateUserAddress = async (addressId, userId, updates) => {
        return this.repository.updateUserAddress(addressId, userId, updates);
    };

    deleteUserAddress = async (addressId, userId) => {
        const address = await this.repository.findById(addressId);
        if (!address) throw new NotFoundError("Address not found!");
        if (address.userId !== userId) throw new ForbiddenError("Unauthorized to delete this address!");
        return this.repository.delete(addressId, { force: false });
    };
};
