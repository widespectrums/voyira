import {DataTypes} from "sequelize";
import sequelize from "../../config/database.js";

const ProductSizes = sequelize.define("ProductSizes", {
    product_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    size_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
            model: 'sizes',
            key: 'id'
        }
    }
}, {
    sequelize,
    tableName: "product_sizes",
    timestamps: false
});

export default ProductSizes;