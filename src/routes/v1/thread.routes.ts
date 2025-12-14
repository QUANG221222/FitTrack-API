import express from 'express'
import { authHandlingMiddleware } from '~/middlewares/authHandling.middleware'
import { threadValidation } from '~/validations/thread.validation'
import { threadController } from '~/controllers/thread.controller'

const Router = express.Router()

Router.post(
  '/',
  authHandlingMiddleware.isAuthorized,
  threadValidation.createNew,
  threadController.createNew
)

Router.get(
  '/',
  authHandlingMiddleware.isAuthorized,
  threadController.getAllThreads
)

Router.delete(
  '/:threadId',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  threadController.deleteThread
)

export const threadRoutes: express.Router = Router
