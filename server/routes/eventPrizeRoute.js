import express from "express";
import { createEventPrize, getEventPrizes, deleteEventPrize } from "../controller/eventPrizeController.js";

const eventPrizeRoute = express.Router();

eventPrizeRoute.get('/eventprizes/:eventId', getEventPrizes);
eventPrizeRoute.post('/createeventprize', createEventPrize);
eventPrizeRoute.delete('/deleteeventprize/:id', deleteEventPrize);

export default eventPrizeRoute;
