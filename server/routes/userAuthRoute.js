import express from 'express'
import { signup } from '../controller/userAuthController.js'

const userAuthRoute = express()

userAuthRoute.post('/signup', signup)

export default userAuthRoute