import BaseRepository from "./base.repository.js";
import Address from "../model/address.model.js";

export default class AddressRepository extends BaseRepository {
    constructor() {
        super(Address);
    };

    findAllByUser = async (userId, options = {}) => {
        return this.model.findAll({
            where: { userId },
            ...options
        });
    };

    createForUser = async (userId, addressData, options = {}) => {
        return this.create({
            ...addressData,
            userId
        }, options);
    };

    updateUserAddress = async (addressId, userId, updates, options = {}) => {
        const address = await this.model.findOne({
            where: { id: addressId, userId },
            ...options
        });
        if (!address) throw new Error("Address not found!");
        return address.update(updates, options);
    };

    deleteUserAddress = async (addressId, userId, options = {}) => {
        const address = await this.model.findOne({
            where: { id: addressId, userId },
            ...options
        });
        if (!address) throw new Error("Address not found!");
        return address.destroy(options);
    };
};
