import express from "express";
import { createEventPrize, deletePrize, getEventPrizes, updatePrize} from "../controller/eventPrizeController.js";
import { verifyClub } from "../middlewares/auth.middleware.js";

const eventPrizeRoute = express.Router();

eventPrizeRoute.get('/eventprizes/:eventId', getEventPrizes);
eventPrizeRoute.post('/createeventprize', verifyClub, createEventPrize);
eventPrizeRoute.put('/update/:id', verifyClub, updatePrize);
eventPrizeRoute.delete('/delete/:id', verifyClub, deletePrize);

export default eventPrizeRoute;
