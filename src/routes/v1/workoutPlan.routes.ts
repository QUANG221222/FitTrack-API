import express from 'express'
import { workoutPlanController } from '~/controllers/workoutPlan.controller'
import { workoutPlanValidation } from '~/validations/workoutPlan.validation'
import { authHandlingMiddleware } from '~/middlewares/authHandling.middleware'

const Router = express.Router()

// All routes require authentication (users can only manage their own workout plans)

Router.post(
  '/',
  authHandlingMiddleware.isAuthorized,
  workoutPlanValidation.createNew,
  workoutPlanController.createNew
)

Router.get(
  '/',
  authHandlingMiddleware.isAuthorized,
  workoutPlanController.getAll
)

Router.get(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  workoutPlanValidation.validateId,
  workoutPlanController.getOneById
)

Router.put(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  workoutPlanValidation.update,
  workoutPlanController.update
)

Router.delete(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  workoutPlanValidation.validateId,
  workoutPlanController.deleteOne
)

export const workoutPlanRoutes: express.Router = Router
