import express from "express"
import { createApplicationForm, getApplicationForm, updateApplicationForm } from "../controller/applicationFormController.js"
import {verifyClub} from '../middlewares/auth.middleware.js'

const applicationRoute = express.Router()

applicationRoute.post('/create-application/:clubId', verifyClub, createApplicationForm)
applicationRoute.put('/update-application/:formId', verifyClub, updateApplicationForm)
applicationRoute.get('/get-application/:clubId', getApplicationForm)

export default applicationRoute 