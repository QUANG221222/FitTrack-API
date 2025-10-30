import express from 'express'
import { userRoutes } from './user.routes'

const Router = express.Router()

Router.use('/users', userRoutes)

export const APIs_V1: express.Router = Router
