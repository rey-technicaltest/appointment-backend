import express from "express";
import bodyParser from "body-parser";
import "./models";
import { userRateLimiter } from "./utils/rateLimiter";
import { errorHandler } from "./middleware/errorMiddleware";

const routerV1 = require("./routes/RouterV1");

var cors = require("cors");
var responseTime = require("response-time");

const app = express();

app.use(responseTime());
app.use(cors());
app.use(bodyParser.json());
app.use(userRateLimiter);
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});
app.use("/v1", routerV1);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

export default app;
