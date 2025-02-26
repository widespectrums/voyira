import {DataTypes, Model} from "sequelize";
import sequelize from "../config/database.js";

class Address extends Model {}

Address.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            }
        },
        addressTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        district: {
            type: DataTypes.STRING,
        },
        neighborhood: {
            type: DataTypes.STRING,
        },
        street: {
            type: DataTypes.STRING,
        },
        addressLine: {
            type: DataTypes.STRING,
        }
    }, {
        sequelize,
        modelName: 'Address',
        tableName: 'addresses',
        timestamps: true,
        paranoid: true,
    }
);

Address.associate = models => {
    Address.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        constraints: true
    });
};

export default Address;
