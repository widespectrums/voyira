import BaseService from "./base.service.js";
import {ConflictError} from "../errors/api.error.js";
import bcrypt from 'bcryptjs';

export default class UserService extends BaseService {
    constructor(userRepository, addressRepository) {
        super(userRepository);
        this.addressRepository = addressRepository;
    };

    async getUserWithAddresses(userId) {
        return this.repository.findByIdWithAddresses(userId, {
            attributes: { exclude: ['password', 'emailVerifyOtp'] }
        });
    };

    async updateUserProfile(userId, updates) {
        if (updates.password) { updates.password = await bcrypt.hash(updates.password, 12); }
        return this.repository.update(userId, updates);
    };

    async deleteUser(userId) {
        const transaction = await this.repository.model.sequelize.transaction();
        try {
            await this.addressRepository.deleteAllUserAddresses(userId, { transaction });
            const result = await this.repository.softDelete(userId, { transaction });
            await transaction.commit();
            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };
};