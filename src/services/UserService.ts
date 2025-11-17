import { Transaction } from "sequelize";
import { sequelize } from "../config/database";
import User from "../models/User";
import { generatePassword, hashPassword } from "../utils/tools";
import { CustomException } from "../utils/customException";
import { EXCEPTION_MESSAGE } from "../utils/exceptionMessage";

export const getUsersService = () => {
  return User.findAll();
};

export const getProfileService = (payload: any) => {
  return User.findOne({ where: { id: payload.user_id } });
};

export const addUserService = (payload: User) => {
  return sequelize.transaction(async (transaction: Transaction) => {
    const passwordObj = generatePassword(payload.username, payload.password);

    const body = {
      name: payload.name,
      username: payload.username,
      preferred_timezone: payload.preferred_timezone,
      password: passwordObj.password,
      salt: passwordObj.salt,
    };

    const user = await User.create(body, { transaction });

    if (!user)
      throw new CustomException(
        EXCEPTION_MESSAGE.INVALID_USERNAME_OR_PASSWORD,
        { message: "User created failed" }
      );

    return user;
  });
};

export const updateUserService = (payload: {
  user_id: string;
  name: string;
  preferred_timezone: string;
}) => {
  return sequelize.transaction(async (transaction: Transaction) => {
    const exist = await User.findOne({ where: { id: payload.user_id } });

    if (!exist)
      throw new CustomException(EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY, {
        message: "user not founded",
      });

    const body = {
      name: payload.name,
      prefered_timezone: payload.preferred_timezone,
    };

    const user = await User.update(body, {
      where: { id: payload.user_id },
      transaction,
    });

    if (!user)
      throw new CustomException(
        EXCEPTION_MESSAGE.INVALID_USERNAME_OR_PASSWORD,
        { message: "User update failed" }
      );

    return user;
  });
};
