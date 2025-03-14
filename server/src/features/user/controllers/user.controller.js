import BaseController from "../../../core/base/base.controller.js";
import UserService from "../services/user.service.js";

export default class UserController extends BaseController {
    constructor() {
        const userService = new UserService();
        super(userService);
    };

    getProfile = async (req, res, next) => {
        try {
            const user = await this.service.getCurrentUserProfile(req.auth.userId);
            this.handleResponse(res, user);
        } catch (error) {
            next(error);
        }
    };

    updateProfile = async (req, res, next) => {
        try {
            const updatedUser = await this.service.updateUserProfile(
                req.auth.userId,
                req.body
            );
            this.handleResponse(res, updatedUser);
        } catch (error) {
            next(error);
        }
    };

    deactivateAccount = async (req, res, next) => {
        try {
            const deactivatedUser = await this.service.deactivateUserAccount(req.auth.userId);
            this.handleResponse(res, null, 204);
        } catch (error) {
            next(error);
        }
    };
};
