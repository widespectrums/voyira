import {DataTypes, Model} from "sequelize";
import sequelize from "../../../config/database.js";

class ShippingMethod extends Model {}

ShippingMethod.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        base_fee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        free_shipping_threshold: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            comment: "Minimum order amount for free shipping"
        },
        provider_code: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: "Code for external shipping provider integration"
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: "shippingMethod",
        tableName: "shipping_methods",
        timestamps: true,
    }
);

ShippingMethod.associate = (models) => {
    ShippingMethod.hasMany(models.Cart, {
        foreignKey: "shipping_method_id",
        as: "carts"
    });
};

export default ShippingMethod;