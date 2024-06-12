import express from 'express'
import { signin, signup } from '../controller/clubAuthController.js'

const clubAuthRoute = express()

clubAuthRoute.post('/signup', signup)
clubAuthRoute.post('/signin', signin)

export default clubAuthRoute