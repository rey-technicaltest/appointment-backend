import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const fileTransport = new DailyRotateFile({
  filename: `./logs/${process.env.SERVICE_NAME}-%DATE%.log`,
  datePattern: "DD-MM-YYYY",
  zippedArchive: true,
  maxSize: "15m",
  maxFiles: "14d",
});

const logger = winston.createLogger({
  level: "info",
  exitOnError: false,
  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss.SSSZ" }),
    winston.format.json()
  ),
  transports: [new winston.transports.Console(), fileTransport],
});

export default logger;
