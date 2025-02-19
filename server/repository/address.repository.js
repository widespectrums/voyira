import BaseRepository from "./base.repository.js";
import Address from "../model/address.model.js";

export default class AddressRepository extends BaseRepository {
    constructor() {
        super(Address);
    };

    async findAllByUser(userId, options = {}) {
        return this.model.findAll({
            where: { userId },
            ...options
        });
    };

    async createForUser(userId, addressData, options = {}) {
        return this.create({
            ...addressData,
            userId
        }, options);
    };

    async updateUserAddress(addressId, userId, updates, options = {}) {
        const address = await this.model.findOne({
            where: { id: addressId, userId },
            ...options
        });
        if (!address) throw new Error("Address not found!");
        return address.update(updates, options);
    };

    async deleteUserAddress(addressId, userId, options = {}) {
        const address = await this.model.findOne({
            where: { id: addressId, userId },
            ...options
        });
        if (!address) throw new Error("Address not found!");
        return address.destroy(options);
    };
};
