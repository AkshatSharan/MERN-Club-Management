import express from "express";
import { createUser, deleteUser, getAllUser, getSpecificUser, updateUser } from "../controller/userController.js";

const userRoute = express.Router();

userRoute.post("/createuser", createUser);
userRoute.get("/getalluser", getAllUser)
userRoute.get("/getspecificuser/:email", getSpecificUser)
userRoute.put('/updateuser/:email', updateUser)
userRoute.delete('/deleteuser/:email', deleteUser)

export default userRoute;