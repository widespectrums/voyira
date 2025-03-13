import {DataTypes, Model} from "sequelize";
import sequelize from "../config/database.js";

class Cart extends Model {}

Cart.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("active", "completed", "abandoned"),
            defaultValue: "active",
            allowNull: false,
        },
        total_price: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00,
            allowNull: false,
        },
        total_items: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        shipping_method_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        shipping_fee: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00,
            allowNull: false,
        },
        last_activity: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: "Cart",
        tableName: "carts",
        timestamps: true,
    }
);

Cart.associate = (models) => {
    Cart.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
    });
    Cart.belongsTo(models.ShippingMethod, {
        foreignKey: "shipping_method_id",
        as: "shippingMethod"
    });
    Cart.hasMany(models.CartItem, {
        foreignKey: "cart_id",
        as: "items"
    });
};

export default Cart;
