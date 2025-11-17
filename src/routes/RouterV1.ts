import {
  addAppointmentController,
  appointmentDetailController,
  getAppointmentController,
  updateAppointmentController,
} from "../controllers/appointment.controller";
import { login } from "../controllers/auth.controller";
import {
  addUserController,
  getProfileController,
  getUsersController,
  updateUserController,
} from "../controllers/users.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

const express = require("express");
const router = express.Router();

// auth
router.post("/auth", asyncHandler(login));
router.get("/profile", authMiddleware, asyncHandler(getProfileController));

//users
router.get("/users", authMiddleware, asyncHandler(getUsersController));
router.post("/users", asyncHandler(addUserController));
router.put("/users", authMiddleware, asyncHandler(updateUserController));

//Appointment
router.get(
  "/appointments",
  authMiddleware,
  asyncHandler(getAppointmentController)
);
router.get(
  "/appointments/:appointment_id",
  authMiddleware,
  asyncHandler(appointmentDetailController)
);
router.post(
  "/appointments",
  authMiddleware,
  asyncHandler(addAppointmentController)
);
router.patch(
  "/appointments/:appointment_id",
  authMiddleware,
  asyncHandler(updateAppointmentController)
);

router.get("*", function (req: Request, res: Response) {
  res.status(404).json();
});

module.exports = router;
