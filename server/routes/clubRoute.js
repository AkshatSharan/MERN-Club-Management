import express from "express";
import { createClub, getAllClubs, getClubsWithUpcomingEvents } from "../controller/clubController.js";

const clubRoute = express.Router()

clubRoute.post("/createclub", createClub); 
clubRoute.get("/getallclubs", getAllClubs);
clubRoute.get("/getallclubswithupcomingevents", getClubsWithUpcomingEvents);

export default clubRoute