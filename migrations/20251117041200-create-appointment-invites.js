"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AppointmentInvites", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        primaryKey: true,
      },
      appointment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Appointments",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM("pending", "accepted", "declined"),
        defaultValue: "pending",
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
    await queryInterface.dropTable("AppointmentInvites");
  },
};
