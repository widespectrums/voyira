import {DataTypes, Model} from "sequelize";
import sequelize from "../config/database.js";

class Category extends Model {}

Category.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(60),
            allowNull: false,
            unique: true
        },
        parent_id: {
            type: DataTypes.UUID,
            references: {
                model: 'categories',
                key: 'id'
            }
        }
    }, {
        sequelize,
        paranoid: true,
        tableName: "categories"
    }
);

Category.associate = models => {
    Category.hasMany(models.Category, {
        as: "subCategories",
        foreignKey: "parent_id",
    });
    Category.belongsToMany(models.Product, {
        through: "ProductCategories",
        foreignKey: "category_id"
    })
}

export default Category;