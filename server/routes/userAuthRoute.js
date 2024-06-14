import express from 'express'
import { logout, refreshAccessToken, signin, signup } from '../controller/userAuthController.js'
import { verifyUser } from '../middlewares/auth.middleware.js'

const userAuthRoute = express()

userAuthRoute.post('/signup', signup)
userAuthRoute.post('/signin', signin)
userAuthRoute.post('/logout', verifyUser,logout)
userAuthRoute.post('/refreshtoken', refreshAccessToken)

export default userAuthRoute