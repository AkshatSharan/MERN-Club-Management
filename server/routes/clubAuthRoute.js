import express from 'express'
import { logout, signin, signup } from '../controller/clubAuthController.js'

const clubAuthRoute = express()

clubAuthRoute.post('/signup', signup)
clubAuthRoute.post('/signin', signin)
clubAuthRoute.post('/logout', logout)

export default clubAuthRoute