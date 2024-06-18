import express from "express";
import { createUpcomingEvent, getUpcomingEventDetails, toggleRegistrationStatus } from "../controller/upcomingEventController.js";
import { verifyClub, verifyUser } from "../middlewares/auth.middleware.js";
import { createEventPrize } from "../controller/eventPrizeController.js";
import { createRound } from "../controller/eventRoundController.js";
import { createRegistrationForm, getForm, updateForm } from "../controller/registrationFormController.js";
import { createRegistration } from "../controller/registrationController.js";

const upcomingEventRoute = express.Router();

upcomingEventRoute.post('/createupcomingevent', verifyClub, createUpcomingEvent, createEventPrize, createRound);
upcomingEventRoute.get('/event/:eventId', getUpcomingEventDetails);
upcomingEventRoute.post('/change-reg/:eventId', verifyClub, toggleRegistrationStatus);
upcomingEventRoute.post('/create-form/:eventId', verifyClub, createRegistrationForm);
upcomingEventRoute.get('/getform/:eventId', getForm);
upcomingEventRoute.put('/update-form/:eventId', verifyClub, updateForm);
upcomingEventRoute.post('/register/:eventId/:formId', verifyUser, createRegistration);

export default upcomingEventRoute;