import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class User extends Model {
  public id!: number;
  public name!: string;
  public username!: string;
  public password!: string;
  public salt!: string;
  public preferred_timezone!: string;
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    salt: { type: DataTypes.STRING, allowNull: false },
    preferred_timezone: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "User" }
);

export default User;
