import BaseService from "./base.service.js";
import {ConflictError, ForbiddenError, NotFoundError} from "../errors/api.error.js";
import bcrypt from "bcryptjs";

export default class UserService extends BaseService {
    constructor(userRepository, addressRepository) {
        super(userRepository);
        this.addressRepository = addressRepository;
    };

    getCurrentUserProfile = async (userId) => {
        const user = await this.repository.findByIdWithDetails(userId, {
            exclude: ['password', 'emailVerifyOtp', 'passwordResetOtp']
        });
        if (!user) throw new NotFoundError("User not found!");
        if (!user.active) throw new ForbiddenError('Account is deactivated');
        return user.get({ plain: true });
    };

    updateUserProfile = async (userId, updates) => {
        if (updates.email) {
            const existingUser = await this.repository.findByEmail(updates.email);
            if (existingUser && existingUser.id !== userId) throw new ConflictError('Email already in use!');
        }
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 12);
        }
        const updatedUser = await this.repository.update(userId, updates);
        if (!updatedUser) throw new NotFoundError("User not found!");
        return this.getCurrentUserProfile(userId);
    };

    deactivateUserAccount = async (userId) => {
        const transaction = await this.repository.model.sequelize.transaction();
        try {
            const user = await this.repository.findById(userId, { transaction });
            if (!user) throw new NotFoundError("User not found!");
            const addresses = await this.addressRepository.findAllByUser(userId, { transaction });
            for (const address of addresses) {await this.addressRepository.delete(address.id, { transaction });}
            await this.repository.update(userId, { active: false }, { transaction });
            await transaction.commit();
            return await this.repository.findById(userId, {
                attributes: { exclude: ['password', 'emailVerifyOtp', 'passwordResetOtp'] },
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };
};
