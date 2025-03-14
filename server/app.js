import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import cookieParser from "cookie-parser";
import apiLimiter from "./src/core/milddlewares/ratelimit.middleware.js";

//Route imports
import authRoutes from "./src/features/auth/routes/auth.routes.js";
import adminRoutes from "./src/features/admin/routes/admin.routes.js";
import addressRoutes from "./src/features/user/routes/address.routes.js";
import userRoutes from "./src/features/user/routes/user.routes.js";
import productRoutes from "./src/features/product/routes/product.routes.js";
import categoryRoutes from "./src/features/product/routes/category.routes.js";
import brandRoutes from "./src/features/product/routes/brand.routes.js";
import tagRoutes from "./src/features/product/routes/tag.routes.js";
import colorRoutes from "./src/features/product/routes/color.routes.js";
import sizeRoutes from "./src/features/product/routes/size.routes.js";
import imageRoutes from "./src/features/product/routes/image.routes.js";
import cartRoutes from "./src/features/cart/routes/cart.routes.js";
import shippingRoutes from "./src/features/cart/routes/shipping.routes.js";
//Initialize models associations
import {initializeAssociations} from "./src/core/models/initialize-associations.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(apiLimiter);
app.use(cookieParser());

const rootDir = path.join(__dirname, '../../..');
const uploadsPath = path.join(rootDir, 'uploads');

try {
    if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
        console.log('Uploads klasörü oluşturuldu');
    }
} catch (error) {
    console.error('Uploads klasörü işlemleri sırasında hata:', error.message);
}

initializeAssociations();
app.use('/uploads', express.static(uploadsPath));
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/addresses', addressRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/brands', brandRoutes);
app.use('/tags', tagRoutes);
app.use('/colors', colorRoutes);
app.use('/sizes', sizeRoutes);
app.use('/images', imageRoutes);
app.use('/cart', cartRoutes);
app.use('/shipping', shippingRoutes);

app.get("/", (req, res) => {
    res.send("API Working successfully...");
});

export default app;
