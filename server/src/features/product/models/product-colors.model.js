import {DataTypes} from "sequelize";
import sequelize from "../../../config/database.js";

const ProductColors = sequelize.define("ProductColors", {
    product_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    color_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
            model: 'colors',
            key: 'id'
        }
    }
}, {
    sequelize,
    tableName: "product_colors",
    timestamps: false
});

export default ProductColors;