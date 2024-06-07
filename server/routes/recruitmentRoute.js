import express from "express";
import { createRecruitment, getCurrentlyRecruiting, toggleRecruiting } from "../controller/recruitmentController.js";

const recruitmentRoute = express.Router();

recruitmentRoute.post("/createrecruitment", createRecruitment);
recruitmentRoute.get("/getcurrentlyrecruiting", getCurrentlyRecruiting);
recruitmentRoute.put("/togglerecruiting/:id", toggleRecruiting);

export default recruitmentRoute;
