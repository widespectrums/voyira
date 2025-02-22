import BaseRepository from "./base.repository.js";
import User from "../model/user.model.js";
import Address from "../model/address.model.js";

export default class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    };

    findByEmail = async (email, options = {}) => {
        return this.model.findOne({
            where: { email },
            ...options,
        });
    };

    findByUsername = async (username, options = {}) => {
        return this.model.findOne({
            where: { username },
            ...options,
        });
    };

    findByIdWithAddresses = async (id, options = {}) => {
        return this.model.findByPk(id, {
            ...options,
            include: [{
                model: Address,
                as: 'user',
                attributes: { exclude: ['userId'] }
            }]
        });
    };

    updateEmailVerification = async (userId, isVerified, options = {}) => {
        return this.update(userId, {
            isEmailVerified: isVerified,
            emailVerifiedDate: isVerified ? new Date() : null
        }, options);
    };

    softDelete = async (userId, options = {}) => {
        return this.delete(userId, options);
    };
};
