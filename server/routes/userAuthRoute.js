import express from 'express'
import { logout, signin, signup } from '../controller/userAuthController.js'

const userAuthRoute = express()

userAuthRoute.post('/signup', signup)
userAuthRoute.post('/signin', signin)
userAuthRoute.post('/logout', logout)

export default userAuthRoute