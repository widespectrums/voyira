import BaseController from "./base.controller.js";

export default class UserController extends BaseController {
    constructor(service) {
        super(service);
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
}
