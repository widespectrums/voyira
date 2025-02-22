import {DataTypes, Model} from 'sequelize';
import sequelize from '../config/database.js'

class User extends Model{}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        gender: {
            type: DataTypes.ENUM('MAN', 'WOMAN', 'OTHER'),
        },
        dateOfBirth: {
            type: DataTypes.DATE,
        },
        avatar: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.ENUM('ROLE_USER', 'ROLE_ADMIN'),
            defaultValue: 'ROLE_USER',
        },
        last_login: {
            type: DataTypes.DATE,
        },
        emailVerifyOtp: {
            type: DataTypes.STRING,
        },
        emailVerifyOtpExpiredAt: {
            type: DataTypes.DATE,
        },
        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        emailVerifiedDate: {
            type: DataTypes.DATE,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        passwordResetOtp: {
            type: DataTypes.STRING,
        },
        passwordResetOtpExpiredAt: {
            type: DataTypes.DATE,
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        defaultScope: {
            where: { active : true },
        },
        hooks: {
            beforeDestroy:async (user, options) => {
                await user.update( {active: false}, {transaction: options.transaction } );
            }
        }
    }
);

User.associate = models => {
    User.hasMany(models.Address, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
    })
}

export default User;
