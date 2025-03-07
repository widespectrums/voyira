import sequelize from "../../config/database.js";
import {DataTypes} from "sequelize";

const ProductTags = sequelize.define("ProductTags", {
    product_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    tag_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
            model: 'tags',
            key: 'id'
        }
    }
}, {
    sequelize,
    tableName: "product_tags",
    timestamps: false
});

export default ProductTags;