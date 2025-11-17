const moment = require("moment-timezone");

export const withinWorkingHours = (
  utcStart: any,
  utcEnd: any,
  userTimezone: any
) => {
  const localStart = moment.utc(utcStart).tz(userTimezone);
  const localEnd = moment.utc(utcEnd).tz(userTimezone);

  const startHour = localStart.hour();
  const endHour = localEnd.hour();

  if (startHour < 7) return false;
  if (endHour > 20) return false;

  return true;
};
