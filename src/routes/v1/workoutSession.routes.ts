import express from 'express'
import { workoutSessionController } from '~/controllers/workoutSession.controller'
import { workoutSessionValidation } from '~/validations/workoutSession.validation'
import { authHandlingMiddleware } from '~/middlewares/authHandling.middleware'

const Router = express.Router()

// All routes require authentication (users can only manage their own workout sessions)

Router.post(
  '/',
  authHandlingMiddleware.isAuthorized,
  workoutSessionValidation.createNew,
  workoutSessionController.createNew
)

Router.get(
  '/',
  authHandlingMiddleware.isAuthorized,
  workoutSessionController.getAll
)

Router.get(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  workoutSessionValidation.validateId,
  workoutSessionController.getOneById
)

Router.put(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  workoutSessionValidation.update,
  workoutSessionController.update
)

Router.delete(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  workoutSessionValidation.validateId,
  workoutSessionController.deleteOne
)

export const workoutSessionRoutes: express.Router = Router
