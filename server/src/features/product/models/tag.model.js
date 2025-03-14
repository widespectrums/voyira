import {DataTypes, Model} from "sequelize";
import sequelize from "../../../config/database.js";

class Tag extends Model {}

Tag.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(40),
            unique: true
        },
    }, {
        sequelize,
        tableName: 'tags',
    }
);

Tag.associate = models => {
    Tag.belongsToMany(models.Product, {
        through: "ProductTags",
        foreignKey: "tag_id"
    });
};

export default Tag;