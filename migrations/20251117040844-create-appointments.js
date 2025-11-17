"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Appointments", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      creator_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      start: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      end: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Appointments");
  },
};
