import { Model, DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../config/database";
import User from "./User";
import AppointmentInvites from "./AppointmentInvites";

class Appointment extends Model {
  public id!: number;
  public title!: string;
  public creator_id!: string;
  public start!: string;
  public end!: string;

  public creator?: User;
  public participants?: AppointmentInvites[];
}
Appointment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: DataTypes.STRING,
    creator_id: { type: DataTypes.STRING, unique: true, allowNull: false },
    start: { type: DataTypes.DATE, allowNull: false },
    end: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, timestamps: true, modelName: "Appointment" }
);

export default Appointment;
