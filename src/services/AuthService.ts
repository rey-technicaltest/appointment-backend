import { CustomException } from "../utils/customException";
import { EXCEPTION_MESSAGE } from "./../utils/exceptionMessage";
import { generateToken } from "../utils/jwt";
import { hashPassword } from "../utils/tools";
import { sequelize } from "../config/database";
import { Transaction } from "sequelize";
import User from "../models/User";

export const auth = async (username: string, password: string) => {
  return await sequelize.transaction(async (transaction: Transaction) => {
    const user = await User.findOne({
      where: { username },
      transaction,
    });

    if (!user) {
      throw new CustomException(EXCEPTION_MESSAGE.BAD_REQUEST, {
        message: "username not found",
      });
    }

    const hashedPassword = hashPassword(password, user.salt);

    if (hashedPassword !== user.password) {
      throw new CustomException(
        EXCEPTION_MESSAGE.INVALID_USERNAME_OR_PASSWORD,
        { message: `Invalid password ${username}` }
      );
    }

    const payloadToken = {
      user_id: user.id,
      username: user.username,
    };

    const token = await generateToken(payloadToken);

    return { token, user };
  });
};
