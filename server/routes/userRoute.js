import express from "express";
import { deleteUser, getAllUser, getSpecificUser, updateUser } from "../controller/userController.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const userRoute = express.Router();

userRoute.get("/getalluser", getAllUser)
userRoute.get("/getspecificuser/:email", getSpecificUser)
userRoute.delete('/deleteuser/:email', deleteUser)
userRoute.post('/update', verifyUser, updateUser)

export default userRoute;