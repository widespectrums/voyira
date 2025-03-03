import {DataTypes, Model} from "sequelize";
import sequelize from "../config/database.js";

class Image extends Model {}

Image.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_primary: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        order: DataTypes.INTEGER
    }, {
        sequelize,
        tableName: "images",
    }
);


Image.associate = models => {
    Image.belongsTo(models.Product, {
        foreignKey: "product_id",
    });
};

export default Image;