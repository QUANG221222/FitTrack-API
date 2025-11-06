import express from 'express'
import { metricEntryController } from '~/controllers/metricEntry.controller'
import { metricEntryValidation } from '~/validations/metricEntry.validation'
import { authHandlingMiddleware } from '~/middlewares/authHandling.middleware'

const Router = express.Router()

// All routes require authentication (users can only manage their own metric entries)

Router.post(
  '/',
  authHandlingMiddleware.isAuthorized,
  metricEntryValidation.createNew,
  metricEntryController.createNew
)

Router.get(
  '/',
  authHandlingMiddleware.isAuthorized,
  metricEntryController.getAll
)

Router.get(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  metricEntryValidation.validateId,
  metricEntryController.getOneById
)

Router.put(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  metricEntryValidation.update,
  metricEntryController.update
)

Router.delete(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  metricEntryValidation.validateId,
  metricEntryController.deleteOne
)

export const metricEntryRoutes: express.Router = Router
