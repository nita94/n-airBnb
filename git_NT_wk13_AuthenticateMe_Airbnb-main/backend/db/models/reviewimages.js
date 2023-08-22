'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
  
    static associate(models) {
      
      ReviewImage.belongsTo(
        models.Review,
        { foreignKey: 'reviewId' }
      )
    }
  }
  ReviewImage.init({
    reviewId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'ReviewImage',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'reviewId']
      }
    },
    scopes: {
      deleteReviewImg(id) {
        return {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }
      }
    }
  });
  return ReviewImage;
};