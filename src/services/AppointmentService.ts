const moment = require("moment-timezone");
import { CustomException } from "../utils/customException";
import { EXCEPTION_MESSAGE } from "../utils/exceptionMessage";
import { Op, Transaction, UUIDV4 } from "sequelize";
import { sequelize } from "../config/database";
import { withinWorkingHours } from "../utils/time";
import Appointment from "../models/Appointments";
import AppointmentInvites from "../models/AppointmentInvites";
import User from "../models/User";

export const getAppointmentService = async (payload: any) => {
  const userId = payload.user_id;
  const userTimezone = payload.preferred_timezone;

  const appointments = await Appointment.findAll({
    include: [
      { model: User, as: "creator" },
      {
        model: User,
        as: "participants",
        through: { attributes: ["status"] },
      },
    ],
    where: {
      [Op.or]: [{ creator_id: userId }, { "$participants.id$": userId }],
    },
    order: [["start", "ASC"]],
  });

  const participants = await AppointmentInvites.findAll({
    where: {
      appointment_id: { [Op.in]: appointments.map((a) => a.id) },
    },
    include: [{ model: User, as: "user" }],
  });

  const formatted = appointments.map((item: any) => {
    const itemParticipants = participants.filter(
      (p) => p.appointment_id === item.id
    );

    return {
      id: item.id,
      title: item.title,

      creator: item.creator?.name,

      start_local: item.start
        ? moment.utc(item.start).tz(userTimezone).format()
        : null,
      end_local: item.start
        ? moment.utc(item.end).tz(userTimezone).format()
        : null,

      start_utc: item.start,
      end_utc: item.end,

      participants: itemParticipants,
    };
  });

  return formatted;
};

export const getAppointmenDetailService = async (payload: any) => {
  const userId = payload.user_id;
  const userTimezone = payload.preferred_timezone;
  const appointment = await Appointment.findOne({
    include: [
      { model: User, as: "creator" },
      {
        model: User,
        as: "participants",
        through: { attributes: ["status"] },
      },
    ],
    where: {
      id: payload.appointment_id,
      [Op.or]: [{ creator_id: userId }, { "$participants.id$": userId }],
    },
    order: [["start", "ASC"]],
  });

  if (!appointment)
    throw new CustomException(EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY, {
      message: "appointment not founded",
    });

  return {
    id: appointment.id,
    title: appointment.title,

    creator: appointment.creator?.name,

    start_utc: moment.utc(appointment.start).tz(userTimezone).format(),
    end_utc: moment.utc(appointment.end).tz(userTimezone).format(),

    participants: (appointment.participants || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      status: p.AppointmentInvites.status,
    })),
  };
};

export const addAppointmentService = async (payload: any) => {
  return await sequelize.transaction(async (transaction: Transaction) => {
    const { title, start, end, invitees = [] } = payload;
    const creatorId = payload.user_id;

    const user = await User.findOne({ where: { id: payload.user_id } });

    if (!user)
      throw new CustomException(EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY, {
        message: "user not founded",
      });

    const appointment = await Appointment.create(
      {
        title,
        start,
        end,
        creator_id: creatorId,
      },
      { transaction }
    );

    if (invitees.length > 0) {
      const user = await User.findAll({
        where: {
          id: { [Op.in]: invitees },
        },
      });

      for (const u of user) {
        if (!withinWorkingHours(start, end, u.preferred_timezone)) {
          throw new CustomException(EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY, {
            message: `Time is outside working hours for user ${u.name} (${u.preferred_timezone})`,
          });
        }
      }

      const inviteRows = invitees.map((userId: any) => ({
        appointment_id: appointment.id,
        user_id: userId,
      }));

      await AppointmentInvites.bulkCreate(inviteRows, { transaction });
    }

    return appointment;
  });
};

export const updateInviteStatusService = async (payload: any) => {
  return await sequelize.transaction(async (transaction: Transaction) => {
    const exist = await AppointmentInvites.findOne({
      where: {
        appointment_id: payload.appointment_id,
        user_id: payload.user_id,
      },
    });

    if (!exist)
      throw new CustomException(EXCEPTION_MESSAGE.UNPROCESSABLE_ENTITY, {
        message: "appointment not founded",
      });

    return await AppointmentInvites.update(
      { status: payload.status },
      {
        where: {
          appointment_id: payload.appointment_id,
          user_id: payload.user_id,
        },
        transaction,
      }
    );
  });
};
