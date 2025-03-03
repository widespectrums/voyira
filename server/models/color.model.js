import {DataTypes, Model} from "sequelize";
import sequelize from "../config/database.js";

class Color extends Model {}

Color.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true
        },
    }, {
        sequelize,
        paranoid: true,
        tableName: "colors",
    }
);

Color.associate = models => {
    Color.belongsToMany(models.Product, {
        through: "ProductColors",
        foreignKey: "color_id"
    });
};

export default Color;