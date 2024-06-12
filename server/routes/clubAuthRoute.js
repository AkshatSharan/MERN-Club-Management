import express from 'express'
import { signup } from '../controller/clubAuthController.js'

const clubAuthRoute = express()

clubAuthRoute.post('/signup', signup)

export default clubAuthRoute