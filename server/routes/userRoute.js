import express from "express";
import { deleteNotification, deleteUser, getAllUser, getNotifications, getSpecificUser, updateUser } from "../controller/userController.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const userRoute = express.Router();

userRoute.get("/getalluser", getAllUser)
userRoute.delete('/deleteuser/:email', deleteUser)
userRoute.post('/update', verifyUser, updateUser)
userRoute.get("/getspecificuser", verifyUser, getSpecificUser)
userRoute.get("/notifications", verifyUser, getNotifications)
userRoute.delete("/delete-notification/:notificationText", verifyUser, deleteNotification)

export default userRoute;