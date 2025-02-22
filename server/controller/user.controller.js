import { userService } from "../services/index.js";
import BaseController from "./base.controller.js";

export default class UserController extends BaseController {
    constructor() {
        super(userService);
    };

    getProfile = async (req, res, next) => {
        try {
            const user = await this.service.getUserWithAddresses(req.user.id);
            this.handleResponse(req, res, user);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    updateProfile = async (req, res, next) => {
        try {
            const updatedUser = await this.service.updateUserProfile(
                req.user.id,
                req.body
            );
            this.handleResponse(res, updatedUser);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    deleteUser = async (req, res, next) => {
        try {
            await this.service.deleteUser(req.user.id);
            this.handleResponse(res, null, 204);
        } catch (error) {
            this.handleError(next, error);
        }
    };
}