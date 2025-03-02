import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import env from '../config/env.js';
import geoip from "geoip-lite";
import {ConflictError, NotFoundError, UnauthorizedError, ValidationError} from "../errors/api.error.js";
import BaseService from "./base.service.js";
import {userBaseSchema as existingUser, userBaseSchema as newUser} from "../validations/schemas/user.schema.js";

export default class AuthService extends BaseService {
    constructor(userRepository, emailService) {
        super(userRepository);
        this.emailService = emailService;
        this.tokenSecret = env.jwt.secret;
        this.refreshTokenSecret = env.jwt.refreshTokenSecret;
    };

    authenticate = async (email, password, ipAddress) => {
        const user = await this.repository.findByEmail(email, {
            attributes: ['id', 'password', 'role', 'isEmailVerified', 'active']
        });
        const geoData = geoip.lookup(ipAddress);
        if (!user) throw new UnauthorizedError("Invalid credentials!");
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            await this.repository.update(user.id, {
                lastFailedLoginDate: new Date(),
                lastFailedLoginIp: ipAddress,
                lastFailedLoginLocation: geoData ? geoData.city || geoData.region : 'Unknown'
            });
            throw new UnauthorizedError("Invalid credentials!");
        }
        await this.repository.update(user.id, {
            lastLoginDate: new Date(),
            lastLoginIp: ipAddress,
            lastLoginLocation: geoData ? geoData.city || geoData.region : 'Unknown'
        })

        return this.generateTokens(user);
    };

    initializeRegistration = async (userData) => {
        const existingUser = await this.repository.findByEmail(userData.email);
        if (existingUser) throw new ConflictError("Email already registered!");
        const newUser = await this.repository.create({...userData});
        const otp = this.generateOTP();
        await this.repository.update(newUser.id, {
            emailVerifyOtp: otp,
            emailVerifyOtpExpiredAt: this.generateExpiryTime(1)
        });
        await this.emailService.sendVerificationEmail(newUser.email, otp);
        return newUser;
    };

    completeRegistration = async (userData) => {
        const user = await this.repository.findByEmail(userData.email);
        if (!user) throw new NotFoundError("User not found!");
        if (!user.emailVerifyOtp) {throw new ValidationError("No OTP found for this email!");}
        if (!user.emailVerifyOtpExpiredAt > new Date()) {throw new ValidationError("OTP has expired!");}
        if (user.emailVerifyOtp !== userData.emailVerifyOtp) {throw new ValidationError("Invalid OTP!");}
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        await this.repository.updateEmailVerification(user.id, true);
        await this.repository.update(user.id, {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: hashedPassword
        });
        return user;
    };

    resendVerificationEmail = async (userData) => {
        const existingUser = await this.repository.findByEmail(userData.email);
        if (!existingUser) throw new NotFoundError("User not found!");
        const otp = this.generateOTP();
        await this.repository.update(existingUser.id, {
            emailVerifyOtp: otp,
            emailVerifyOtpExpiredAt: this.generateExpiryTime(1)
        });
        await this.emailService.sendVerificationEmail(existingUser.email, otp);
        return existingUser;
    };

    sendForgetPasswordOtp = async (userData) => {
        const existingUser = await this.repository.findByEmail(userData.email);
        if (!existingUser) throw new NotFoundError("User not found!");
        const otp = this.generateOTP();
        await this.repository.update(existingUser.id, {
            forgetPasswordOtp: otp,
            forgetPasswordOtpExpiredAt: this.generateExpiryTime(1)
        });
        await this.emailService.sendForgetPasswordEmail(existingUser.email, otp);
        return existingUser;
    };

    recoverPassword = async (userData) => {
        const user = await this.repository.findByEmail(userData.email);
        if (!user) throw new NotFoundError("User not found!");
        if (!user.forgetPasswordOtp) {throw new ValidationError("No OTP found for this email!");}
        if (!user.forgetPasswordOtpExpiredAt > new Date()) {throw new ValidationError("OTP has expired!");}
        if (user.forgetPasswordOtp !== userData.forgetPasswordOtp) {throw new ValidationError("Invalid OTP!");}
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        await this.repository.update(user.id, {
            password: hashedPassword
        });
        return user;
    };

    initializeEmailChange = async (userId, newEmail) => {
        const existingUser = await this.repository.findByEmail(newEmail);
        if (existingUser) throw new ConflictError('Email already in use');
        const otp = this.generateOTP();
        await this.repository.update(userId, {
            pendingEmail: newEmail,
            emailChangeOtp: otp,
            emailChangeOtpExpiredAt: this.generateExpiryTime(1)
        });
        await this.emailService.sendChangePasswordEmail(newEmail, otp);
    };

    verifyEmailChange = async (userId, otp) => {
        const user = await this.repository.findById(userId);
        if (!user.pendingEmail || !user.emailChangeOtp) throw new ConflictError('No pending email change!');
        if (!user.emailChangeOtpExpiredAt > new Date()) throw new ValidationError("OTP has expired!");
        if (user.emailChangeOtp !== otp) throw new ValidationError("Invalid OTP!");
        const transaction = await this.repository.model.sequelize.transaction();
        try {
            await this.repository.update(userId, {
                email: user.pendingEmail,
                pendingEmail: null,
                emailChangeOtp: null,
                emailChangeOtpExpiredAt: null
            }, {transaction});
            await this.emailService.sendEmailChangedNotification(user.email, user.pendingEmail);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
        }
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
            const user = await this.repository.findById(decoded.userId);
            if (!user) throw new NotFoundError("User not found!");
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
