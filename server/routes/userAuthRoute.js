import express from 'express'
import { signin, signup } from '../controller/userAuthController.js'

const userAuthRoute = express()

userAuthRoute.post('/signup', signup)
userAuthRoute.post('/signin', signin)

export default userAuthRoute