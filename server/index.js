import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import cors from "cors"
import userRoute from "./routes/userRoute.js"
import clubRoute from "./routes/clubRoute.js";
import recruitmentRoute from "./routes/recruitmentRoute.js"
import upcomingEventRoute from "./routes/upcomingEventRoute.js"

const app = express()

app.use(bodyParser.json())
app.use(cors())
dotenv.config()

const PORT = process.env.PORT || 4000
const URL = process.env.MONGOURL

mongoose.connect(URL).then(() => {

    console.log("DB connected successfully")

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })

}).catch(error => console.log(error))

app.use('/api/user', userRoute)
app.use('/api/club', clubRoute);
app.use('/api/recruitment', recruitmentRoute);
app.use('/api/upcomingevent', upcomingEventRoute);