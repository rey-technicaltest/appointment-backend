import { Request, Response } from "express";
import Joi from "joi";
import { EXCEPTION_MESSAGE, responseHandler } from "../utils/exceptionMessage";
import {
  addAppointmentService,
  getAppointmenDetailService,
  getAppointmentService,
  updateInviteStatusService,
} from "../services/AppointmentService";

export const getAppointmentController = async (req: Request, res: Response) => {
  const data = await getAppointmentService(req.body);

  return responseHandler(res, EXCEPTION_MESSAGE.SUCCESS, {
    message: "Success",
    data,
  });
};

export const appointmentDetailController = async (
  req: Request,
  res: Response
) => {
  const schema = Joi.object({
    appointment_id: Joi.string().uuid().required(),
  });

  const { error } = schema.validate(req.params, { allowUnknown: true });

  if (error) {
    return responseHandler(
      res,
      EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY,
      error.details[0].message,
      true
    );
  }
  const data = await getAppointmenDetailService({ ...req.body, ...req.params });

  return responseHandler(res, EXCEPTION_MESSAGE.SUCCESS, {
    message: "Success",
    data,
  });
};

export const addAppointmentController = async (req: Request, res: Response) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    start: Joi.string().isoDate().required(),
    end: Joi.string().isoDate().required(),
    invitees: Joi.array().items(Joi.string().uuid()).default([]),
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

  const data = await addAppointmentService(req.body);

  return responseHandler(res, EXCEPTION_MESSAGE.SUCCESS, {
    message: "Success",
    data,
  });
};

export const updateAppointmentController = async (
  req: Request,
  res: Response
) => {
  const schema = Joi.object({
    appointment_id: Joi.string().required(),
    status: Joi.string().required(),
  });

  const payload = { ...req.body, ...req.params };

  const { error } = schema.validate(payload, { allowUnknown: true });

  if (error) {
    return responseHandler(
      res,
      EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY,
      error.details[0].message,
      true
    );
  }

  const data = await updateInviteStatusService(payload);

  return responseHandler(res, EXCEPTION_MESSAGE.SUCCESS, {
    message: "Success",
    data,
  });
};
