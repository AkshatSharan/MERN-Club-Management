import express from "express";
import { createRecruitment } from "../controller/recruitmentController.js";

const recruitmentRoute = express.Router()

recruitmentRoute.post("/create", createRecruitment);

export default recruitmentRoute