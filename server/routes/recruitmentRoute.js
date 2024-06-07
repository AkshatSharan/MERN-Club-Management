import express from "express";
import { createRecruitment } from "../controller/recruitmentController.js";

const recruitmentRoute = express.Router();

recruitmentRoute.post("/createrecruitment", createRecruitment);

export default recruitmentRoute;
