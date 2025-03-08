import express from 'express';
import env from "./config/env.js";
import sequelize from "./config/database.js";
import authRoutes from "./routes/auth/auth.routes.js";
import adminRoutes from "./routes/admin/admin.routes.js";
import apiLimiter from "./middlewares/ratelimit.middleware.js";
import cookieParser from "cookie-parser";
import addressRoutes from "./routes/address/address.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product/product.routes.js";
import categoryRoutes from "./routes/category/category.routes.js";
import brandRoutes from "./routes/brand/brand.routes.js";
import tagRoutes from "./routes/tag/tag.routes.js";
import colorRoutes from "./routes/color/color.routes.js";
import sizeRoutes from "./routes/size/size.routes.js";

const app = express()

app.use(express.json());
app.use(apiLimiter)
app.use(cookieParser())

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes)
app.use('/addresses', addressRoutes)
app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/categories', categoryRoutes)
app.use('/brands', brandRoutes)
app.use('/tags', tagRoutes)
app.use('/colors', colorRoutes)
app.use('/sizes', sizeRoutes)

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
