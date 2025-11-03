import express from 'express'
import { exerciseController } from '~/controllers/exercise.controller'
import { exerciseValidation } from '~/validations/exercise.validation'
import { authHandlingMiddleware } from '~/middlewares/authHandling.middleware'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

const Router = express.Router()

// Public routes - Get all exercises and get one by id
Router.get('/', exerciseController.getAll)

Router.get('/:id', exerciseValidation.validateId, exerciseController.getOneById)

// Protected routes - Require authentication (admin only)
Router.post(
  '/',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  CloudinaryProvider.uploadExercise.single('image'),
  exerciseValidation.createNew,
  exerciseController.createNew
)

Router.put(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  CloudinaryProvider.uploadExercise.single('image'),
  exerciseValidation.update,
  exerciseController.update
)

Router.delete(
  '/:id',
  authHandlingMiddleware.isAuthorized,
  authHandlingMiddleware.isAdmin,
  exerciseValidation.validateId,
  exerciseController.deleteOne
)

export const exerciseRoutes: express.Router = Router
