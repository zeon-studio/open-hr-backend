import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import { checkToken } from "@/middlewares/checkToken";
import express from "express";
import { calendarController } from "./calendar.controller";

const calendarRouter = express.Router();

// get all data
calendarRouter.get(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  calendarController.getAllCalendarController
);

// create data
calendarRouter.post(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  calendarController.createCalendarController
);

// update data
calendarRouter.patch(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  calendarController.updateCalendarController
);

// delete data
calendarRouter.delete(
  "/:id",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  calendarController.deleteCalendarController
);

export default calendarRouter;
