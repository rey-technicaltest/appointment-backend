import _ from "lodash";
import {
  addUserService,
  getProfileService,
  getUsersService,
  updateUserService,
} from "../services/UserService";
import { EXCEPTION_MESSAGE, responseHandler } from "../utils/exceptionMessage";
import { Request, Response } from "express";
import Joi from "joi";

export const getUsersController = async (req: Request, res: Response) => {
  const result = await getUsersService();

  return responseHandler(res, EXCEPTION_MESSAGE.SUCCESS, {
    message: "Success",
    result,
  });
};

export const getProfileController = async (req: Request, res: Response) => {
  const result = await getProfileService(req.body);

  return responseHandler(res, EXCEPTION_MESSAGE.SUCCESS, {
    message: "Success",
    result,
  });
};

export const addUserController = async (req: Request, res: Response) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    preferred_timezone: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body, { allowUnknown: true });

  if (error) {
    return responseHandler(
      res,
      EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY,
      error.details[0].message,
      true
    );
  }

  const result = await addUserService(req.body);

  return responseHandler(res, EXCEPTION_MESSAGE.SUCCESS, {
    message: "Success",
    result,
  });
};

export const updateUserController = async (req: Request, res: Response) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    preferred_timezone: Joi.string().required(),
  });

  const { error } = schema.validate(req.body, { allowUnknown: true });

  if (error) {
    return responseHandler(
      res,
      EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY,
      error.details[0].message,
      true
    );
  }

  const result = await updateUserService(req.body);

  return responseHandler(res, EXCEPTION_MESSAGE.SUCCESS, {
    message: "Success",
    result,
  });
};
