import {DataTypes, Model} from "sequelize";
import sequelize from "../config/database.js";

class Size extends Model {}

Size.init(
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
        tableName: "sizes",
    }
);

Size.associate = models => {
    Size.belongsToMany(models.Product, {
        through: "ProductSizes",
        foreignKey: "size_id"
    });
};

export default Size;