'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      // A spot is owned by a user
      Spot.belongsTo(models.User, { foreignKey: 'ownerId' });
      
      // A spot can have multiple bookings
      Spot.hasMany(models.Booking, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
      
      // A spot can have multiple reviews
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
      
      // A spot can have multiple images
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
    }
  }

  Spot.init({
    // Owner of the spot
    ownerId: {
      type: DataTypes.INTEGER
    },
    
    // Address details
    address: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    
    // Geolocation coordinates
    lat: { type: DataTypes.DECIMAL },
    lng: { type: DataTypes.DECIMAL },
    
    // Name of the spot with length validation
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [4, 50]
      }
    },
    
    // Description of the spot with length validation and requirement
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Description is required"
        },
        len: {
          args: [30, Infinity],
          msg: "Please write 30 characters or more."
        }
      }
    },
    
    // Price per night for the spot
    price: {
      type: DataTypes.DECIMAL
    }
  }, {
    sequelize,
    modelName: 'Spot',
    scopes: {
      getCurrentUserReviews(id) {
        return {
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'description']
          }
        }
      }
    }
  });

  return Spot;
};
