import express from "express";
import { createRound, getEventRounds, deleteEventRound } from "../controller/eventRoundController.js";

const eventRoundRoute = express.Router();

eventRoundRoute.get('/eventrounds/:eventId', getEventRounds);
eventRoundRoute.post('/createeventround', createRound);
eventRoundRoute.delete('/deleteeventround/:id', deleteEventRound);

export default eventRoundRoute;
