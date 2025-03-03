import {DataTypes, Model} from "sequelize";
import sequelize from "../config/database.js";

class Brand extends Model {}

Brand.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(60),
            allowNull: true,
            unique: true
        },
    }, {
        sequelize,
        paranoid: true,
        tableName: "brands",
    }
);

Brand.associate = models => {
    Brand.hasMany(models.Product, {
        foreignKey: "brand_id"
    });
}

export default Brand;