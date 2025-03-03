import {DataTypes, Model} from "sequelize";
import sequelize from "../config/database.js";

class Product extends Model {
}

Product.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING(140),
            unique: true
        },
        description: DataTypes.TEXT,
        price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {min: 0.01}
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {min: 0}
        },
        sku: {
            type: DataTypes.STRING(50),
            unique: true
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        sequelize,
        paranoid: true,
        tableName: 'products',
        defaultScope: {
            where: {active: true},
        },
        hooks: {
            beforeDestroy: async (product, options) => {
                await product.update({active: false}, {transaction: options.transaction});
            }
        }
    }
);

Product.associate = models => {
    Product.belongsTo(models.Brand, {
        foreignKey: 'brand_id',
    });
    Product.belongsToMany(models.Category, {
        through: "ProductCategories",
        foreignKey: "product_id",
    });
    Product.hasMany(models.Image, {
        foreignKey: "product_id",
    });
    Product.belongsToMany(models.Tag, {
        through: "ProductTags",
        foreignKey: "product_id",
    });
    Product.belongsToMany(models.Color, {
        through: "ProductColors",
        foreignKey: "product_id"
    });
    Product.belongsToMany(models.Size, {
        through: "ProductSizes",
        foreignKey: "product_id"
    });
};

export default Product;