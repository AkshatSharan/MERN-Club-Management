import express from "express";
import { getAllClubs, getClubsWithUpcomingEvents, getUpcomingEvents, updateClub } from "../controller/clubController.js";
import { verifyClub } from "../middlewares/auth.middleware.js";

const clubRoute = express.Router()

clubRoute.get("/getallclubs", getAllClubs);
clubRoute.get("/getallclubswithupcomingevents", getClubsWithUpcomingEvents);
clubRoute.post("/update", verifyClub, updateClub);
clubRoute.get("/getupcomingevents", verifyClub, getUpcomingEvents);

export default clubRoute