import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import env from '../config/env.js'
import {ConflictError, ForbiddenError, UnauthorizedError} from "../errors/api.error.js";

export default class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.tokenSecret = env.jwt.secret;
        this.refreshTokenSecret = env.jwt.refreshTokenSecret;
    };

    authenticate = async (email, password) => {
        const user = await this.userRepository.findByEmail(email, {
            attributes: ['id', 'password', 'role', 'isEmailVerified', 'active']
        });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedError("Invalid credentials!");
        }
        return this.generateTokens(user);
    };

    register = async (userData) => {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) throw new ConflictError("Email already registered!");

        const hashedPassword = await bcrypt.hash(userData.password, 12);
        return this.userRepository.create({ ...userData, password: hashedPassword });
    };


    generateTokens(user) {
        const accessToken = jwt.sign(
            { userId: user.id, role: user.role },
            this.tokenSecret,
            { expiresIn: env.jwt.accessExpiration }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            this.refreshTokenSecret,
            { expiresIn: env.jwt.refreshExpiration }
        );

        return {
            accessToken, refreshToken,
            user: { id: user.id, role: user.role }
        }
    };

    refreshToken = async (refreshToken) => {
        try {
            const decoded = jwt.verify(refreshToken, this.refreshTokenSecret);
            const user = await this.userRepository.findById(decoded.userId);
            if (!user) throw new UnauthorizedError("User not found!");
            return this.generateTokens(user);
        } catch (error) { throw new UnauthorizedError("Invalid refresh token!"); }
    };

    setAuthCookies(res, tokens) {
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: env.nodeEnv,
            sameSite: 'Strict',
            maxAge: 15 * 60 * 1000
        });
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: env.nodeEnv,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
    };

    clearAuthCookies(res) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
    };
};