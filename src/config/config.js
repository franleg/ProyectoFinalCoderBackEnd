import dotenv from 'dotenv';

dotenv.config();

export default {
    app: {
        DOMAIN: process.env.DOMAIN
    },
    mongo: {
        USER: process.env.MONGO_USER,
        PWD: process.env.MONGO_PASSWORD,
        DB: process.env.MONGO_DATABASE || ''
    },
    session: {
        SECRET: process.env.SESSION_SECRET,
    },
    admin: {
        EMAIL: process.env.ADMIN_EMAIL,
        PWD: process.env.ADMIN_PASSWORD,
    }
}
