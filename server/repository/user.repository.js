import BaseRepository from "./base.repository.js";
import User from "../model/user.model.js";
import Address from "../model/address.model.js";

export default class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    };

    async findByEmail(email, options = {}) {
        return this.model.findOne({
            where: { email },
            ...options,
        });
    };

    async findByUsername(username, options = {}) {
        return this.model.findOne({
            where: { username },
            ...options,
        });
    };

    async findByIdWithAddresses(id, options = {}) {
        return this.model.findByPk(id, {
            ...options,
            include: [{
                model: Address,
                as: 'user',
                attributes: { exclude: ['userId'] }
            }]
        });
    };

    async updateEmailVerification(userId, isVerified, options = {}) {
        return this.update(userId, {
            isEmailVerified: isVerified,
            emailVerifiedDate: isVerified ? new Date() : null
        }, options);
    };

    async softDelete(userId, options = {}) {
        return this.delete(userId, options);
    };
};
