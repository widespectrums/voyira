import sequelize from "../../config/database.js";
import {DataTypes} from "sequelize";

const ProductCategories = sequelize.define("ProductCategories", {
    product_id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    category_id: {
        type: DataTypes.UUID,
        primaryKey: true,
    }
}, {
    sequelize,
    tableName: "product_categories",
    timestamps: false
});

export default ProductCategories;