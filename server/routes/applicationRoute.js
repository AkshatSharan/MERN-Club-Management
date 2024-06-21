import express from "express"
import { alreadyApplied, createApplicationForm, getApplicationForm, getApplicationFormAdmin, submitApplication, updateApplicationForm } from "../controller/applicationFormController.js"
import {verifyClub, verifyUser} from '../middlewares/auth.middleware.js'

const applicationRoute = express.Router()

applicationRoute.post('/create-application/:clubId', verifyClub, createApplicationForm)
applicationRoute.put('/update-application/:formId', verifyClub, updateApplicationForm)
applicationRoute.get('/get-application/:clubId', getApplicationForm)
applicationRoute.get('/get-application-admin/:clubId', getApplicationFormAdmin)

applicationRoute.post('/submit-application', verifyUser, submitApplication)
applicationRoute.get('/already-applied/:clubId', verifyUser, alreadyApplied)

export default applicationRoute 