import BaseController from "./base.controller.js";
import { authService } from '../services/index.js'

export default class AuthController extends BaseController {
    constructor() {
        super(authService);
    }

    resendVerificationEmail = async (req, res, next) => {
        try {
            const user = await this.service.resendVerificationEmail(req.body);
            console.log("Received Body:", req.body);
            this.handleResponse(res, { id: user.id }, 201);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    completeRegistration = async (req, res, next) => {
        try {
            const user = await this.service.completeRegistration(req.body);
            console.log("Received Body:", req.body);
            this.handleResponse(res, { id: user.id }, 201);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    initializeRegistration = async (req, res, next) => {
        try {
            const user = await this.service.initializeRegistration(req.body);
            console.log("Received Body:", req.body);
            this.handleResponse(res, { id: user.id }, 201);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const tokens = await authService.authenticate(email, password, ipAddress);
            authService.setAuthCookies(res, tokens);
            this.handleResponse(res, { user: tokens.user }, 200);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    logout = async (req, res, next) => {
        try {
            authService.clearAuthCookies(res);
            this.handleResponse(res, {}, 204);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    sendForgetPasswordOtp = async (req, res, next) => {
        try {
            const user = await this.service.sendForgetPasswordOtp(req.body);
            console.log("Received Body:", req.body);
            this.handleResponse(res, { id: user.id }, 201);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    recoverPassword = async (req, res, next) => {
        try {
            const user = await this.service.recoverPassword(req.body);
            console.log("Received Body:", req.body);
            this.handleResponse(res, { id: user.id }, 201);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    initializeEmailChange = async (req, res, next) => {
        try {
            const result = await this.service.initializeEmailChange(
                req.auth.userId,
                req.body.newEmail
            );
            this.handleResponse(res, result);
        } catch (error) {
            next(error);
        }
    };

    verifyEmailChange = async (req, res, next) => {
        try {
            const result = await this.service.verifyEmailChange(
                req.auth.userId,
                req.body.otp
            );
            this.handleResponse(res, result);
        } catch (error) {
            next(error);
        }
    };

    refreshToken = async (req, res, next) => {
        try {
            const { refreshToken } = req.cookies;
            const tokens = await authService.refreshToken(refreshToken);
            authService.setAuthCookies(res, tokens);
            this.handleResponse(res, { user: tokens.user });
        } catch (error) {
            this.handleError(next, error);
        }
    };
};
