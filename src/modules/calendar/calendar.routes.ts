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
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  calendarController.getAllCalendarController
);

// create data
calendarRouter.post(
  "/",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  calendarController.createCalendarController
);

// get upcoming events and holidays
calendarRouter.get(
  "/upcoming/:current_date",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  calendarController.getUpcomingEventsAndHolidaysController
);

// get single data
calendarRouter.get(
  "/:year",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  calendarController.getCalendarController
);

// update data
calendarRouter.patch(
  "/:year",
  checkToken,
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  calendarController.updateCalendarController
);

// delete data
calendarRouter.delete(
  "/:year",
  checkToken,
  auth(ENUM_ROLE.ADMIN),
  calendarController.deleteCalendarController
);

export default calendarRouter;
