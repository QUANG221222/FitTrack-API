import express from 'express'
import { userRoutes } from './user.routes'
import { adminRoutes } from './admin.routes'
import { authRoutes } from './auth.routes'

const Router = express.Router()

Router.use('/users', userRoutes)

Router.use('/admins', adminRoutes)

Router.use('/auth', authRoutes)

Router.use

export const APIs_V1: express.Router = Router
