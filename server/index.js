import express from "express"
import cookieParser from 'cookie-parser'
import mongoose from "mongoose"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import cors from "cors"
import userRoute from "./routes/userRoute.js"
import clubRoute from "./routes/clubRoute.js";
import upcomingEventRoute from "./routes/upcomingEventRoute.js"
import eventPrizeRoute from "./routes/eventPrizeRoute.js"
import eventRoundRoute from "./routes/eventRoundRoute.js"
import clubAuthRoute from "./routes/clubAuthRoute.js"
import userAuthRoute from "./routes/userAuthRoute.js"
import applicationRoute from "./routes/applicationRoute.js"

const app = express()

const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow credentials
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors(corsOptions))
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
app.use('/api/club/application', applicationRoute);
app.use('/api/upcomingevent', upcomingEventRoute);
app.use('/api/upcomingevent/prize', eventPrizeRoute);
app.use('/api/upcomingevent/round', eventRoundRoute);
app.use('/api/auth/user', userAuthRoute);
app.use('/api/auth/club', clubAuthRoute);