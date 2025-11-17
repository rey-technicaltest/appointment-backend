import { Model, DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../config/database";

class AppointmentInvites extends Model {
  public id!: number;
  public appointment_id!: string;
  public user_id!: string;
  public status!: string;
}
AppointmentInvites.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    appointment_id: DataTypes.STRING,
    user_id: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "AppointmentInvites" }
);

export default AppointmentInvites;
