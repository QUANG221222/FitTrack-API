import express from 'express'
import { dashboardController } from '~/controllers/dashboard.controller'
import { authHandlingMiddleware } from '~/middlewares/authHandling.middleware'

const Router = express.Router()

Router.get(
  '/total-exercises',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  dashboardController.getTotalExercises
)

Router.get(
  '/total-users',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  dashboardController.getTotalUsers
)

Router.get('/total-users-by-month', authHandlingMiddleware.isAuthorized, authHandlingMiddleware.isAdmin, dashboardController.getTotalUsersByMonth)

Router.get(
  '/total-exercises-by-type',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  dashboardController.countExercisesByType
)

Router.get(
  '/total-muscle-groups',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  dashboardController.getTotalMuscleGroups
)

Router.get(
  '/total-workout-plans',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  dashboardController.getTotalWorkoutPlans
)

export const dashboardRouter: express.Router = Router
