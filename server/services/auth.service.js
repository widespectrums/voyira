import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import env from '../config/env.js'
import {ConflictError, ForbiddenError, UnauthorizedError} from "../errors/api.error.js";

export default class AuthService {
    constructor(userRepository, emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
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

    initializeRegistration = async (userData) => {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) throw new ConflictError("Email already registered!");
        const newUser = await this.userRepository.create({...userData});
        const otp = this.generateOTP();
        await this.userRepository.update(newUser.id, {
            emailVerifyOtp: otp,
            emailVerifyOtpExpiredAt: this.generateExpiryTime(1)
        });
        await this.emailService.sendVerificationEmail(newUser.email, otp);
        return newUser;
    };

    completeRegistration = async (userData) => {
        const user = await this.userRepository.findByEmail(userData.email);
        if (!user.emailVerifyOtp) {throw new ForbiddenError("No OTP found for this email!");}
        if (!user.emailVerifyOtpExpiredAt > new Date()) {throw new ForbiddenError("OTP has expired!");}
        if (user.emailVerifyOtp !== userData.emailVerifyOtp) {throw new ForbiddenError("Invalid OTP!");}
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        await this.userRepository.updateEmailVerification(user.id, true);
        await this.userRepository.update(user.id, {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: hashedPassword
        });
        return user;
    };

    resendVerificationEmail = async (userData) => {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        const otp = this.generateOTP();
        await this.userRepository.update(existingUser.id, {
            emailVerifyOtp: otp,
            emailVerifyOtpExpiredAt: this.generateExpiryTime(1)
        });
        await this.emailService.sendVerificationEmail(existingUser.email, otp);
        return existingUser;
    }

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

    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    generateExpiryTime = (hours = 24) => {
        return Date.now() + hours * 60 * 60 * 1000;
    };
};
