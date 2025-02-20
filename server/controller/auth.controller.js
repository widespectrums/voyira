import BaseController from "./base.controller.js";
import { authService } from '../services/index.js'
import { ValidationError} from "../errors/api.error.js";

export default class AuthController extends BaseController {
    constructor() {
        super(authService);
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
    };

    async register(req, res, next) {
        try {
            const user = await this.service.register(req.body);
            this.handleResponse(res, { id: user.id }, 201);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const tokens = await authService.authenticate(email, password);
            authService.setAuthCookies(res, tokens);
            this.handleResponse(res, { user: tokens.user });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    async logout(req, res, next) {
        try {
            authService.clearAuthCookies(res);
            this.handleResponse(res, null, 204);
        } catch (error) {
            this.handleError(next, error);
        }
    };

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const tokens = await authService.refreshToken(refreshToken);
            authService.setAuthCookies(res, tokens);
            this.handleResponse(res, { user: tokens.user });
        } catch (error) {
            this.handleError(next, error);
        }
    };

    async verifyEmail(req, res, next) {
        try {
            const { otp } = req.body;
            const user = await authService.verifyEmail(req.user.id, otp);
            this.handleResponse(res, { verified: user.isEmailVerified });
        } catch (error) {
            this.handleError(next, error);
        }
    };
};