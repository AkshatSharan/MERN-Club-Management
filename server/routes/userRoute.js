import express from "express";
import { deleteUser, getAllUser, getSpecificUser, updateUser } from "../controller/userController.js";

const userRoute = express.Router();

userRoute.get("/getalluser", getAllUser)
userRoute.get("/getspecificuser/:email", getSpecificUser)
userRoute.put('/updateuser/:email', updateUser)
userRoute.delete('/deleteuser/:email', deleteUser)

export default userRoute;