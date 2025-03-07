import sequelize from "../../config/database.js";
import {DataTypes} from "sequelize";

const ProductCategories = sequelize.define("ProductCategories", {
    product_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    category_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
            model: 'categories',
            key: 'id'
        }
    }
}, {
    sequelize,
    tableName: "product_categories",
    timestamps: false
});

export default ProductCategories;