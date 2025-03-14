import app from "./app.js";
import env from "./src/config/env.js";
import sequelize from "./src/config/database.js";

const startServer = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Veritabanı senkronize oldu.');

        app.listen(env.port, () => {
            console.log(`Server başarıyla başlatıldı: http://localhost:${env.port}`);
        });
    } catch (error) {
        console.error("Sunucu başlatma hatası:", error);
        process.exit(1); // Hata durumunda uygulamayı sonlandır
    }
};

startServer();
