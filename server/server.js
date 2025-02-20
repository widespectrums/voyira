import express from 'express';
import {authController} from "./controller/index.js";
import sequelize from "./config/database.js";
import env from "./config/env.js";
import {
    userValidation,
    validateBody
} from './validations/index.js';

const app = express()

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API Working successfully...");
})
app.post('/register', validateBody(userValidation.createUserSchema) ,authController.register);
app.post('/login',  authController.login);

sequelize.sync({alter: true})
    .then(() => {
        console.log('Senkronize oldu.');
        app.listen(env.port, () => {
            console.log(`Server started at http://localhost:${env.port}`);
        })
    })
    .catch((err) => {
        console.error("Hata.");
    })
