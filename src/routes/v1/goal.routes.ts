import express from 'express'
import { goalController } from '~/controllers/goal.controller'
import { goalValidation } from '~/validations/goal.validation'
import { authHandlingMiddleware } from '~/middlewares/authHandling.middleware'

const Router = express.Router()

// All routes require authentication (users can only manage their own goals)

Router.post(
  '/',
  authHandlingMiddleware.isAuthorized,
  goalValidation.createNew,
  goalController.createNew
)

Router.get('/', authHandlingMiddleware.isAuthorized, goalController.getAll)

Router.get(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  goalValidation.validateId,
  goalController.getOneById
)

Router.put(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  goalValidation.update,
  goalController.update
)

Router.delete(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  goalValidation.validateId,
  goalController.deleteOne
)

export const goalRoutes: express.Router = Router
