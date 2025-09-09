import { ENUM_ROLE } from "@/enums/roles";
import auth from "@/middlewares/auth";
import express from "express";
import { calendarController } from "./calendar.controller";

const calendarRouter = express.Router();

// get all data
calendarRouter.get(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  calendarController.getAllCalendarController
);

// create data
calendarRouter.post(
  "/",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  calendarController.createCalendarController
);

// get upcoming events and holidays
calendarRouter.get(
  "/upcoming/:current_date",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  calendarController.getUpcomingEventsAndHolidaysController
);

// get single data
calendarRouter.get(
  "/:year",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR, ENUM_ROLE.USER),
  calendarController.getCalendarController
);

// update data
calendarRouter.patch(
  "/:year",
  auth(ENUM_ROLE.ADMIN, ENUM_ROLE.MODERATOR),
  calendarController.updateCalendarController
);

// delete data
calendarRouter.delete(
  "/:year",
  auth(ENUM_ROLE.ADMIN),
  calendarController.deleteCalendarController
);

export default calendarRouter;
