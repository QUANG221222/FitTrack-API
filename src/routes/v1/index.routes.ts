import express from 'express'
import { userRoutes } from './user.routes'
import { adminRoutes } from './admin.routes'
import { muscleGroupRoutes } from './muscleGroup.routes'
import { exerciseRoutes } from './exercise.routes'
import { authRoutes } from './auth.routes'
import { workoutPlanRoutes } from './workoutPlan.routes'
import { workoutSessionRoutes } from './workoutSession.routes'

const Router = express.Router()

Router.use('/users', userRoutes)

Router.use('/admins', adminRoutes)

Router.use('/muscle-groups', muscleGroupRoutes)

Router.use('/exercises', exerciseRoutes)

Router.use('/auth', authRoutes)

Router.use('/workout-plans', workoutPlanRoutes)

Router.use('/workout-sessions', workoutSessionRoutes)

export const APIs_V1: express.Router = Router
