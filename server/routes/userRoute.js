import express from "express";
import { deleteUser, getAllUser, getSpecificUser, updateUser } from "../controller/userController.js";
import { verifyToken } from "../controller/verifyUser.js";

const userRoute = express.Router();

userRoute.get("/getalluser", getAllUser)
userRoute.get("/getspecificuser/:email", getSpecificUser)
userRoute.delete('/deleteuser/:email', deleteUser)
userRoute.post('/update/:id', verifyToken, updateUser)

export default userRoute;