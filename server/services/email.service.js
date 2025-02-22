import nodemailer from "nodemailer";
import env from "../config/env.js";

export default class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: env.email.host,
            port: env.email.port,
            auth: {
                user: env.email.user,
                pass: env.email.pass,
            },
        });
    };

    async sendVerificationEmail(email, otp) {
        const mailOptions = {
            from: `"Verification Code" <${env.email.user}>`,
            to: email,
            subject: "Email Verification OTP",
            text: `Your verification code is: ${otp}`,
            html: `<b>${otp}</b>`,
        }
        console.log("Verification email: ", email)
        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            throw new Error("Failed to send verification email.");
        }
    };

    async sendForgetPasswordEmail(email, otp) {
        const mailOptions = {
            from: `"Reset Password Code" <${env.email.user}>`,
            to: email,
            subject: "Reset Password Code",
            text: `Your verification code for resetting password: ${otp}`,
            html: `<b>${otp}</b>`,
        }
        console.log("Verification email: ", email)
        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            throw new Error("Failed to send reset password email.");
        }
    };
}
