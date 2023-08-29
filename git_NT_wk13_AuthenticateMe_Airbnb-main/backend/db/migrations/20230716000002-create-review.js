'use strict';

// Import required types for Sequelize migrations
/** @type {import('sequelize-cli').Migration} */

// Define options object for table creation
let options = {};

// Check if the environment is set to production
if (process.env.NODE_ENV === 'production') {
  // Define the schema from the environment variable if in production mode
  options.schema = process.env.SCHEMA;
}

module.exports = {
  // Up method to run when the migration is applied
  async up(queryInterface, Sequelize) {
    // Create 'Reviews' table with the specified columns and configurations
    return queryInterface.createTable('Reviews', {
      // Primary key for uniquely identifying each review
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // Foreign key referencing the spot associated with the review
      spotId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Spots',
          key: 'id'
        },
        onDelete: 'CASCADE',  // Delete the review if the associated spot is deleted
      },
      // Foreign key referencing the user who wrote the review
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',  // Delete the review if the associated user is deleted
      },
      // Text content of the review
      review: {
        type: Sequelize.STRING
      },
      // Star rating given by the user, with validation to ensure value is between 1 and 5
      stars: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
          max: 5
        }
      },
      // Timestamp indicating when the review was created
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        type: Sequelize.DATE
      },
      // Timestamp indicating the last time the review was updated
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        type: Sequelize.DATE
      }
    }, options);  // Pass in the options object which may have a schema defined for production
  },
  
  // Down method to run when the migration is rolled back
  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    // Drop the 'Reviews' table
    return queryInterface.dropTable(options);
  }
};
