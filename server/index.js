import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import cors from "cors"

const app = express()

app.use(bodyParser.json())
app.use(cors())
dotenv.config()

