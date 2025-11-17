import AppointmentInvites from "./AppointmentInvites";
import Appointment from "./Appointments";
import User from "./User";

User.hasMany(Appointment, { foreignKey: "creator_id" });
Appointment.belongsTo(User, { foreignKey: "creator_id", as: "creator" });

Appointment.belongsToMany(User, {
  through: AppointmentInvites,
  foreignKey: "appointment_id",
  otherKey: "user_id",
  as: "participants",
});

User.belongsToMany(Appointment, {
  through: AppointmentInvites,
  foreignKey: "user_id",
  otherKey: "appointment_id",
  as: "invitedAppointments",
});

AppointmentInvites.belongsTo(User, { foreignKey: "user_id", as: "user" });

export { User, Appointment, AppointmentInvites };
