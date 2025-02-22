import express from 'express';
import env from "./config/env.js";
import sequelize from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import apiLimiter from "./middlewares/ratelimit.middleware.js";

const app = express()

app.use(express.json());
app.use(apiLimiter)

app.use('/auth', authRoutes);

app.get("/", (req, res) => {
    res.send("API Working successfully...");
})

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
