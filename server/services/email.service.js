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
            from: `"Auth API" <${env.email.user}>`,
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
}
