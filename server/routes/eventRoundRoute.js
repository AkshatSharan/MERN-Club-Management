import express from "express";
import { createEventRound, getEventRounds, deleteEventRound } from "../controller/eventRoundController.js";

const eventRoundRoute = express.Router();

eventRoundRoute.get('/eventrounds/:eventId', getEventRounds);
eventRoundRoute.post('/createeventround', createEventRound);
eventRoundRoute.delete('/deleteeventround/:id', deleteEventRound);

export default eventRoundRoute;
