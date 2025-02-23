import BaseRepository from "./base.repository.js";
import models from "../models/index.js";
const { User, Address } = models;


export default class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    };

    findByIdWithDetails = async (id, options = {}) => {
        return this.model.findByPk(id, {
            attributes: {
                exclude: options.exclude || [],
            },
            include: [{
                model: Address,
                as: 'addresses',
                attributes: {exclude: ['userId']},
            }]
        });
    };

    findByEmail = async (email, options = {}) => {
        return this.model.findOne({
            where: { email },
            ...options,
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
