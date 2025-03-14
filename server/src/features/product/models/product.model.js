import {DataTypes, Model} from "sequelize";
import sequelize from "../../../config/database.js";
import slugify from "slugify";

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
            },
            beforeValidate(product) {
                if (product.name && !product.slug) {
                    product.slug = slugify(product.name, {
                        lowercase: true,
                        strict: true,
                        locale: 'tr'
                    });
                }
            },
            beforeUpdate: (product) => {
                if(product.changed('name')) {
                    product.slug = slugify(product.name, {
                        lowercase: true,
                        strict: true,
                        locale: 'tr'
                    });
                }
            }
        }
    }
);

Product.associate = models => {
    Product.belongsTo(models.Brand, {
        foreignKey: 'brand_id',
        as: "brand"
    });
    Product.belongsToMany(models.Category, {
        through: "ProductCategories",
        foreignKey: "product_id",
        otherKey: "category_id",
        as: "categories"
    });
    Product.hasMany(models.Image, {
        foreignKey: "product_id",
        as: "images"
    });
    Product.belongsToMany(models.Tag, {
        through: "ProductTags",
        foreignKey: "product_id",
        otherKey: "tag_id",
        as: 'tags'
    });
    Product.belongsToMany(models.Color, {
        through: "ProductColors",
        foreignKey: "product_id",
        otherKey: "color_id",
        as: 'colors'
    });
    Product.belongsToMany(models.Size, {
        through: "ProductSizes",
        foreignKey: "product_id",
        otherKey: "size_id",
        as: 'sizes'
    });
};

export default Product;