import BaseService from "../../../core/base/base.service.js";
import UserRepository from "../repositories/user.repository.js";
import AddressRepository from "../repositories/address.repository.js";
import EmailService from "../../email/services/email.service.js";
import AuthService from "../../auth/services/auth.service.js";
import {ConflictError, ForbiddenError, NotFoundError} from "../../../core/errors/api.error.js";
import bcrypt from "bcryptjs";

export default class UserService extends BaseService {
    constructor() {
        const userRepository = new UserRepository();
        super(userRepository);

        this.addressRepository = new AddressRepository();
        this.emailService = new EmailService();
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
        const user = await this.repository.findById(userId);
        if (!user) throw new NotFoundError("User not found!");
        const transaction = await this.repository.model.sequelize.transaction();
        try {
            await user.update({ active: false }, { transaction });
            const addresses = await this.addressRepository.findAllAddressesByUser(userId, { transaction });
            for (const address of addresses) { await this.addressRepository.delete(address, { transaction, force: false });}
            await this.repository.delete(user, { transaction, force: false });
            await transaction.commit();
            return user;
        } catch (error) {await transaction.rollback(); throw error;}
    };
};
