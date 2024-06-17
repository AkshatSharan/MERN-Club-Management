import express from "express";
import { createUpcomingEvent, getUpcomingEventDetails } from "../controller/upcomingEventController.js";
import { verifyClub } from "../middlewares/auth.middleware.js";

const upcomingEventRoute = express.Router();

upcomingEventRoute.post('/createupcomingevent', verifyClub, createUpcomingEvent);
upcomingEventRoute.get('/event/:eventId', getUpcomingEventDetails);

export default upcomingEventRoute;