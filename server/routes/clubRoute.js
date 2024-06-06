import express from "express";
import { createClub, getAllClubs } from "../controller/clubController.js";

const clubRoute = express.Router()

clubRoute.post("/createclub", createClub); 
clubRoute.get("/getallclubs", getAllClubs);

export default clubRoute