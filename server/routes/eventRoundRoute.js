import express from "express";
import { createRound, deleteRound, getEventRounds, updateRound } from "../controller/eventRoundController.js";
import { verifyClub } from "../middlewares/auth.middleware.js";

const eventRoundRoute = express.Router();

eventRoundRoute.get('/eventrounds/:eventId', getEventRounds);
eventRoundRoute.post('/createeventround', verifyClub, createRound);
eventRoundRoute.put('/update/:id', verifyClub, updateRound);
eventRoundRoute.delete('/delete/:id', verifyClub, deleteRound);

export default eventRoundRoute;
