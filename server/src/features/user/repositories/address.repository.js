import BaseRepository from "../../../core/base/base.repository.js";
import Address from "../models/address.model.js";

export default class AddressRepository extends BaseRepository {
    constructor() {
        super(Address);
    };

    findAllAddressesByUser = async (userId, options = {}) => {
        return this.model.findAll({
            where: { userId },
            ...options
        });
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
        const useForce = options.force === true;
        return address.destroy({ ...options, force: useForce });
    };
};
