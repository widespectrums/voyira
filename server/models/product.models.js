import {DataTypes, Model} from "sequelize";

class Product extends Model {}

Product.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(120),
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING(140),
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
        },
        price: {
            type: DataTypes.DECIMAL(12,2),
            allowNull: false,
            validate: { min:0.01 }
        },
        discountedPrice: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: { min:0 }
        },
        sku: {
            type: DataTypes.STRING(50),
            unique: true,
            validate: { min:0 }
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        colors: {
            type: DataTypes.JSON, // Örneğin: ["Kırmızı", "Mavi", "Siyah"]
            allowNull: true,
        },
        sizes: {
            type: DataTypes.JSON, // Örneğin: ["S", "M", "L", "XL"]
            allowNull: true,
        },


    }
)