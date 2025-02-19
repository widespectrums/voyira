import dotenv from 'dotenv';

dotenv.config();

export default {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    database: {
        dialect: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        accessExpiration: process.env.JWT_ACCESS_EXPIRE,
        refreshExpiration: process.env.JWT_REFRESH_EXPIRE,
    },
    email: {
        host: process.env.EMAIL_HOST,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        port: process.env.EMAIL_PORT,
    }
};
