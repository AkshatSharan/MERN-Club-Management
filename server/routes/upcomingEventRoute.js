import express from "express";
import { createUpcomingEvent, deletePastEvent, deleteUpcomingEvent, getEventManagementDetails, getPastEvent, getUpcomingEventDetails, toggleRegistrationStatus, transferEvent, updateAttendance, updateUpcomingEvent } from "../controller/upcomingEventController.js";
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
upcomingEventRoute.get('/past-event/:eventId', verifyClub, getPastEvent);

upcomingEventRoute.post('/register/:eventId/:formId', verifyUser, createRegistration);
upcomingEventRoute.post('/change-reg/:eventId', verifyClub, toggleRegistrationStatus);
upcomingEventRoute.post('/create-form/:eventId', verifyClub, createRegistrationForm);
upcomingEventRoute.get('/getform/:eventId', getForm);
upcomingEventRoute.put('/update-form/:eventId', verifyClub, updateForm);
upcomingEventRoute.put('/update-attendance/:registrationId', verifyClub, updateAttendance);

upcomingEventRoute.post('/transfer-event/:eventId', verifyClub, transferEvent)
upcomingEventRoute.delete('/delete-event/:eventId', verifyClub, deleteUpcomingEvent)
upcomingEventRoute.delete('/delete-past-event/:eventId', verifyClub, deletePastEvent)

export default upcomingEventRoute;