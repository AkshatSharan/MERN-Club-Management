import express from 'express'
import { logout, refreshTokenForClub, signin, signup } from '../controller/clubAuthController.js'

const clubAuthRoute = express()

clubAuthRoute.post('/signup', signup)
clubAuthRoute.post('/signin', signin)
clubAuthRoute.post('/logout', logout)
clubAuthRoute.post('/refresh', refreshTokenForClub)

export default clubAuthRoute