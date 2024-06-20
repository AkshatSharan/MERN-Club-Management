import express from "express";
import { createUpcomingEvent, deleteUpcomingEvent, getEventManagementDetails, getUpcomingEventDetails, toggleRegistrationStatus, transferEvent, updateUpcomingEvent } from "../controller/upcomingEventController.js";
import { verifyClub, verifyUser } from "../middlewares/auth.middleware.js";
import { createEventPrize } from "../controller/eventPrizeController.js";
import { createRound } from "../controller/eventRoundController.js";
import { createRegistrationForm, getForm, updateForm } from "../controller/registrationFormController.js";
import { createRegistration } from "../controller/registrationController.js";

const upcomingEventRoute = express.Router();

upcomingEventRoute.post('/createupcomingevent', verifyClub, createUpcomingEvent, createEventPrize, createRound);
upcomingEventRoute.get('/event/:eventId', getUpcomingEventDetails);
upcomingEventRoute.put('/update-event/:eventId', verifyClub, updateUpcomingEvent)
upcomingEventRoute.get('/event-management/:eventId', verifyClub, getEventManagementDetails);

upcomingEventRoute.post('/register/:eventId/:formId', verifyUser, createRegistration);
upcomingEventRoute.post('/change-reg/:eventId', verifyClub, toggleRegistrationStatus);
upcomingEventRoute.post('/create-form/:eventId', verifyClub, createRegistrationForm);
upcomingEventRoute.get('/getform/:eventId', getForm);
upcomingEventRoute.put('/update-form/:eventId', verifyClub, updateForm);

upcomingEventRoute.post('/transfer-event/:eventId', verifyClub, transferEvent)
upcomingEventRoute.delete('/delete-event/:eventId', verifyClub, deleteUpcomingEvent)

export default upcomingEventRoute;