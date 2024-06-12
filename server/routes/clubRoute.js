import express from "express";
import { getAllClubs, getClubsWithUpcomingEvents } from "../controller/clubController.js";

const clubRoute = express.Router()

clubRoute.get("/getallclubs", getAllClubs);
clubRoute.get("/getallclubswithupcomingevents", getClubsWithUpcomingEvents);

export default clubRoute