import express from "express";
import { createUpcomingEvent, getUpcomingEventDetails } from "../controller/upcomingEventController.js";
import { verifyClub } from "../middlewares/auth.middleware.js";
import { createEventPrize } from "../controller/eventPrizeController.js";
import { createRound } from "../controller/eventRoundController.js";

const upcomingEventRoute = express.Router();

upcomingEventRoute.post('/createupcomingevent', verifyClub, createUpcomingEvent, createEventPrize, createRound);
upcomingEventRoute.get('/event/:eventId', getUpcomingEventDetails);

export default upcomingEventRoute;