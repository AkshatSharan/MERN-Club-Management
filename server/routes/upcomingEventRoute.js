import express from "express";
import { createUpcomingEvent } from "../controller/upcomingEventController.js";

const upcomingEventRoute = express.Router();

upcomingEventRoute.post('/createupcomingevent', createUpcomingEvent);

export default upcomingEventRoute;