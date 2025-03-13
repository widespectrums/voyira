import {DataTypes, Model} from "sequelize";
import sequelize from "../config/database.js";

class CartItem extends Model {}

CartItem.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        cart_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        color_id: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: "Color Id of the selected product."
        },
        size_id: {
            type: DataTypes.UUID,
            allowNull: true,
            comment: "Size Id of the selected product."
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1
            }
        },
        unit_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        total_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "CartItem",
        tableName: "cart_items",
        timestamps: true,
    }
);

CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, {
        foreignKey: "cart_id",
        as: "cart"
    });

    CartItem.belongsTo(models.Product, {
        foreignKey: "product_id",
        as: "product"
    });
    CartItem.belongsTo(models.Color, {
        foreignKey: "color_id",
        as: "color"
    });

    CartItem.belongsTo(models.Size, {
        foreignKey: "size_id",
        as: "size"
    });
};

export default CartItem;