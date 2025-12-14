import express from 'express'
import { userRoutes } from './user.routes'
import { adminRoutes } from './admin.routes'
import { muscleGroupRoutes } from './muscleGroup.routes'
import { exerciseRoutes } from './exercise.routes'
import { authRoutes } from './auth.routes'
import { workoutPlanRoutes } from './workoutPlan.routes'
import { workoutSessionRoutes } from './workoutSession.routes'
import { metricEntryRoutes } from './metricEntry.routes'
import { goalRoutes } from './goal.routes'
import { progressPhotoRoutes } from './progressPhoto.routes'
import { blogRoutes } from './blog.routes'
import { dashboardRouter } from './dashboard.routes'
import { threadRoutes } from './thread.routes'

const Router = express.Router()

Router.use('/users', userRoutes)

Router.use('/admins', adminRoutes)

Router.use('/muscle-groups', muscleGroupRoutes)

Router.use('/exercises', exerciseRoutes)

Router.use('/auth', authRoutes)

Router.use('/workout-plans', workoutPlanRoutes)

Router.use('/workout-sessions', workoutSessionRoutes)

Router.use('/metric-entries', metricEntryRoutes)

Router.use('/goals', goalRoutes)

Router.use('/progress-photos', progressPhotoRoutes)

Router.use('/blogs', blogRoutes)

Router.use('/dashboard', dashboardRouter)

Router.use('/threads', threadRoutes)

export const APIs_V1: express.Router = Router
