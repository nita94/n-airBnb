'use strict';

/** @type {import('sequelize-cli').Migration} */

// Define options object to store schema and table information
let options = {};

// If the environment is production, set the schema from the environment variable
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  // Up function to create the Users table
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false, // ID cannot be null
        autoIncrement: true, // ID value increments automatically
        primaryKey: true, // ID is the primary key
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        unique: true, // Username must be unique
        type: Sequelize.STRING(30) // Max length of 30 characters
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        unique: true, // Email must be unique
        type: Sequelize.STRING(256) // Max length of 256 characters
      },
      hashedPassword: {
        allowNull: false,
        type: Sequelize.STRING.BINARY // Stored as binary for security
      },
      profileImage: { // New field for user's profile image URL
        allowNull: true,  // Profile image is optional
        type: Sequelize.STRING,  // Store the image URL as a string
        comment: "URL to the user's profile image"  // Comment explaining the field
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Default value is the current timestamp
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        type: Sequelize.DATE
      }
    }, options); // Pass in the options object with schema info (if defined)
  },

  // Down function to drop the Users table
  async down(queryInterface, Sequelize) {
    options.tableName = "Users"; // Define the table name for dropping
    return queryInterface.dropTable(options); // Drop the table using the options object
  }
};
