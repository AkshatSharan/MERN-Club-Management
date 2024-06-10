import express from "express";
import { createUpcomingEvent, getUpcomingEventDetails } from "../controller/upcomingEventController.js";

const upcomingEventRoute = express.Router();

upcomingEventRoute.post('/createupcomingevent', createUpcomingEvent);
upcomingEventRoute.get('/event/:eventId', getUpcomingEventDetails);

export default upcomingEventRoute;