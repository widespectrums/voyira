import {ForbiddenError, UnauthorizedError} from "../errors/api.error.js";
import env from "../../config/env.js";
import jwt from "jsonwebtoken";
import UserService from "../../features/user/services/user.service.js";

export const authMiddleware = (roles = [], options = {}) => async (req, res, next) => {

    try {
        const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
        if (!token) throw new UnauthorizedError("Authentication required!");
        const decoded = jwt.verify(token, env.jwt.secret);
        const userService = new UserService();
        const user = await userService.getById(decoded.userId, {
            attributes: ['id', 'role', 'active', 'isEmailVerified'],
            ...options,
        });
        if (!user) throw new UnauthorizedError("User not found!");
        if (!user.active) throw new ForbiddenError("Account is deactivated!");
        if (!user.isEmailVerified) throw new ForbiddenError("Email verification required!");
        if (roles.length > 0 && !roles.includes(user.role))  throw new ForbiddenError("Insufficient permission!")
        req.auth = {
            userId: user.id,
            role: user.role,
        };
        next();
    } catch (error) {
        next(error);
    }
};
