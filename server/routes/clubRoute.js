import express from "express";
import { getAllClubs, getClubDetails, getClubsRecruiting, getClubsWithUpcomingEvents, getUpcomingEvents, toggleRecruiting, updateClub } from "../controller/clubController.js";
import { verifyClub } from "../middlewares/auth.middleware.js";

const clubRoute = express.Router()

clubRoute.get("/getallclubs", getAllClubs);
clubRoute.get("/getallclubswithupcomingevents", getClubsWithUpcomingEvents);
clubRoute.post("/update", verifyClub, updateClub);
clubRoute.get("/getupcomingevents", verifyClub, getUpcomingEvents);
clubRoute.get("/get-club", verifyClub, getClubDetails);
clubRoute.get("/get-recruitments", getClubsRecruiting);
clubRoute.put("/toggle-recruiting", verifyClub, toggleRecruiting);

export default clubRoute