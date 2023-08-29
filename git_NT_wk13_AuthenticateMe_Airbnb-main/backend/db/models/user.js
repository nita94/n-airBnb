'use strict';
const { Model, Validator } = require('sequelize');

// Validation function for checking if a value is an email
function isNotEmail(value) {
    if (Validator.isEmail(value)) {
        throw new Error("Username cannot be an email address.");
    }
}

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // User can own multiple spots
            User.hasMany(models.Spot, { foreignKey: 'ownerId', onDelete: 'CASCADE', hooks: true });

            // User can have multiple bookings
            User.hasMany(models.Booking, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });

            // User can write multiple reviews
            User.hasMany(models.Review, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
        }
    }

    User.init({
        firstName: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                isAlpha: true
            }
        },
        lastName: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                isAlpha: true
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [4, 30],
                isNotEmail
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 256],
                isEmail: true
            }
        },
        hashedPassword: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [60, 60]
            }
        }
    }, {
        sequelize,
        modelName: 'User',
        defaultScope: {
            attributes: {
                exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
            }
        },
        scopes: {
            getSpotOwner(id) {
                return {
                    attributes: {
                        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt', 'username']
                    }
                };
            }
        }
    });

    return User;
};
